const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Reward = require('../models/Reward');
const { generateRewardId } = require('../utils/generateIds');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rewear')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample rewards data
const sampleRewards = [
  {
    rewardId: generateRewardId(),
    title: 'FOREVER Cap',
    description: 'Premium quality cap with FOREVER branding. Perfect for casual outings and protecting from sun.',
    category: 'Accessories',
    pointsRequired: 600,
    stockQuantity: 50,
    inStock: true,
    isActive: true,
    terms: 'Non-transferable. Valid for 6 months from redemption date.'
  },
  {
    rewardId: generateRewardId(),
    title: 'FOREVER T-Shirt',
    description: 'Exclusive FOREVER branded cotton t-shirt. Available in multiple sizes and colors.',
    category: 'Clothing',
    pointsRequired: 1000,
    stockQuantity: 30,
    inStock: true,
    isActive: true,
    terms: 'Size exchange available within 7 days. Non-refundable.'
  },
  {
    rewardId: generateRewardId(),
    title: 'FOREVER Tote Bag',
    description: 'Sustainable canvas tote bag with FOREVER logo. Perfect for shopping and daily use.',
    category: 'Accessories',
    pointsRequired: 800,
    stockQuantity: 40,
    inStock: true,
    isActive: true,
    terms: 'Eco-friendly material. Machine washable.'
  },
  {
    rewardId: generateRewardId(),
    title: 'FOREVER Water Bottle',
    description: 'Eco-friendly steel water bottle with premium finish. Keeps drinks hot/cold for hours.',
    category: 'Lifestyle',
    pointsRequired: 1200,
    stockQuantity: 25,
    inStock: true,
    isActive: true,
    terms: 'BPA-free. 500ml capacity. Hand wash recommended.'
  },
  {
    rewardId: generateRewardId(),
    title: 'FOREVER Premium Hoodie',
    description: 'Limited edition premium hoodie with embroidered FOREVER logo. Ultra-soft fabric.',
    category: 'Clothing',
    pointsRequired: 2000,
    stockQuantity: 15,
    inStock: true,
    isActive: true,
    terms: 'Limited edition. Size exchange available. Premium quality guarantee.'
  },
  {
    rewardId: generateRewardId(),
    title: 'FOREVER Laptop Stickers Pack',
    description: 'Set of 10 premium vinyl stickers with FOREVER designs. Weather resistant.',
    category: 'Accessories',
    pointsRequired: 300,
    stockQuantity: 100,
    inStock: true,
    isActive: true,
    terms: 'Waterproof and fade-resistant. For personal use only.'
  },
  {
    rewardId: generateRewardId(),
    title: 'FOREVER Phone Case',
    description: 'Protective phone case with FOREVER branding. Available for popular phone models.',
    category: 'Accessories',
    pointsRequired: 700,
    stockQuantity: 35,
    inStock: true,
    isActive: true,
    terms: 'Specify phone model during redemption. Drop protection guaranteed.'
  },
  {
    rewardId: generateRewardId(),
    title: 'FOREVER Notebook Set',
    description: 'Set of 3 premium notebooks with FOREVER design. Perfect for journaling and notes.',
    category: 'Lifestyle',
    pointsRequired: 500,
    stockQuantity: 60,
    inStock: true,
    isActive: true,
    terms: 'Eco-friendly paper. Set of 3 different designs.'
  }
];

// Seed function
const seedRewards = async () => {
  try {
    // Clear existing rewards
    await Reward.deleteMany({});
    console.log('Cleared existing rewards');

    // Insert sample rewards
    const rewards = await Reward.insertMany(sampleRewards);
    console.log(`Successfully seeded ${rewards.length} rewards`);

    rewards.forEach(reward => {
      console.log(`- ${reward.title}: ${reward.pointsRequired} points`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding rewards:', error);
    process.exit(1);
  }
};

// Run seeding
seedRewards();
