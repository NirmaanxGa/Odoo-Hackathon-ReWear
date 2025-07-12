const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
  exchangeId: {
    type: String,
    unique: true,
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  offeredItems: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    estimatedValue: Number
  }],
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  responseMessage: {
    type: String,
    default: ''
  },
  exchangeType: {
    type: String,
    enum: ['item-for-item', 'item-with-cash', 'direct-swap'],
    default: 'item-for-item'
  },
  cashDifference: {
    type: Number,
    default: 0
  },
  whoPays: {
    type: String,
    enum: ['requester', 'owner', 'none'],
    default: 'none'
  },
  shippingDetails: {
    requesterShipping: {
      trackingNumber: String,
      carrier: String,
      status: String
    },
    ownerShipping: {
      trackingNumber: String,
      carrier: String,
      status: String
    }
  },
  completionDate: {
    type: Date
  },
  rating: {
    requesterRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: String
    },
    ownerRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: String
    }
  }
}, {
  timestamps: true
});

// Indexes
exchangeSchema.index({ requester: 1 });
exchangeSchema.index({ owner: 1 });
exchangeSchema.index({ exchangeId: 1 });
exchangeSchema.index({ status: 1 });
exchangeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Exchange', exchangeSchema);
