import { assets, products } from "./frontend_assets/assets.js";

// Transform products data for ReWear (removing price, adding condition and location)
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
  location: [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Philadelphia, PA",
  ][index % 5],
  uploadedBy: ["Sarah M.", "John D.", "Emma K.", "Mike R.", "Lisa T."][
    index % 5
  ],
  uploadedAt: new Date(product.date).toISOString(),
  bestseller: product.bestseller,
  tags: ["sustainable", "fashion", "exchange", "preloved"],
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
