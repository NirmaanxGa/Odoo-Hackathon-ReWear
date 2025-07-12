const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateUser } = require('../middleware/auth');
const { userValidation } = require('../middleware/validation');
const { successResponse, errorResponse } = require('../utils/responseUtils');

// Register/Login user (called when user signs in with Clerk)
router.post('/register', userValidation.register, async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName, profileImage } = req.body;

    // Check if user already exists
    let user = await User.findOne({ clerkId });
    
    if (user) {
      // Update existing user info
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName || '';
      user.profileImage = profileImage || '';
      await user.save();
      
      return successResponse(res, user, 'User updated successfully');
    }

    // Create new user
    user = new User({
      clerkId,
      email,
      firstName,
      lastName: lastName || '',
      profileImage: profileImage || ''
    });

    await user.save();
    successResponse(res, user, 'User registered successfully', 201);
  } catch (error) {
    console.error('Registration error:', error);
    errorResponse(res, 'Registration failed', 500);
  }
});

// Get current user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    successResponse(res, user, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Profile retrieval error:', error);
    errorResponse(res, 'Failed to retrieve profile', 500);
  }
});

// Update user profile
router.put('/profile', authenticateUser, userValidation.updateProfile, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['firstName', 'lastName', 'location', 'phone', 'preferences'];
    
    // Filter only allowed updates
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    const user = await User.findByIdAndUpdate(
      req.user._id,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-__v');

    successResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    console.error('Profile update error:', error);
    errorResponse(res, 'Failed to update profile', 500);
  }
});

// Delete user account
router.delete('/account', authenticateUser, async (req, res) => {
  try {
    // Mark user as inactive instead of deleting
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    successResponse(res, null, 'Account deactivated successfully');
  } catch (error) {
    console.error('Account deletion error:', error);
    errorResponse(res, 'Failed to delete account', 500);
  }
});

// Check auth status
router.get('/status', authenticateUser, async (req, res) => {
  try {
    successResponse(res, {
      isAuthenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        pointsBalance: req.user.pointsBalance
      }
    }, 'Authentication status');
  } catch (error) {
    console.error('Auth status error:', error);
    errorResponse(res, 'Failed to check auth status', 500);
  }
});

module.exports = router;
