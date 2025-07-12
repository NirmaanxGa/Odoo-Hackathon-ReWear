const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Item = require('../models/Item');
const User = require('../models/User');
const Cart = require('../models/Cart');
const { authenticateUser } = require('../middleware/auth');
const { orderValidation, paramValidation } = require('../middleware/validation');
const { successResponse, errorResponse } = require('../utils/responseUtils');
const { generateOrderId, generateTrackingNumber } = require('../utils/generateIds');
const { getPaginationParams, getPaginationData } = require('../utils/paginationUtils');

// Create new order
router.post('/', authenticateUser, orderValidation.create, async (req, res) => {
  try {
    const { items, shippingAddress, paymentDetails } = req.body;
    const buyerId = req.user._id;

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const orderItem of items) {
      const item = await Item.findById(orderItem.item);
      
      if (!item) {
        return errorResponse(res, `Item not found: ${orderItem.item}`, 404);
      }

      if (item.status !== 'approved') {
        return errorResponse(res, `Item not available: ${item.title}`, 400);
      }

      if (item.uploadedBy.toString() === buyerId.toString()) {
        return errorResponse(res, 'Cannot purchase your own item', 400);
      }

      orderItems.push({
        item: item._id,
        title: item.title,
        price: item.price,
        size: orderItem.size,
        quantity: orderItem.quantity || 1,
        image: item.mainImage?.url || item.images[0]?.url
      });

      totalAmount += item.price * (orderItem.quantity || 1);
    }

    // Create order
    const order = new Order({
      orderId: generateOrderId(),
      buyer: buyerId,
      seller: orderItems[0].item.uploadedBy, // For now, single seller per order
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentDetails: {
        ...paymentDetails,
        paymentStatus: 'completed' // Assuming payment is processed via Clerk
      },
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    await order.save();

    // Update item status and user statistics
    await Promise.all([
      Item.updateMany(
        { _id: { $in: orderItems.map(item => item.item) } },
        { status: 'sold' }
      ),
      User.findByIdAndUpdate(buyerId, {
        $inc: {
          'statistics.totalPurchases': 1,
          pointsBalance: order.pointsEarned
        }
      })
    ]);

    // Clear cart items if they exist
    await Cart.findOneAndUpdate(
      { user: buyerId },
      { $pull: { items: { item: { $in: orderItems.map(item => item.item) } } } }
    );

    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'firstName lastName email')
      .populate('seller', 'firstName lastName email')
      .populate('items.item');

    successResponse(res, populatedOrder, 'Order created successfully', 201);
  } catch (error) {
    console.error('Create order error:', error);
    errorResponse(res, 'Failed to create order', 500);
  }
});

// Get user's orders
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { type = 'purchases' } = req.query;
    const userId = req.user._id;

    let query = {};
    if (type === 'purchases') {
      query.buyer = userId;
    } else if (type === 'sales') {
      query.seller = userId;
    }

    const [orders, totalCount] = await Promise.all([
      Order.find(query)
        .populate('buyer', 'firstName lastName email')
        .populate('seller', 'firstName lastName email')
        .populate('items.item', 'title images mainImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);

    const pagination = getPaginationData(totalCount, page, limit);

    successResponse(res, { orders, pagination }, 'Orders retrieved successfully');
  } catch (error) {
    console.error('Get orders error:', error);
    errorResponse(res, 'Failed to retrieve orders', 500);
  }
});

// Get single order
router.get('/:id', authenticateUser, paramValidation.mongoId, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'firstName lastName email phone')
      .populate('seller', 'firstName lastName email phone')
      .populate('items.item');

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Check if user is buyer or seller
    const userId = req.user._id.toString();
    if (order.buyer._id.toString() !== userId && order.seller._id.toString() !== userId) {
      return errorResponse(res, 'Unauthorized to view this order', 403);
    }

    successResponse(res, order, 'Order retrieved successfully');
  } catch (error) {
    console.error('Get order error:', error);
    errorResponse(res, 'Failed to retrieve order', 500);
  }
});

// Update order status (for sellers)
router.put('/:id/status', authenticateUser, paramValidation.mongoId, async (req, res) => {
  try {
    const { status, trackingNumber, carrier } = req.body;
    const validStatuses = ['confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Check if user is the seller
    if (order.seller.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized to update this order', 403);
    }

    const updates = { status };

    if (status === 'shipped' && trackingNumber) {
      updates.tracking = {
        trackingNumber: trackingNumber || generateTrackingNumber(),
        carrier,
        trackingUrl: `https://tracking.example.com/${trackingNumber}`
      };
    }

    if (status === 'delivered') {
      updates.actualDelivery = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
      .populate('buyer', 'firstName lastName email')
      .populate('seller', 'firstName lastName email')
      .populate('items.item');

    successResponse(res, updatedOrder, 'Order status updated successfully');
  } catch (error) {
    console.error('Update order status error:', error);
    errorResponse(res, 'Failed to update order status', 500);
  }
});

// Cancel order
router.put('/:id/cancel', authenticateUser, paramValidation.mongoId, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Check if user is buyer or seller
    const userId = req.user._id.toString();
    if (order.buyer.toString() !== userId && order.seller.toString() !== userId) {
      return errorResponse(res, 'Unauthorized to cancel this order', 403);
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered'].includes(order.status)) {
      return errorResponse(res, 'Cannot cancel shipped or delivered orders', 400);
    }

    // Update order and item status
    await Promise.all([
      Order.findByIdAndUpdate(req.params.id, {
        status: 'cancelled',
        cancellationReason: reason || 'No reason provided'
      }),
      Item.updateMany(
        { _id: { $in: order.items.map(item => item.item) } },
        { status: 'approved' } // Make items available again
      )
    ]);

    // Refund points if buyer cancels
    if (order.buyer.toString() === userId) {
      await User.findByIdAndUpdate(userId, {
        $inc: { pointsBalance: -order.pointsEarned }
      });
    }

    successResponse(res, null, 'Order cancelled successfully');
  } catch (error) {
    console.error('Cancel order error:', error);
    errorResponse(res, 'Failed to cancel order', 500);
  }
});

// Get order statistics (for admin)
router.get('/stats/overview', authenticateUser, async (req, res) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { 'paymentDetails.paymentStatus': 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({ status: 'placed' }),
      Order.countDocuments({ status: 'delivered' })
    ]);

    const stats = {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      completedOrders
    };

    successResponse(res, stats, 'Order statistics retrieved successfully');
  } catch (error) {
    console.error('Order stats error:', error);
    errorResponse(res, 'Failed to retrieve order statistics', 500);
  }
});

module.exports = router;
