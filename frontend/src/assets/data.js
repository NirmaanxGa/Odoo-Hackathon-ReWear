import { assets, products } from "./frontend_assets/assets.js";

// Transform products data for ReWear (adding Indian pricing and user-set prices)
export const reWearItems = products.slice(0, 20).map((product, index) => ({
  id: product._id,
  title: product.name,
  description: product.description,
  image: product.image[0], // Use first image
  images: product.image, // All images for gallery
  size: product.sizes[0], // Use first available size
  sizes: product.sizes,
  category: product.subCategory,
  condition: ["Like New", "Excellent", "Very Good", "Good"][index % 4],
  // Indian pricing in INR
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
  tags: ["sustainable", "fashion", "exchange", "preloved"],
  // User can set their own pricing
  isUserPriced: Math.random() > 0.5, // Some items have user-set prices
  exchangeOptions: {
    acceptsCash: true,
    acceptsExchange: true,
    preferredCategories: ["Topwear", "Bottomwear", "Winterwear"],
    minExchangeValue: [100, 150, 200, 250][index % 4],
  },
}));

// Featured items for homepage
export const featuredItems = reWearItems.slice(0, 8);

// Latest arrivals
export const latestArrivals = reWearItems.slice(8, 18);

// Best sellers
export const bestSellers = reWearItems
  .filter((item) => item.bestseller)
  .slice(0, 10);

export { assets };
