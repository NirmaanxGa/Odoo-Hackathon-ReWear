const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User');
const { authenticateUser, optionalAuth } = require('../middleware/auth');
const { itemValidation, paramValidation, queryValidation } = require('../middleware/validation');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');
const { uploadMultipleImages, deleteMultipleImages } = require('../utils/cloudinaryUtils');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');
const { getPaginationParams, getPaginationData, applySorting } = require('../utils/paginationUtils');

// Get all items (with filtering and pagination)
router.get('/', queryValidation.itemSearch, queryValidation.pagination, optionalAuth, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { search, category, condition, minPrice, maxPrice, size, sort, status } = req.query;

    // Build query
    let query = { status: status || 'approved' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (condition) {
      query.condition = condition;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (size) {
      query.sizes = { $in: [size] };
    }

    // Execute query with pagination and sorting
    let itemQuery = Item.find(query)
      .populate('uploadedBy', 'firstName lastName location')
      .skip(skip)
      .limit(limit);

    itemQuery = applySorting(itemQuery, sort);

    const [items, totalCount] = await Promise.all([
      itemQuery.exec(),
      Item.countDocuments(query)
    ]);

    // Update view counts if user is authenticated
    if (req.user) {
      const itemIds = items.map(item => item._id);
      await Item.updateMany(
        { _id: { $in: itemIds } },
        { $inc: { 'statistics.views': 1 } }
      );
    }

    const pagination = getPaginationData(totalCount, page, limit);
    paginatedResponse(res, items, pagination, 'Items retrieved successfully');
  } catch (error) {
    console.error('Get items error:', error);
    errorResponse(res, 'Failed to retrieve items', 500);
  }
});

// Get single item by ID
router.get('/:id', paramValidation.mongoId, optionalAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('uploadedBy', 'firstName lastName location profileImage');

    if (!item) {
      return errorResponse(res, 'Item not found', 404);
    }

    // Update view count
    await Item.findByIdAndUpdate(req.params.id, {
      $inc: { 'statistics.views': 1 }
    });

    successResponse(res, item, 'Item retrieved successfully');
  } catch (error) {
    console.error('Get item error:', error);
    errorResponse(res, 'Failed to retrieve item', 500);
  }
});

// Create new item
router.post('/', authenticateUser, uploadMultiple, handleUploadError, itemValidation.create, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      brand,
      size,
      sizes,
      condition,
      color,
      material,
      price,
      originalPrice,
      location,
      exchangePreferences
    } = req.body;

    // Upload images to Cloudinary
    let images = [];
    let mainImage = null;

    if (req.files && req.files.length > 0) {
      images = await uploadMultipleImages(req.files, 'rewear/items');
      mainImage = images[0]; // First image as main image
    }

    // Create item
    const item = new Item({
      title,
      description,
      category,
      subcategory,
      brand,
      size,
      sizes: sizes ? JSON.parse(sizes) : [size],
      condition,
      color,
      material,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : 0,
      location,
      images,
      mainImage,
      uploadedBy: req.user._id,
      exchangePreferences: exchangePreferences ? JSON.parse(exchangePreferences) : {}
    });

    await item.save();

    // Update user statistics
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'statistics.totalUploads': 1 }
    });

    const populatedItem = await Item.findById(item._id)
      .populate('uploadedBy', 'firstName lastName location');

    successResponse(res, populatedItem, 'Item created successfully', 201);
  } catch (error) {
    console.error('Create item error:', error);
    errorResponse(res, 'Failed to create item', 500);
  }
});

// Update item
router.put('/:id', authenticateUser, paramValidation.mongoId, uploadMultiple, handleUploadError, itemValidation.update, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return errorResponse(res, 'Item not found', 404);
    }

    // Check if user owns the item
    if (item.uploadedBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized to update this item', 403);
    }

    // Check if item can be updated
    if (['sold', 'exchanged'].includes(item.status)) {
      return errorResponse(res, 'Cannot update sold or exchanged items', 400);
    }

    const updates = req.body;
    
    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (item.images && item.images.length > 0) {
        const publicIds = item.images.map(img => img.public_id);
        await deleteMultipleImages(publicIds);
      }

      // Upload new images
      const newImages = await uploadMultipleImages(req.files, 'rewear/items');
      updates.images = newImages;
      updates.mainImage = newImages[0];
    }

    // Parse JSON fields if they exist
    if (updates.sizes && typeof updates.sizes === 'string') {
      updates.sizes = JSON.parse(updates.sizes);
    }
    if (updates.exchangePreferences && typeof updates.exchangePreferences === 'string') {
      updates.exchangePreferences = JSON.parse(updates.exchangePreferences);
    }

    // Convert price fields to numbers
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.originalPrice) updates.originalPrice = parseFloat(updates.originalPrice);

    // Reset status to pending if item was rejected
    if (item.status === 'rejected') {
      updates.status = 'pending';
      updates.rejectionReason = '';
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'firstName lastName location');

    successResponse(res, updatedItem, 'Item updated successfully');
  } catch (error) {
    console.error('Update item error:', error);
    errorResponse(res, 'Failed to update item', 500);
  }
});

// Delete item
router.delete('/:id', authenticateUser, paramValidation.mongoId, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return errorResponse(res, 'Item not found', 404);
    }

    // Check if user owns the item
    if (item.uploadedBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized to delete this item', 403);
    }

    // Check if item can be deleted
    if (['sold', 'exchanged'].includes(item.status)) {
      return errorResponse(res, 'Cannot delete sold or exchanged items', 400);
    }

    // Delete images from Cloudinary
    if (item.images && item.images.length > 0) {
      const publicIds = item.images.map(img => img.public_id);
      await deleteMultipleImages(publicIds);
    }

    await Item.findByIdAndDelete(req.params.id);

    // Update user statistics
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'statistics.totalUploads': -1 }
    });

    successResponse(res, null, 'Item deleted successfully');
  } catch (error) {
    console.error('Delete item error:', error);
    errorResponse(res, 'Failed to delete item', 500);
  }
});

// Get featured items
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const featuredItems = await Item.find({
      status: 'approved',
      featured: true
    })
      .populate('uploadedBy', 'firstName lastName location')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    successResponse(res, featuredItems, 'Featured items retrieved successfully');
  } catch (error) {
    console.error('Get featured items error:', error);
    errorResponse(res, 'Failed to retrieve featured items', 500);
  }
});

// Get similar items
router.get('/:id/similar', paramValidation.mongoId, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return errorResponse(res, 'Item not found', 404);
    }

    const similarItems = await Item.find({
      _id: { $ne: req.params.id },
      status: 'approved',
      $or: [
        { category: item.category },
        { condition: item.condition },
        { price: { $gte: item.price * 0.7, $lte: item.price * 1.3 } }
      ]
    })
      .populate('uploadedBy', 'firstName lastName location')
      .limit(8)
      .sort({ createdAt: -1 });

    successResponse(res, similarItems, 'Similar items retrieved successfully');
  } catch (error) {
    console.error('Get similar items error:', error);
    errorResponse(res, 'Failed to retrieve similar items', 500);
  }
});

module.exports = router;
