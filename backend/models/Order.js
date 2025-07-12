const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    title: String,
    price: Number,
    size: String,
    quantity: { type: Number, default: 1 },
    image: String
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
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
  paymentDetails: {
    paymentId: String,
    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    currency: { type: String, default: 'INR' }
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  tracking: {
    trackingNumber: String,
    carrier: String,
    trackingUrl: String
  },
  pointsEarned: {
    type: Number,
    default: 200
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ buyer: 1 });
orderSchema.index({ seller: 1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
