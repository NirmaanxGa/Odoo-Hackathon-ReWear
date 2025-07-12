# ReWear Backend API

A comprehensive backend API for the ReWear clothing exchange platform built with Node.js, Express, and MongoDB.

## Features

- **User Authentication** - Clerk.js integration for secure authentication
- **Item Management** - CRUD operations for clothing items with image upload
- **Shopping Cart** - Add, update, remove items from cart
- **Order Processing** - Complete order management system
- **Exchange System** - Item-to-item exchange functionality
- **Rewards Program** - Points-based reward system
- **Admin Panel** - Administrative functions for platform management
- **Image Upload** - Cloudinary integration for image storage
- **Payment Processing** - Mock payment system (ready for real integration)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Clerk.js
- **Image Storage**: Cloudinary
- **File Upload**: Multer
- **Validation**: Express Validator
- **Environment**: dotenv

## Project Structure

```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   └── cloudinary.js        # Cloudinary configuration
├── controllers/             # Business logic (routes handle this)
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── upload.js            # File upload middleware
│   └── validation.js        # Request validation
├── models/
│   ├── User.js              # User schema
│   ├── Item.js              # Item schema
│   ├── Order.js             # Order schema
│   ├── Exchange.js          # Exchange schema
│   ├── Reward.js            # Reward schema
│   ├── RewardRedemption.js  # Reward redemption schema
│   └── Cart.js              # Shopping cart schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── user.js              # User management routes
│   ├── item.js              # Item CRUD routes
│   ├── order.js             # Order management routes
│   ├── exchange.js          # Exchange system routes
│   ├── reward.js            # Rewards system routes
│   ├── cart.js              # Shopping cart routes
│   ├── payment.js           # Payment processing routes
│   └── admin.js             # Admin panel routes
├── utils/
│   ├── cloudinaryUtils.js   # Image upload utilities
│   ├── generateIds.js       # ID generation utilities
│   ├── responseUtils.js     # API response utilities
│   ├── paginationUtils.js   # Pagination utilities
│   └── seedRewards.js       # Database seeding script
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── index.js                # Main application file
└── package.json            # Dependencies and scripts
```

## Installation

1. **Clone the repository**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   - MongoDB connection string
   - Clerk.js API keys
   - Cloudinary credentials

4. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## Environment Variables

| Variable                | Description                          | Required |
| ----------------------- | ------------------------------------ | -------- |
| `NODE_ENV`              | Environment (development/production) | No       |
| `PORT`                  | Server port (default: 5000)          | No       |
| `MONGODB_URI`           | MongoDB connection string            | Yes      |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key                | Yes      |
| `CLERK_SECRET_KEY`      | Clerk secret key                     | Yes      |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                | Yes      |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                   | Yes      |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                | Yes      |
| `FRONTEND_URL`          | Frontend application URL             | No       |

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register/update user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/status` - Check authentication status

### Items

- `GET /api/items` - Get all items (with filtering)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/featured/list` - Get featured items
- `GET /api/items/:id/similar` - Get similar items

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order

### Exchanges

- `POST /api/exchanges` - Create exchange request
- `GET /api/exchanges` - Get exchange requests
- `GET /api/exchanges/:id` - Get single exchange
- `PUT /api/exchanges/:id/respond` - Respond to exchange
- `PUT /api/exchanges/:id/cancel` - Cancel exchange

### Cart

- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

### Rewards

- `GET /api/rewards` - Get all rewards
- `GET /api/rewards/:id` - Get single reward
- `POST /api/rewards/:id/redeem` - Redeem reward
- `GET /api/rewards/user/redemptions` - Get redemption history

### User Dashboard

- `GET /api/users/dashboard` - Get dashboard stats
- `GET /api/users/uploaded-items` - Get user's items
- `GET /api/users/purchases` - Get purchase history
- `GET /api/users/exchanges` - Get exchange history

### Admin

- `POST /api/admin/verify` - Admin login
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/ban` - Ban/unban user
- `GET /api/admin/items/pending` - Get pending items
- `PUT /api/admin/items/:id/review` - Approve/reject item
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/exchanges` - Get all exchanges

## Database Models

### User

- Personal information (name, email, location)
- Authentication (Clerk ID)
- Points balance and statistics
- Role and account status

### Item

- Product details (title, description, category)
- Pricing and condition information
- Images and availability status
- Upload and approval workflow

### Order

- Buyer and seller information
- Item details and quantities
- Shipping and payment information
- Order status tracking

### Exchange

- Requester and owner details
- Requested and offered items
- Exchange type and status
- Shipping and rating system

### Reward

- Reward details and requirements
- Stock management
- Category and availability

## Features

### Authentication & Authorization

- Clerk.js integration for secure authentication
- Role-based access control (User/Admin)
- Protected routes and middleware

### File Upload

- Multi-file image upload support
- Cloudinary integration for cloud storage
- Image optimization and transformation

### Search & Filtering

- Text search across items
- Category and condition filtering
- Price range filtering
- Sorting options

### Pagination

- Consistent pagination across all list endpoints
- Configurable page size and navigation

### Validation

- Comprehensive request validation
- MongoDB schema validation
- Error handling and user feedback

### Admin Features

- User management and banning
- Item approval workflow
- Order and exchange monitoring
- Reward management

## Seeding Data

To populate the database with sample rewards:

```bash
node utils/seedRewards.js
```

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Success message",
  "data": {} // Response data
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please create an issue in the repository.
