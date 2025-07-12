const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Order = require('../models/Order');
const Exchange = require('../models/Exchange');
const { authenticateUser } = require('../middleware/auth');
const { userValidation, paramValidation } = require('../middleware/validation');
const { successResponse, errorResponse } = require('../utils/responseUtils');
const { getPaginationParams, getPaginationData } = require('../utils/paginationUtils');

// Get user dashboard stats
router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user statistics
    const [
      uploadedItems,
      purchaseHistory,
      exchangeHistory,
      totalSpent
    ] = await Promise.all([
      Item.countDocuments({ uploadedBy: userId }),
      Order.countDocuments({ buyer: userId }),
      Exchange.countDocuments({ $or: [{ requester: userId }, { owner: userId }] }),
      Order.aggregate([
        { $match: { buyer: userId, 'paymentDetails.paymentStatus': 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    const stats = {
      totalUploads: uploadedItems,
      totalPurchases: purchaseHistory,
      totalExchanges: exchangeHistory,
      totalSpent: totalSpent[0]?.total || 0,
      pointsBalance: req.user.pointsBalance
    };

    successResponse(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    console.error('Dashboard stats error:', error);
    errorResponse(res, 'Failed to retrieve dashboard stats', 500);
  }
});

// Get user's uploaded items
router.get('/uploaded-items', authenticateUser, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { status } = req.query;

    let query = { uploadedBy: req.user._id };
    if (status) {
      query.status = status;
    }

    const [items, totalCount] = await Promise.all([
      Item.find(query)
        .populate('uploadedBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Item.countDocuments(query)
    ]);

    const pagination = getPaginationData(totalCount, page, limit);

    successResponse(res, { items, pagination }, 'Uploaded items retrieved successfully');
  } catch (error) {
    console.error('Uploaded items error:', error);
    errorResponse(res, 'Failed to retrieve uploaded items', 500);
  }
});

// Get user's purchase history
router.get('/purchases', authenticateUser, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const [orders, totalCount] = await Promise.all([
      Order.find({ buyer: req.user._id })
        .populate('items.item', 'title images mainImage')
        .populate('seller', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ buyer: req.user._id })
    ]);

    const pagination = getPaginationData(totalCount, page, limit);

    successResponse(res, { orders, pagination }, 'Purchase history retrieved successfully');
  } catch (error) {
    console.error('Purchase history error:', error);
    errorResponse(res, 'Failed to retrieve purchase history', 500);
  }
});

// Get user's exchange history
router.get('/exchanges', authenticateUser, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const userId = req.user._id;

    const [exchanges, totalCount] = await Promise.all([
      Exchange.find({
        $or: [{ requester: userId }, { owner: userId }]
      })
        .populate('requester', 'firstName lastName')
        .populate('owner', 'firstName lastName')
        .populate('requestedItem', 'title images mainImage price')
        .populate('offeredItems.item', 'title images mainImage price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Exchange.countDocuments({
        $or: [{ requester: userId }, { owner: userId }]
      })
    ]);

    const pagination = getPaginationData(totalCount, page, limit);

    successResponse(res, { exchanges, pagination }, 'Exchange history retrieved successfully');
  } catch (error) {
    console.error('Exchange history error:', error);
    errorResponse(res, 'Failed to retrieve exchange history', 500);
  }
});

// Get user's points history
router.get('/points-history', authenticateUser, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const userId = req.user._id;

    // Get points earned from purchases
    const [purchases, exchanges] = await Promise.all([
      Order.find({ 
        buyer: userId, 
        'paymentDetails.paymentStatus': 'completed' 
      })
        .populate('items.item', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Exchange.find({
        $or: [{ requester: userId }, { owner: userId }],
        status: 'completed'
      })
        .populate('requestedItem', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ]);

    // Format points history
    const pointsHistory = [
      ...purchases.map(order => ({
        type: 'earned',
        points: order.pointsEarned,
        description: `Purchase: ${order.items[0]?.item?.title}`,
        date: order.createdAt,
        orderId: order.orderId
      })),
      ...exchanges.map(exchange => ({
        type: 'earned',
        points: 100, // Exchange points
        description: `Exchange: ${exchange.requestedItem?.title}`,
        date: exchange.createdAt,
        exchangeId: exchange.exchangeId
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalCount = pointsHistory.length;
    const pagination = getPaginationData(totalCount, page, limit);

    successResponse(res, { 
      pointsHistory: pointsHistory.slice(skip, skip + limit), 
      currentBalance: req.user.pointsBalance,
      pagination 
    }, 'Points history retrieved successfully');
  } catch (error) {
    console.error('Points history error:', error);
    errorResponse(res, 'Failed to retrieve points history', 500);
  }
});

// Update user statistics (internal use)
router.put('/stats/:id', paramValidation.mongoId, async (req, res) => {
  try {
    const { statType, increment = 1 } = req.body;
    const validStats = ['totalUploads', 'totalPurchases', 'totalExchanges', 'totalPointsEarned', 'totalPointsSpent'];
    
    if (!validStats.includes(statType)) {
      return errorResponse(res, 'Invalid stat type', 400);
    }

    const updateField = `statistics.${statType}`;
    await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { [updateField]: increment } }
    );

    successResponse(res, null, 'User statistics updated successfully');
  } catch (error) {
    console.error('Update stats error:', error);
    errorResponse(res, 'Failed to update user statistics', 500);
  }
});

module.exports = router;
