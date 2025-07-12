const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  pointsBalance: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  preferences: {
    categories: [{
      type: String
    }],
    sizes: [{
      type: String
    }],
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 10000 }
    }
  },
  statistics: {
    totalUploads: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    totalExchanges: { type: Number, default: 0 },
    totalPointsEarned: { type: Number, default: 0 },
    totalPointsSpent: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Additional indexes
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
