const express = require('express');
const router = express.Router();
const Reward = require('../models/Reward');
const RewardRedemption = require('../models/RewardRedemption');
const User = require('../models/User');
const { authenticateUser } = require('../middleware/auth');
const { paramValidation } = require('../middleware/validation');
const { successResponse, errorResponse } = require('../utils/responseUtils');
const { generateRedemptionId } = require('../utils/generateIds');
const { getPaginationParams, getPaginationData } = require('../utils/paginationUtils');

// Get all rewards
router.get('/', async (req, res) => {
  try {
    const { category, minPoints, maxPoints, inStock } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (minPoints || maxPoints) {
      query.pointsRequired = {};
      if (minPoints) query.pointsRequired.$gte = parseInt(minPoints);
      if (maxPoints) query.pointsRequired.$lte = parseInt(maxPoints);
    }

    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }

    const rewards = await Reward.find(query)
      .sort({ pointsRequired: 1 });

    successResponse(res, rewards, 'Rewards retrieved successfully');
  } catch (error) {
    console.error('Get rewards error:', error);
    errorResponse(res, 'Failed to retrieve rewards', 500);
  }
});

// Get single reward
router.get('/:id', paramValidation.mongoId, async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);

    if (!reward) {
      return errorResponse(res, 'Reward not found', 404);
    }

    if (!reward.isActive) {
      return errorResponse(res, 'Reward is not available', 400);
    }

    successResponse(res, reward, 'Reward retrieved successfully');
  } catch (error) {
    console.error('Get reward error:', error);
    errorResponse(res, 'Failed to retrieve reward', 500);
  }
});

// Redeem reward
router.post('/:id/redeem', authenticateUser, paramValidation.mongoId, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const rewardId = req.params.id;
    const userId = req.user._id;

    // Get reward and user
    const [reward, user] = await Promise.all([
      Reward.findById(rewardId),
      User.findById(userId)
    ]);

    if (!reward) {
      return errorResponse(res, 'Reward not found', 404);
    }

    if (!reward.isActive || !reward.inStock) {
      return errorResponse(res, 'Reward is not available', 400);
    }

    if (reward.stockQuantity <= 0) {
      return errorResponse(res, 'Reward is out of stock', 400);
    }

    if (user.pointsBalance < reward.pointsRequired) {
      return errorResponse(res, 'Insufficient points', 400);
    }

    // Check if reward has expired
    if (reward.validUntil && new Date() > reward.validUntil) {
      return errorResponse(res, 'Reward has expired', 400);
    }

    // Create redemption
    const redemption = new RewardRedemption({
      redemptionId: generateRedemptionId(),
      user: userId,
      reward: rewardId,
      pointsSpent: reward.pointsRequired,
      shippingAddress: shippingAddress || {
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone,
        address: user.location
      }
    });

    // Update user points and reward stock
    await Promise.all([
      redemption.save(),
      User.findByIdAndUpdate(userId, {
        $inc: { 
          pointsBalance: -reward.pointsRequired,
          'statistics.totalPointsSpent': reward.pointsRequired
        }
      }),
      Reward.findByIdAndUpdate(rewardId, {
        $inc: { 
          stockQuantity: -1,
          redeemedCount: 1
        }
      })
    ]);

    // Update reward stock status if needed
    if (reward.stockQuantity - 1 <= 0) {
      await Reward.findByIdAndUpdate(rewardId, { inStock: false });
    }

    const populatedRedemption = await RewardRedemption.findById(redemption._id)
      .populate('user', 'firstName lastName email')
      .populate('reward', 'title description category');

    successResponse(res, populatedRedemption, 'Reward redeemed successfully', 201);
  } catch (error) {
    console.error('Redeem reward error:', error);
    errorResponse(res, 'Failed to redeem reward', 500);
  }
});

// Get user's redemption history
router.get('/user/redemptions', authenticateUser, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { status } = req.query;

    let query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    const [redemptions, totalCount] = await Promise.all([
      RewardRedemption.find(query)
        .populate('reward', 'title description category image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      RewardRedemption.countDocuments(query)
    ]);

    const pagination = getPaginationData(totalCount, page, limit);

    successResponse(res, { redemptions, pagination }, 'Redemption history retrieved successfully');
  } catch (error) {
    console.error('Get redemption history error:', error);
    errorResponse(res, 'Failed to retrieve redemption history', 500);
  }
});

// Get single redemption
router.get('/redemptions/:id', authenticateUser, paramValidation.mongoId, async (req, res) => {
  try {
    const redemption = await RewardRedemption.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('reward');

    if (!redemption) {
      return errorResponse(res, 'Redemption not found', 404);
    }

    // Check if user owns this redemption
    if (redemption.user._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized to view this redemption', 403);
    }

    successResponse(res, redemption, 'Redemption retrieved successfully');
  } catch (error) {
    console.error('Get redemption error:', error);
    errorResponse(res, 'Failed to retrieve redemption', 500);
  }
});

// Get reward categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Reward.distinct('category', { isActive: true });
    successResponse(res, categories, 'Reward categories retrieved successfully');
  } catch (error) {
    console.error('Get categories error:', error);
    errorResponse(res, 'Failed to retrieve categories', 500);
  }
});

// Check user's points balance
router.get('/user/points', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('pointsBalance statistics.totalPointsEarned statistics.totalPointsSpent');

    successResponse(res, {
      currentBalance: user.pointsBalance,
      totalEarned: user.statistics.totalPointsEarned,
      totalSpent: user.statistics.totalPointsSpent
    }, 'Points balance retrieved successfully');
  } catch (error) {
    console.error('Get points balance error:', error);
    errorResponse(res, 'Failed to retrieve points balance', 500);
  }
});

module.exports = router;
