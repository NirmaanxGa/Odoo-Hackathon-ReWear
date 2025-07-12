const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Setting up middleware...');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('Loading routes...');

// Import routes one by one
const authRoutes = require('./routes/auth');
console.log('✓ Auth routes imported');

const userRoutes = require('./routes/user');
console.log('✓ User routes imported');

const itemRoutes = require('./routes/item');
console.log('✓ Item routes imported');

const orderRoutes = require('./routes/order');
console.log('✓ Order routes imported');

const exchangeRoutes = require('./routes/exchange');
console.log('✓ Exchange routes imported');

const rewardRoutes = require('./routes/reward');
console.log('✓ Reward routes imported');

const adminRoutes = require('./routes/admin');
console.log('✓ Admin routes imported');

const paymentRoutes = require('./routes/payment');
console.log('✓ Payment routes imported');

const cartRoutes = require('./routes/cart');
console.log('✓ Cart routes imported');

console.log('Registering routes...');

// Routes
app.use('/api/auth', authRoutes);
console.log('✓ Auth routes registered');

app.use('/api/users', userRoutes);
console.log('✓ User routes registered');

app.use('/api/items', itemRoutes);
console.log('✓ Item routes registered');

app.use('/api/orders', orderRoutes);
console.log('✓ Order routes registered');

app.use('/api/exchanges', exchangeRoutes);
console.log('✓ Exchange routes registered');

app.use('/api/rewards', rewardRoutes);
console.log('✓ Reward routes registered');

app.use('/api/admin', adminRoutes);
console.log('✓ Admin routes registered');

app.use('/api/payments', paymentRoutes);
console.log('✓ Payment routes registered');

app.use('/api/cart', cartRoutes);
console.log('✓ Cart routes registered');

console.log('Setting up additional routes...');

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'ReWear Backend is running',
    timestamp: new Date().toISOString()
  });
});
console.log('✓ Health check route registered');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler - catch all unmatched routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});
console.log('✓ Error handlers registered');

console.log('Starting server...');

app.listen(PORT, () => {
  console.log(`✓ ReWear Backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

console.log('Server setup completed!');
