const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Topwear', 'Bottomwear', 'Winterwear']
  },
  subcategory: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    required: true
  },
  sizes: [{
    type: String
  }],
  condition: {
    type: String,
    required: true,
    enum: ['Like New', 'Excellent', 'Very Good', 'Good', 'Fair']
  },
  color: {
    type: String,
    default: ''
  },
  material: {
    type: String,
    default: ''
  },
  images: [{
    public_id: String,
    url: String
  }],
  mainImage: {
    public_id: String,
    url: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'sold', 'exchanged', 'removed'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  availability: {
    forPurchase: {
      type: Boolean,
      default: true
    },
    forExchange: {
      type: Boolean,
      default: true
    }
  },
  exchangePreferences: {
    acceptsExchange: {
      type: Boolean,
      default: true
    },
    minExchangeValue: {
      type: Number,
      default: 0
    },
    preferredCategories: [{
      type: String
    }],
    preferredSizes: [{
      type: String
    }]
  },
  statistics: {
    views: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    exchangeRequests: { type: Number, default: 0 },
    cartAdditions: { type: Number, default: 0 }
  },
  tags: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  pointsEarned: {
    type: Number,
    default: 200
  }
}, {
  timestamps: true
});

// Indexes
itemSchema.index({ uploadedBy: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ price: 1 });
itemSchema.index({ condition: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);
