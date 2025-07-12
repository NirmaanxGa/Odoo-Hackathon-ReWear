const express = require('express');
const app = express();

// Test each route file individually
console.log('Testing route imports...');

try {
  console.log('1. Testing auth routes...');
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✓ Auth routes OK');
} catch (error) {
  console.error('✗ Auth routes error:', error.message);
}

try {
  console.log('2. Testing user routes...');
  const userRoutes = require('./routes/user');
  app.use('/api/users', userRoutes);
  console.log('✓ User routes OK');
} catch (error) {
  console.error('✗ User routes error:', error.message);
}

try {
  console.log('3. Testing item routes...');
  const itemRoutes = require('./routes/item');
  app.use('/api/items', itemRoutes);
  console.log('✓ Item routes OK');
} catch (error) {
  console.error('✗ Item routes error:', error.message);
}

try {
  console.log('4. Testing order routes...');
  const orderRoutes = require('./routes/order');
  app.use('/api/orders', orderRoutes);
  console.log('✓ Order routes OK');
} catch (error) {
  console.error('✗ Order routes error:', error.message);
}

try {
  console.log('5. Testing exchange routes...');
  const exchangeRoutes = require('./routes/exchange');
  app.use('/api/exchanges', exchangeRoutes);
  console.log('✓ Exchange routes OK');
} catch (error) {
  console.error('✗ Exchange routes error:', error.message);
}

try {
  console.log('6. Testing reward routes...');
  const rewardRoutes = require('./routes/reward');
  app.use('/api/rewards', rewardRoutes);
  console.log('✓ Reward routes OK');
} catch (error) {
  console.error('✗ Reward routes error:', error.message);
}

try {
  console.log('7. Testing admin routes...');
  const adminRoutes = require('./routes/admin');
  app.use('/api/admin', adminRoutes);
  console.log('✓ Admin routes OK');
} catch (error) {
  console.error('✗ Admin routes error:', error.message);
}

try {
  console.log('8. Testing payment routes...');
  const paymentRoutes = require('./routes/payment');
  app.use('/api/payments', paymentRoutes);
  console.log('✓ Payment routes OK');
} catch (error) {
  console.error('✗ Payment routes error:', error.message);
}

try {
  console.log('9. Testing cart routes...');
  const cartRoutes = require('./routes/cart');
  app.use('/api/cart', cartRoutes);
  console.log('✓ Cart routes OK');
} catch (error) {
  console.error('✗ Cart routes error:', error.message);
}

console.log('Route testing completed');
process.exit(0);
