const jwt = require('jsonwebtoken');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

// Clerk authentication middleware
const requireAuth = ClerkExpressRequireAuth();

// Custom auth middleware to get user from database
const authenticateUser = async (req, res, next) => {
  try {
    await requireAuth(req, res, async () => {
      try {
        if (!req.auth?.userId) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required'
          });
        }

        // Find user in database using Clerk ID
        const user = await User.findOne({ clerkId: req.auth.userId });
        
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        if (!user.isActive || user.isBanned) {
          return res.status(403).json({
            success: false,
            message: user.isBanned ? 'User account is banned' : 'User account is inactive'
          });
        }

        req.user = user;
        next();
      } catch (error) {
        console.error('Database auth error:', error);
        res.status(500).json({
          success: false,
          message: 'Authentication error'
        });
      }
    });
  } catch (error) {
    console.error('Clerk auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid authentication'
    });
  }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Optional auth middleware (doesn't fail if no auth)
const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      await authenticateUser(req, res, next);
    } else {
      req.user = null;
      next();
    }
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateUser,
  requireAdmin,
  optionalAuth
};
