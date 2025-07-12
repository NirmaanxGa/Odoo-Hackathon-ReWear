const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  rewardId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Accessories', 'Clothing', 'Lifestyle', 'Digital', 'Vouchers']
  },
  pointsRequired: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    public_id: String,
    url: String
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 100
  },
  redeemedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validUntil: {
    type: Date
  },
  terms: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
rewardSchema.index({ rewardId: 1 });
rewardSchema.index({ category: 1 });
rewardSchema.index({ pointsRequired: 1 });
rewardSchema.index({ isActive: 1 });

module.exports = mongoose.model('Reward', rewardSchema);
