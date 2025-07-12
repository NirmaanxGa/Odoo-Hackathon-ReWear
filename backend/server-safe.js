const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully');
    // console.log(`📍 Database Host: ${conn.connection.host}`);
    // console.log(`🗄️  Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'ReWear Backend is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Simple test routes to verify server is working
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ReWear Backend API',
    version: '1.0.0',
    status: 'Running'
  });
});

// Add routes one by one to identify problematic routes
try {
  console.log('🔄 Loading routes...');
  
  // Import and use routes safely
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
  
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
}

try {
  const userRoutes = require('./routes/user');
  app.use('/api/users', userRoutes);
  console.log('✅ User routes loaded');
} catch (error) {
  console.error('❌ Error loading user routes:', error.message);
}

try {
  const itemRoutes = require('./routes/item');
  app.use('/api/items', itemRoutes);
  console.log('✅ Item routes loaded');
} catch (error) {
  console.error('❌ Error loading item routes:', error.message);
}

try {
  const cartRoutes = require('./routes/cart');
  app.use('/api/cart', cartRoutes);
  console.log('✅ Cart routes loaded');
} catch (error) {
  console.error('❌ Error loading cart routes:', error.message);
}

try {
  const rewardRoutes = require('./routes/reward');
  app.use('/api/rewards', rewardRoutes);
  console.log('✅ Reward routes loaded');
} catch (error) {
  console.error('❌ Error loading reward routes:', error.message);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 ================================');
  console.log('🎉 ReWear Backend Server Started!');
  console.log('🚀 ================================');
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('🚀 ================================');
});
