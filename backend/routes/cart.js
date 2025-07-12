const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Item = require('../models/Item');
const { authenticateUser } = require('../middleware/auth');
const { cartValidation, paramValidation } = require('../middleware/validation');
const { successResponse, errorResponse } = require('../utils/responseUtils');

// Get user's cart
router.get('/', authenticateUser, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.item',
        populate: {
          path: 'uploadedBy',
          select: 'firstName lastName'
        }
      });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    // Calculate totals
    let totalAmount = 0;
    let itemCount = 0;

    cart.items = cart.items.filter(cartItem => {
      if (cartItem.item && cartItem.item.status === 'approved') {
        totalAmount += cartItem.item.price * cartItem.quantity;
        itemCount += cartItem.quantity;
        return true;
      }
      return false; // Remove items that are no longer available
    });

    // Update cart totals
    cart.totalAmount = totalAmount;
    cart.itemCount = itemCount;
    await cart.save();

    successResponse(res, cart, 'Cart retrieved successfully');
  } catch (error) {
    console.error('Get cart error:', error);
    errorResponse(res, 'Failed to retrieve cart', 500);
  }
});

// Add item to cart
router.post('/add', authenticateUser, cartValidation.addItem, async (req, res) => {
  try {
    const { itemId, size, quantity = 1 } = req.body;
    const userId = req.user._id;

    // Validate item
    const item = await Item.findById(itemId);
    if (!item) {
      return errorResponse(res, 'Item not found', 404);
    }

    if (item.status !== 'approved') {
      return errorResponse(res, 'Item is not available', 400);
    }

    if (item.uploadedBy.toString() === userId.toString()) {
      return errorResponse(res, 'Cannot add your own item to cart', 400);
    }

    if (!item.sizes.includes(size)) {
      return errorResponse(res, 'Selected size is not available', 400);
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if item with same size already exists in cart
    const existingItemIndex = cart.items.findIndex(
      cartItem => cartItem.item.toString() === itemId && cartItem.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        item: itemId,
        quantity,
        size,
        addedAt: new Date()
      });
    }

    await cart.save();

    // Update item statistics
    await Item.findByIdAndUpdate(itemId, {
      $inc: { 'statistics.cartAdditions': 1 }
    });

    // Return updated cart with populated items
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.item',
        populate: {
          path: 'uploadedBy',
          select: 'firstName lastName'
        }
      });

    successResponse(res, updatedCart, 'Item added to cart successfully');
  } catch (error) {
    console.error('Add to cart error:', error);
    errorResponse(res, 'Failed to add item to cart', 500);
  }
});

// Update cart item quantity
router.put('/update/:itemId', authenticateUser, paramValidation.mongoId, cartValidation.updateItem, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, size } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return errorResponse(res, 'Cart not found', 404);
    }

    const cartItemIndex = cart.items.findIndex(
      cartItem => cartItem.item.toString() === itemId && cartItem.size === size
    );

    if (cartItemIndex === -1) {
      return errorResponse(res, 'Item not found in cart', 404);
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(cartItemIndex, 1);
    } else {
      // Update quantity
      cart.items[cartItemIndex].quantity = quantity;
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.item',
        populate: {
          path: 'uploadedBy',
          select: 'firstName lastName'
        }
      });

    successResponse(res, updatedCart, 'Cart updated successfully');
  } catch (error) {
    console.error('Update cart error:', error);
    errorResponse(res, 'Failed to update cart', 500);
  }
});

// Remove item from cart
router.delete('/remove/:itemId', authenticateUser, paramValidation.mongoId, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { size } = req.query;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return errorResponse(res, 'Cart not found', 404);
    }

    // Remove item(s) from cart
    if (size) {
      // Remove specific size
      cart.items = cart.items.filter(
        cartItem => !(cartItem.item.toString() === itemId && cartItem.size === size)
      );
    } else {
      // Remove all variants of the item
      cart.items = cart.items.filter(
        cartItem => cartItem.item.toString() !== itemId
      );
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.item',
        populate: {
          path: 'uploadedBy',
          select: 'firstName lastName'
        }
      });

    successResponse(res, updatedCart, 'Item removed from cart successfully');
  } catch (error) {
    console.error('Remove from cart error:', error);
    errorResponse(res, 'Failed to remove item from cart', 500);
  }
});

// Clear entire cart
router.delete('/clear', authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;

    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], totalAmount: 0, itemCount: 0 },
      { upsert: true }
    );

    successResponse(res, null, 'Cart cleared successfully');
  } catch (error) {
    console.error('Clear cart error:', error);
    errorResponse(res, 'Failed to clear cart', 500);
  }
});

// Get cart item count
router.get('/count', authenticateUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const itemCount = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

    successResponse(res, { itemCount }, 'Cart count retrieved successfully');
  } catch (error) {
    console.error('Get cart count error:', error);
    errorResponse(res, 'Failed to get cart count', 500);
  }
});

module.exports = router;
