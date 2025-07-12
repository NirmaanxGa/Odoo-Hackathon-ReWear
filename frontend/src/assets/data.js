import { assets, products } from "./frontend_assets/assets.js";

// Transform products data for ReWear (clean exchange platform)
export const reWearItems = products.slice(0, 20).map((product, index) => ({
  id: product._id,
  title: product.name,
  description: product.description,
  image: product.image[0], // Use first image
  images: product.image, // All images for gallery
  size: product.sizes[0], // Use first available size
  sizes: product.sizes,
  category: product.subCategory,
  type: ["Casual", "Formal", "Party", "Everyday"][index % 4],
  condition: ["Like New", "Excellent", "Very Good", "Good"][index % 4],
  // Indian pricing in INR for direct purchase
  price: [149, 299, 399, 199, 249, 349, 179, 229, 319, 159][index % 10],
  originalPrice: [299, 599, 799, 399, 499, 699, 359, 459, 639, 319][index % 10],
  location: [
    "Mumbai, Maharashtra",
    "Delhi, NCR",
    "Bangalore, Karnataka",
    "Chennai, Tamil Nadu",
    "Hyderabad, Telangana",
    "Pune, Maharashtra",
    "Kolkata, West Bengal",
    "Ahmedabad, Gujarat",
  ][index % 8],
  uploadedBy: [
    "Priya S.",
    "Raj P.",
    "Anita K.",
    "Vikram M.",
    "Sneha T.",
    "Arjun R.",
    "Kavya L.",
    "Rohit G.",
  ][index % 8],
  uploadedAt: new Date(product.date).toISOString(),
  bestseller: product.bestseller,
  // Each purchase earns user 200 points
  pointsEarned: 200, // Fixed points per purchase
  // Clean status system
  status: ["available", "reserved", "sold"][Math.floor(Math.random() * 3)],
  swapRequests: Math.floor(Math.random() * 3), // Number of exchange requests
  // Item can be purchased or exchanged
  availableFor: {
    purchase: true, // Can be bought with money via Clerk
    exchange: true, // Can be exchanged for another item
  },
}));

// FOREVER Special Rewards - Redeemable with points
export const rewardsItems = [
  {
    id: "reward_1",
    title: "FOREVER Cap",
    description: "Premium quality cap with FOREVER branding",
    image: assets.logo, // Using logo as placeholder
    pointsRequired: 600,
    category: "Accessories",
    inStock: true,
  },
  {
    id: "reward_2",
    title: "FOREVER T-Shirt",
    description: "Exclusive FOREVER branded cotton t-shirt",
    image: assets.logo,
    pointsRequired: 1000,
    category: "Clothing",
    inStock: true,
  },
  {
    id: "reward_3",
    title: "FOREVER Tote Bag",
    description: "Sustainable canvas tote bag with FOREVER logo",
    image: assets.logo,
    pointsRequired: 800,
    category: "Accessories",
    inStock: true,
  },
  {
    id: "reward_4",
    title: "FOREVER Water Bottle",
    description: "Eco-friendly steel water bottle",
    image: assets.logo,
    pointsRequired: 1200,
    category: "Lifestyle",
    inStock: true,
  },
  {
    id: "reward_5",
    title: "FOREVER Premium Hoodie",
    description: "Limited edition premium hoodie",
    image: assets.logo,
    pointsRequired: 2000,
    category: "Clothing",
    inStock: true,
  },
];

// Featured items for homepage
export const featuredItems = reWearItems.slice(0, 8);

// Latest arrivals
export const latestArrivals = reWearItems.slice(8, 18);

// Best sellers
export const bestSellers = reWearItems
  .filter((item) => item.bestseller)
  .slice(0, 10);

export { assets };
