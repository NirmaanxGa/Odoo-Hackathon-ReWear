const express = require('express');
const router = express.Router();
const Exchange = require('../models/Exchange');
const Item = require('../models/Item');
const User = require('../models/User');
const { authenticateUser } = require('../middleware/auth');
const { exchangeValidation, paramValidation } = require('../middleware/validation');
const { successResponse, errorResponse } = require('../utils/responseUtils');
const { generateExchangeId } = require('../utils/generateIds');
const { getPaginationParams, getPaginationData } = require('../utils/paginationUtils');

// Create exchange request
router.post('/', authenticateUser, exchangeValidation.create, async (req, res) => {
  try {
    const { requestedItem, offeredItems, message, exchangeType, cashDifference } = req.body;
    const requesterId = req.user._id;

    // Validate requested item
    const requestedItemDoc = await Item.findById(requestedItem).populate('uploadedBy');
    
    if (!requestedItemDoc) {
      return errorResponse(res, 'Requested item not found', 404);
    }

    if (requestedItemDoc.status !== 'approved') {
      return errorResponse(res, 'Requested item is not available', 400);
    }

    if (!requestedItemDoc.availability.forExchange) {
      return errorResponse(res, 'Item is not available for exchange', 400);
    }

    if (requestedItemDoc.uploadedBy._id.toString() === requesterId.toString()) {
      return errorResponse(res, 'Cannot request exchange for your own item', 400);
    }

    // Validate offered items
    const offeredItemsData = [];
    let totalOfferedValue = 0;

    for (const offeredItem of offeredItems) {
      const item = await Item.findById(offeredItem.item);
      
      if (!item) {
        return errorResponse(res, `Offered item not found: ${offeredItem.item}`, 404);
      }

      if (item.uploadedBy.toString() !== requesterId.toString()) {
        return errorResponse(res, 'You can only offer your own items', 403);
      }

      if (item.status !== 'approved') {
        return errorResponse(res, `Offered item not available: ${item.title}`, 400);
      }

      offeredItemsData.push({
        item: item._id,
        estimatedValue: offeredItem.estimatedValue || item.price
      });

      totalOfferedValue += offeredItem.estimatedValue || item.price;
    }

    // Create exchange request
    const exchange = new Exchange({
      exchangeId: generateExchangeId(),
      requester: requesterId,
      owner: requestedItemDoc.uploadedBy._id,
      requestedItem,
      offeredItems: offeredItemsData,
      message: message || '',
      exchangeType: exchangeType || 'item-for-item',
      cashDifference: cashDifference || 0,
      whoPays: cashDifference > 0 ? (totalOfferedValue < requestedItemDoc.price ? 'requester' : 'owner') : 'none'
    });

    await exchange.save();

    // Update item statistics
    await Item.findByIdAndUpdate(requestedItem, {
      $inc: { 'statistics.exchangeRequests': 1 }
    });

    const populatedExchange = await Exchange.findById(exchange._id)
      .populate('requester', 'firstName lastName email')
      .populate('owner', 'firstName lastName email')
      .populate('requestedItem')
      .populate('offeredItems.item');

    successResponse(res, populatedExchange, 'Exchange request created successfully', 201);
  } catch (error) {
    console.error('Create exchange error:', error);
    errorResponse(res, 'Failed to create exchange request', 500);
  }
});

// Get exchange requests
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { type = 'all', status } = req.query;
    const userId = req.user._id;

    let query = {};
    
    if (type === 'sent') {
      query.requester = userId;
    } else if (type === 'received') {
      query.owner = userId;
    } else {
      query.$or = [{ requester: userId }, { owner: userId }];
    }

    if (status) {
      query.status = status;
    }

    const [exchanges, totalCount] = await Promise.all([
      Exchange.find(query)
        .populate('requester', 'firstName lastName email profileImage')
        .populate('owner', 'firstName lastName email profileImage')
        .populate('requestedItem', 'title images mainImage price condition')
        .populate('offeredItems.item', 'title images mainImage price condition')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Exchange.countDocuments(query)
    ]);

    const pagination = getPaginationData(totalCount, page, limit);

    successResponse(res, { exchanges, pagination }, 'Exchange requests retrieved successfully');
  } catch (error) {
    console.error('Get exchanges error:', error);
    errorResponse(res, 'Failed to retrieve exchange requests', 500);
  }
});

// Get single exchange
router.get('/:id', authenticateUser, paramValidation.mongoId, async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id)
      .populate('requester', 'firstName lastName email phone profileImage')
      .populate('owner', 'firstName lastName email phone profileImage')
      .populate('requestedItem')
      .populate('offeredItems.item');

    if (!exchange) {
      return errorResponse(res, 'Exchange not found', 404);
    }

    // Check if user is involved in the exchange
    const userId = req.user._id.toString();
    if (exchange.requester._id.toString() !== userId && exchange.owner._id.toString() !== userId) {
      return errorResponse(res, 'Unauthorized to view this exchange', 403);
    }

    successResponse(res, exchange, 'Exchange retrieved successfully');
  } catch (error) {
    console.error('Get exchange error:', error);
    errorResponse(res, 'Failed to retrieve exchange', 500);
  }
});

// Respond to exchange request
router.put('/:id/respond', authenticateUser, paramValidation.mongoId, exchangeValidation.respond, async (req, res) => {
  try {
    const { status, responseMessage } = req.body;
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return errorResponse(res, 'Exchange not found', 404);
    }

    // Check if user is the owner of the requested item
    if (exchange.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized to respond to this exchange', 403);
    }

    if (exchange.status !== 'pending') {
      return errorResponse(res, 'Exchange request has already been responded to', 400);
    }

    const updates = {
      status,
      responseMessage: responseMessage || ''
    };

    if (status === 'accepted') {
      updates.completionDate = new Date();
      
      // Update item statuses
      const itemIds = [
        exchange.requestedItem,
        ...exchange.offeredItems.map(item => item.item)
      ];

      await Item.updateMany(
        { _id: { $in: itemIds } },
        { status: 'exchanged' }
      );

      // Update user statistics
      await Promise.all([
        User.findByIdAndUpdate(exchange.requester, {
          $inc: { 
            'statistics.totalExchanges': 1,
            pointsBalance: 100 // Bonus points for successful exchange
          }
        }),
        User.findByIdAndUpdate(exchange.owner, {
          $inc: { 
            'statistics.totalExchanges': 1,
            pointsBalance: 100 // Bonus points for successful exchange
          }
        })
      ]);
    }

    const updatedExchange = await Exchange.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
      .populate('requester', 'firstName lastName email')
      .populate('owner', 'firstName lastName email')
      .populate('requestedItem')
      .populate('offeredItems.item');

    successResponse(res, updatedExchange, `Exchange ${status} successfully`);
  } catch (error) {
    console.error('Respond to exchange error:', error);
    errorResponse(res, 'Failed to respond to exchange request', 500);
  }
});

// Cancel exchange request
router.put('/:id/cancel', authenticateUser, paramValidation.mongoId, async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return errorResponse(res, 'Exchange not found', 404);
    }

    // Check if user is the requester
    if (exchange.requester.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized to cancel this exchange', 403);
    }

    if (!['pending', 'accepted'].includes(exchange.status)) {
      return errorResponse(res, 'Cannot cancel this exchange', 400);
    }

    // If exchange was accepted, make items available again
    if (exchange.status === 'accepted') {
      const itemIds = [
        exchange.requestedItem,
        ...exchange.offeredItems.map(item => item.item)
      ];

      await Item.updateMany(
        { _id: { $in: itemIds } },
        { status: 'approved' }
      );
    }

    await Exchange.findByIdAndUpdate(req.params.id, {
      status: 'cancelled'
    });

    successResponse(res, null, 'Exchange cancelled successfully');
  } catch (error) {
    console.error('Cancel exchange error:', error);
    errorResponse(res, 'Failed to cancel exchange', 500);
  }
});

// Update shipping details
router.put('/:id/shipping', authenticateUser, paramValidation.mongoId, async (req, res) => {
  try {
    const { type, trackingNumber, carrier, status } = req.body; // type: 'requester' or 'owner'
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return errorResponse(res, 'Exchange not found', 404);
    }

    if (exchange.status !== 'accepted') {
      return errorResponse(res, 'Exchange must be accepted to update shipping', 400);
    }

    const userId = req.user._id.toString();
    
    // Validate user can update shipping
    if (type === 'requester' && exchange.requester.toString() !== userId) {
      return errorResponse(res, 'Unauthorized to update requester shipping', 403);
    }
    if (type === 'owner' && exchange.owner.toString() !== userId) {
      return errorResponse(res, 'Unauthorized to update owner shipping', 403);
    }

    const shippingField = `shippingDetails.${type}Shipping`;
    const updateData = {};
    updateData[shippingField] = {
      trackingNumber,
      carrier,
      status
    };

    // Check if both parties have shipped to complete exchange
    const updatedExchange = await Exchange.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    const bothShipped = updatedExchange.shippingDetails.requesterShipping?.status === 'shipped' &&
                       updatedExchange.shippingDetails.ownerShipping?.status === 'shipped';

    if (bothShipped) {
      await Exchange.findByIdAndUpdate(req.params.id, {
        status: 'completed'
      });
    }

    successResponse(res, updatedExchange, 'Shipping details updated successfully');
  } catch (error) {
    console.error('Update shipping error:', error);
    errorResponse(res, 'Failed to update shipping details', 500);
  }
});

// Rate exchange partner
router.put('/:id/rate', authenticateUser, paramValidation.mongoId, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return errorResponse(res, 'Exchange not found', 404);
    }

    if (exchange.status !== 'completed') {
      return errorResponse(res, 'Can only rate completed exchanges', 400);
    }

    const userId = req.user._id.toString();
    let ratingField;

    if (exchange.requester.toString() === userId) {
      ratingField = 'rating.requesterRating';
    } else if (exchange.owner.toString() === userId) {
      ratingField = 'rating.ownerRating';
    } else {
      return errorResponse(res, 'Unauthorized to rate this exchange', 403);
    }

    const updateData = {};
    updateData[ratingField] = { rating, review };

    await Exchange.findByIdAndUpdate(req.params.id, updateData);

    successResponse(res, null, 'Rating submitted successfully');
  } catch (error) {
    console.error('Rate exchange error:', error);
    errorResponse(res, 'Failed to submit rating', 500);
  }
});

module.exports = router;
