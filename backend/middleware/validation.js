// Validation middleware for various endpoints

const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const userValidation = {
  register: [
    body('email').isEmail().normalizeEmail(),
    body('firstName').trim().isLength({ min: 1, max: 50 }),
    body('lastName').optional().trim().isLength({ max: 50 }),
    body('clerkId').notEmpty(),
    handleValidationErrors
  ],
  
  updateProfile: [
    body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
    body('lastName').optional().trim().isLength({ max: 50 }),
    body('location').optional().trim().isLength({ max: 100 }),
    body('phone').optional().isMobilePhone(),
    handleValidationErrors
  ]
};

// Item validation rules
const itemValidation = {
  create: [
    body('title').trim().isLength({ min: 1, max: 200 }),
    body('description').trim().isLength({ min: 10, max: 1000 }),
    body('category').isIn(['Topwear', 'Bottomwear', 'Winterwear']),
    body('size').notEmpty(),
    body('condition').isIn(['Like New', 'Excellent', 'Very Good', 'Good', 'Fair']),
    body('price').isFloat({ min: 0 }),
    body('location').trim().isLength({ min: 1, max: 100 }),
    handleValidationErrors
  ],
  
  update: [
    body('title').optional().trim().isLength({ min: 1, max: 200 }),
    body('description').optional().trim().isLength({ min: 10, max: 1000 }),
    body('category').optional().isIn(['Topwear', 'Bottomwear', 'Winterwear']),
    body('condition').optional().isIn(['Like New', 'Excellent', 'Very Good', 'Good', 'Fair']),
    body('price').optional().isFloat({ min: 0 }),
    handleValidationErrors
  ]
};

// Order validation rules
const orderValidation = {
  create: [
    body('items').isArray({ min: 1 }),
    body('items.*.item').isMongoId(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('items.*.size').notEmpty(),
    body('shippingAddress.name').trim().isLength({ min: 1, max: 100 }),
    body('shippingAddress.phone').isMobilePhone(),
    body('shippingAddress.address').trim().isLength({ min: 10, max: 500 }),
    body('shippingAddress.city').trim().isLength({ min: 1, max: 50 }),
    body('shippingAddress.state').trim().isLength({ min: 1, max: 50 }),
    body('shippingAddress.pincode').isPostalCode('IN'),
    handleValidationErrors
  ]
};

// Exchange validation rules
const exchangeValidation = {
  create: [
    body('requestedItem').isMongoId(),
    body('offeredItems').isArray({ min: 1 }),
    body('offeredItems.*.item').isMongoId(),
    body('message').optional().trim().isLength({ max: 500 }),
    handleValidationErrors
  ],
  
  respond: [
    body('status').isIn(['accepted', 'rejected']),
    body('responseMessage').optional().trim().isLength({ max: 500 }),
    handleValidationErrors
  ]
};

// Cart validation rules
const cartValidation = {
  addItem: [
    body('itemId').isMongoId(),
    body('size').notEmpty(),
    body('quantity').optional().isInt({ min: 1, max: 10 }),
    handleValidationErrors
  ],
  
  updateItem: [
    body('quantity').isInt({ min: 1, max: 10 }),
    handleValidationErrors
  ]
};

// Parameter validation
const paramValidation = {
  mongoId: [
    param('id').isMongoId(),
    handleValidationErrors
  ]
};

// Query validation
const queryValidation = {
  pagination: [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    handleValidationErrors
  ],
  
  itemSearch: [
    query('search').optional().trim().isLength({ max: 100 }),
    query('category').optional().isIn(['Topwear', 'Bottomwear', 'Winterwear']),
    query('condition').optional().isIn(['Like New', 'Excellent', 'Very Good', 'Good', 'Fair']),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('size').optional(),
    query('sort').optional().isIn(['newest', 'oldest', 'price-low', 'price-high', 'title']),
    handleValidationErrors
  ]
};

module.exports = {
  userValidation,
  itemValidation,
  orderValidation,
  exchangeValidation,
  cartValidation,
  paramValidation,
  queryValidation,
  handleValidationErrors
};
