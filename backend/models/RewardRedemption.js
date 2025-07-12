const mongoose = require('mongoose');

const rewardRedemptionSchema = new mongoose.Schema({
  redemptionId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reward',
    required: true
  },
  pointsSpent: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  tracking: {
    trackingNumber: String,
    carrier: String,
    trackingUrl: String
  },
  deliveryDate: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
rewardRedemptionSchema.index({ user: 1 });
rewardRedemptionSchema.index({ redemptionId: 1 });
rewardRedemptionSchema.index({ status: 1 });
rewardRedemptionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('RewardRedemption', rewardRedemptionSchema);
