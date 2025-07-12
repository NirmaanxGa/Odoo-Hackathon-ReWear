const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Order = require('../models/Order');
const Exchange = require('../models/Exchange');
const Reward = require('../models/Reward');
const RewardRedemption = require('../models/RewardRedemption');
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const { paramValidation } = require('../middleware/validation');
const { uploadSingle, handleUploadError } = require('../middleware/upload');
const { uploadImage, deleteImage } = require('../utils/cloudinaryUtils');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');
const { getPaginationParams, getPaginationData, applySorting } = require('../utils/paginationUtils');
const { generateRewardId } = require('../utils/generateIds');

// Admin authentication check
router.post('/verify', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple admin credentials check (in production, use proper authentication)
    const validCredentials = username === 'admin' && password === 'rewear2025';

    if (validCredentials) {
      successResponse(res, { isAdmin: true }, 'Admin verified successfully');
    } else {
      errorResponse(res, 'Invalid admin credentials', 401);
    }
  } catch (error) {
    console.error('Admin verify error:', error);
    errorResponse(res, 'Admin verification failed', 500);
  }
});

// Dashboard statistics
router.get('/dashboard', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalItems,
      totalOrders,
      totalExchanges,
      pendingItems,
      activeUsers,
      totalRevenue,
      recentActivity
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Order.countDocuments(),
      Exchange.countDocuments(),
      Item.countDocuments({ status: 'pending' }),
      User.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { 'paymentDetails.paymentStatus': 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      // Recent activity (last 7 days)
      Promise.all([
        User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
        Item.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
        Order.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
      ])
    ]);

    const stats = {
      overview: {
        totalUsers,
        totalItems,
        totalOrders,
        totalExchanges,
        pendingItems,
        activeUsers,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentActivity: {
        newUsers: recentActivity[0],
        newItems: recentActivity[1],
        newOrders: recentActivity[2]
      }
    };

    successResponse(res, stats, 'Dashboard statistics retrieved successfully');
  } catch (error) {
    console.error('Admin dashboard error:', error);
    errorResponse(res, 'Failed to retrieve dashboard statistics', 500);
  }
});

// Get all users
router.get('/users', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { search, role, status, sort } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status) {
      if (status === 'active') query.isActive = true;
      if (status === 'inactive') query.isActive = false;
      if (status === 'banned') query.isBanned = true;
    }

    let userQuery = User.find(query)
      .select('-__v')
      .skip(skip)
      .limit(limit);

    userQuery = applySorting(userQuery, sort);

    const [users, totalCount] = await Promise.all([
      userQuery.exec(),
      User.countDocuments(query)
    ]);

    const pagination = getPaginationData(totalCount, page, limit);
    paginatedResponse(res, users, pagination, 'Users retrieved successfully');
  } catch (error) {
    console.error('Get users error:', error);
    errorResponse(res, 'Failed to retrieve users', 500);
  }
});

// Ban/unban user
router.put('/users/:id/ban', authenticateUser, requireAdmin, paramValidation.mongoId, async (req, res) => {
  try {
    const { ban, reason } = req.body;
    const userId = req.params.id;

    const updates = {
      isBanned: ban,
      banReason: ban ? reason || 'No reason provided' : ''
    };

    const user = await User.findByIdAndUpdate(userId, updates, { new: true })
      .select('-__v');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, user, `User ${ban ? 'banned' : 'unbanned'} successfully`);
  } catch (error) {
    console.error('Ban user error:', error);
    errorResponse(res, 'Failed to update user ban status', 500);
  }
});

// Get pending items for approval
router.get('/items/pending', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { category, condition } = req.query;

    let query = { status: 'pending' };

    if (category) {
      query.category = category;
    }

    if (condition) {
      query.condition = condition;
    }

    const [items, totalCount] = await Promise.all([
      Item.find(query)
        .populate('uploadedBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Item.countDocuments(query)
    ]);

    const pagination = getPaginationData(totalCount, page, limit);
    paginatedResponse(res, items, pagination, 'Pending items retrieved successfully');
  } catch (error) {
    console.error('Get pending items error:', error);
    errorResponse(res, 'Failed to retrieve pending items', 500);
  }
});

// Approve/reject item
router.put('/items/:id/review', authenticateUser, requireAdmin, paramValidation.mongoId, async (req, res) => {
  try {
    const { action, reason, featured } = req.body; // action: 'approve' or 'reject'
    const itemId = req.params.id;

    if (!['approve', 'reject'].includes(action)) {
      return errorResponse(res, 'Invalid action. Use "approve" or "reject"', 400);
    }

    const updates = {
      status: action === 'approve' ? 'approved' : 'rejected'
    };

    if (action === 'reject') {
      updates.rejectionReason = reason || 'No reason provided';
    } else {
      updates.rejectionReason = '';
      if (featured !== undefined) {
        updates.featured = featured;
      }
    }

    const item = await Item.findByIdAndUpdate(itemId, updates, { new: true })
      .populate('uploadedBy', 'firstName lastName email');

    if (!item) {
      return errorResponse(res, 'Item not found', 404);
    }

    successResponse(res, item, `Item ${action}d successfully`);
  } catch (error) {
    console.error('Review item error:', error);
    errorResponse(res, 'Failed to review item', 500);
  }
});

// Delete item (admin)
router.delete('/items/:id', authenticateUser, requireAdmin, paramValidation.mongoId, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return errorResponse(res, 'Item not found', 404);
    }

    // Delete images from Cloudinary
    if (item.images && item.images.length > 0) {
      const publicIds = item.images.map(img => img.public_id);
      await deleteMultipleImages(publicIds);
    }

    successResponse(res, null, 'Item deleted successfully');
  } catch (error) {
    console.error('Delete item error:', error);
    errorResponse(res, 'Failed to delete item', 500);
  }
});

// Get all orders
router.get('/orders', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { status, sort } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    let orderQuery = Order.find(query)
      .populate('buyer', 'firstName lastName email')
      .populate('seller', 'firstName lastName email')
      .populate('items.item', 'title images mainImage')
      .skip(skip)
      .limit(limit);

    orderQuery = applySorting(orderQuery, sort);

    const [orders, totalCount] = await Promise.all([
      orderQuery.exec(),
      Order.countDocuments(query)
    ]);

    const pagination = getPaginationData(totalCount, page, limit);
    paginatedResponse(res, orders, pagination, 'Orders retrieved successfully');
  } catch (error) {
    console.error('Get orders error:', error);
    errorResponse(res, 'Failed to retrieve orders', 500);
  }
});

// Get all exchanges
router.get('/exchanges', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { status, sort } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    let exchangeQuery = Exchange.find(query)
      .populate('requester', 'firstName lastName email')
      .populate('owner', 'firstName lastName email')
      .populate('requestedItem', 'title images mainImage price')
      .populate('offeredItems.item', 'title images mainImage price')
      .skip(skip)
      .limit(limit);

    exchangeQuery = applySorting(exchangeQuery, sort);

    const [exchanges, totalCount] = await Promise.all([
      exchangeQuery.exec(),
      Exchange.countDocuments(query)
    ]);

    const pagination = getPaginationData(totalCount, page, limit);
    paginatedResponse(res, exchanges, pagination, 'Exchanges retrieved successfully');
  } catch (error) {
    console.error('Get exchanges error:', error);
    errorResponse(res, 'Failed to retrieve exchanges', 500);
  }
});

// Manage rewards
router.get('/rewards', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { category, isActive } = req.query;

    let query = {};
    if (category) {
      query.category = category;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const [rewards, totalCount] = await Promise.all([
      Reward.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Reward.countDocuments(query)
    ]);

    const pagination = getPaginationData(totalCount, page, limit);
    paginatedResponse(res, rewards, pagination, 'Rewards retrieved successfully');
  } catch (error) {
    console.error('Get rewards error:', error);
    errorResponse(res, 'Failed to retrieve rewards', 500);
  }
});

// Create reward
router.post('/rewards', authenticateUser, requireAdmin, uploadSingle, handleUploadError, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      pointsRequired,
      stockQuantity,
      validUntil,
      terms
    } = req.body;

    let image = null;
    if (req.file) {
      image = await uploadImage(req.file, 'rewear/rewards');
    }

    const reward = new Reward({
      rewardId: generateRewardId(),
      title,
      description,
      category,
      pointsRequired: parseInt(pointsRequired),
      stockQuantity: parseInt(stockQuantity) || 100,
      image,
      validUntil: validUntil ? new Date(validUntil) : null,
      terms: terms || ''
    });

    await reward.save();

    successResponse(res, reward, 'Reward created successfully', 201);
  } catch (error) {
    console.error('Create reward error:', error);
    errorResponse(res, 'Failed to create reward', 500);
  }
});

// Update reward
router.put('/rewards/:id', authenticateUser, requireAdmin, paramValidation.mongoId, uploadSingle, handleUploadError, async (req, res) => {
  try {
    const updates = req.body;

    // Handle image upload
    if (req.file) {
      const reward = await Reward.findById(req.params.id);
      if (reward?.image?.public_id) {
        await deleteImage(reward.image.public_id);
      }
      updates.image = await uploadImage(req.file, 'rewear/rewards');
    }

    const reward = await Reward.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!reward) {
      return errorResponse(res, 'Reward not found', 404);
    }

    successResponse(res, reward, 'Reward updated successfully');
  } catch (error) {
    console.error('Update reward error:', error);
    errorResponse(res, 'Failed to update reward', 500);
  }
});

// Get reward redemptions
router.get('/redemptions', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { status, sort } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    let redemptionQuery = RewardRedemption.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('reward', 'title category pointsRequired')
      .skip(skip)
      .limit(limit);

    redemptionQuery = applySorting(redemptionQuery, sort);

    const [redemptions, totalCount] = await Promise.all([
      redemptionQuery.exec(),
      RewardRedemption.countDocuments(query)
    ]);

    const pagination = getPaginationData(totalCount, page, limit);
    paginatedResponse(res, redemptions, pagination, 'Redemptions retrieved successfully');
  } catch (error) {
    console.error('Get redemptions error:', error);
    errorResponse(res, 'Failed to retrieve redemptions', 500);
  }
});

// Update redemption status
router.put('/redemptions/:id/status', authenticateUser, requireAdmin, paramValidation.mongoId, async (req, res) => {
  try {
    const { status, trackingNumber, carrier, notes } = req.body;
    const validStatuses = ['pending', 'processed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const updates = { status };

    if (status === 'shipped' && trackingNumber) {
      updates.tracking = {
        trackingNumber,
        carrier,
        trackingUrl: `https://tracking.example.com/${trackingNumber}`
      };
    }

    if (status === 'delivered') {
      updates.deliveryDate = new Date();
    }

    if (notes) {
      updates.notes = notes;
    }

    const redemption = await RewardRedemption.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
      .populate('user', 'firstName lastName email')
      .populate('reward', 'title category');

    if (!redemption) {
      return errorResponse(res, 'Redemption not found', 404);
    }

    successResponse(res, redemption, 'Redemption status updated successfully');
  } catch (error) {
    console.error('Update redemption status error:', error);
    errorResponse(res, 'Failed to update redemption status', 500);
  }
});

module.exports = router;
