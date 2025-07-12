import { assets, products } from "./frontend_assets/assets.js";

// Transform ALL products data for ReWear (clean exchange platform) - Using all 52 products
export const reWearItems = products.map((product, index) => ({
  id: product._id,
  title: product.name,
  description: product.description,
  image: product.image[0], // Use first image
  images: product.image, // All images for gallery
  size: product.sizes[0], // Use first available size
  sizes: product.sizes,
  category: product.subCategory,
  type: ["Casual", "Formal", "Party", "Everyday", "Vintage", "Designer"][
    index % 6
  ],
  condition: ["Like New", "Excellent", "Very Good", "Good"][index % 4],
  // Indian pricing in INR for direct purchase
  price: [
    149, 299, 399, 199, 249, 349, 179, 229, 319, 159, 279, 449, 189, 329, 259,
  ][index % 15],
  originalPrice: [
    299, 599, 799, 399, 499, 699, 359, 459, 639, 319, 559, 899, 379, 659, 519,
  ][index % 15],
  location: [
    "Mumbai, Maharashtra",
    "Delhi, NCR",
    "Bangalore, Karnataka",
    "Chennai, Tamil Nadu",
    "Hyderabad, Telangana",
    "Pune, Maharashtra",
    "Kolkata, West Bengal",
    "Ahmedabad, Gujarat",
    "Jaipur, Rajasthan",
    "Lucknow, Uttar Pradesh",
    "Indore, Madhya Pradesh",
    "Kochi, Kerala",
  ][index % 12],
  uploadedBy: [
    "Priya S.",
    "Raj P.",
    "Anita K.",
    "Vikram M.",
    "Sneha T.",
    "Arjun R.",
    "Kavya L.",
    "Rohit G.",
    "Meera D.",
    "Akash K.",
    "Riya M.",
    "Dev S.",
  ][index % 12],
  uploadedAt: new Date(product.date).toISOString(),
  bestseller: product.bestseller,
  // Each purchase earns user 200 points
  pointsEarned: 200, // Fixed points per purchase
  // Clean status system - Most items should be available for testing
  status: index < 5 ? "sold" : index < 8 ? "reserved" : "available", // Only first 5 sold, next 3 reserved, rest available
  swapRequests: Math.floor(Math.random() * 3), // Number of exchange requests
  // Item can be purchased or exchanged
  availableFor: {
    purchase: true, // Can be bought with money via Clerk
    exchange: true, // Can be exchanged for another item
  },
}));

// ReWear Special Rewards - Redeemable with points
export const rewardsItems = [
  {
    id: "reward_1",
    title: "ReWear Cap",
    description: "Premium quality cap with ReWear branding",
    image: assets.cap_img,
    pointsRequired: 600,
    category: "Accessories",
    inStock: true,
  },
  {
    id: "reward_2",
    title: "ReWear T-Shirt",
    description: "Exclusive ReWear branded cotton t-shirt",
    image: assets.tshirt_img,
    pointsRequired: 1000,
    category: "Clothing",
    inStock: true,
  },
  {
    id: "reward_3",
    title: "ReWear Tote Bag",
    description: "Sustainable canvas tote bag with ReWear logo",
    image: assets.totebag_img,
    pointsRequired: 800,
    category: "Accessories",
    inStock: true,
  },
  {
    id: "reward_4",
    title: "ReWear Water Bottle",
    description: "Eco-friendly steel water bottle",
    image: assets.waterbottle_img,
    pointsRequired: 1200,
    category: "Lifestyle",
    inStock: true,
  },
  {
    id: "reward_5",
    title: "ReWear Premium Hoodie",
    description: "Limited edition premium hoodie",
    image: assets.hoodie_img,
    pointsRequired: 2000,
    category: "Clothing",
    inStock: true,
  },
];

// Featured items for homepage - More diverse selection
export const featuredItems = reWearItems.slice(0, 12);

// Latest arrivals - More items for better showcase
export const latestArrivals = reWearItems.slice(12, 28);

// Best sellers - Enhanced selection
export const bestSellers = reWearItems
  .filter((item) => item.bestseller)
  .slice(0, 16);

// Category-specific exports for better filtering
export const menItems = reWearItems.filter(
  (item) =>
    item.category === "Topwear" ||
    item.category === "Bottomwear" ||
    item.category === "Winterwear"
);

export const womenItems = reWearItems.filter(
  (item) =>
    item.category === "Topwear" ||
    item.category === "Bottomwear" ||
    item.category === "Winterwear"
);

export const kidsItems = reWearItems.filter(
  (item) => item.category === "Topwear" || item.category === "Bottomwear"
);

// Export all items for pagination
export { reWearItems as allItems };

export { assets };
