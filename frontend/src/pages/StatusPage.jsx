import React from "react";
import { Link } from "react-router-dom";

const StatusPage = () => {
  const features = [
    {
      title: "Pagination System",
      description:
        "Browse page now shows 12 items per page with professional pagination controls",
      status: "✅ Complete",
      path: "/browse",
    },
    {
      title: "Enhanced Product Data",
      description:
        "All 52 product images are now used with expanded variety in locations, uploaders, and pricing",
      status: "✅ Complete",
      path: "/browse",
    },
    {
      title: "Image Error Handling",
      description:
        "Fallback placeholders for broken or missing images in ItemCard and ItemDetail",
      status: "✅ Complete",
      path: "/browse",
    },
    {
      title: "Professional Carousel",
      description:
        "Hero carousel with local fashion images and smooth transitions",
      status: "✅ Complete",
      path: "/",
    },
    {
      title: "ScrollVelocity Animation",
      description:
        "Framer-motion powered animated text scrolling for modern feel",
      status: "✅ Complete",
      path: "/",
    },
    {
      title: "Custom Scrollbars",
      description: "Theme-matching transparent scrollbars throughout the app",
      status: "✅ Complete",
      path: "/",
    },
    {
      title: "Impact Section",
      description: "Professional statistics and mission statement showcase",
      status: "✅ Complete",
      path: "/",
    },
    {
      title: "ReWear Design System",
      description: "Complete transformation to minimalist e-commerce aesthetic",
      status: "✅ Complete",
      path: "/",
    },
    {
      title: "Clerk Authentication",
      description: "Payment integration and user management system",
      status: "✅ Complete",
      path: "/dashboard",
    },
    {
      title: "Exchange Validation",
      description: "Users can only exchange if they have uploaded items",
      status: "✅ Complete",
      path: "/browse",
    },
    {
      title: "Professional Navigation",
      description: "Collections dropdown with Men's/Women's/Kids categories",
      status: "✅ Complete",
      path: "/browse?category=mens",
    },
    {
      title: "Loading System",
      description: "Lottie animations for app refresh and loading states",
      status: "✅ Complete",
      path: "/",
    },
  ];

  const stats = {
    totalProducts: 52,
    categoriesSupported: [
      "Men's",
      "Women's",
      "Kids",
      "Topwear",
      "Bottomwear",
      "Winterwear",
    ],
    paginationItemsPerPage: 12,
    totalPages: Math.ceil(52 / 12),
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            ReWear Development Status
          </h1>
          <div className="w-32 h-px bg-gray-300 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete overview of all implemented features in the ReWear
            Community Clothing Exchange platform
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-3xl font-light text-gray-900 mb-2">
              {stats.totalProducts}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-3xl font-light text-gray-900 mb-2">
              {stats.categoriesSupported.length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-3xl font-light text-gray-900 mb-2">
              {stats.paginationItemsPerPage}
            </div>
            <div className="text-sm text-gray-600">Items per Page</div>
          </div>
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-3xl font-light text-gray-900 mb-2">
              {stats.totalPages}
            </div>
            <div className="text-sm text-gray-600">Total Pages</div>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-4 mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-6">
            Implemented Features
          </h2>
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-gray-200 p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{feature.description}</p>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    {feature.status}
                  </span>
                </div>
                <Link
                  to={feature.path}
                  className="ml-4 px-4 py-2 text-sm font-medium text-black border border-black hover:bg-black hover:text-white transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Explore the Platform
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              View Homepage
            </Link>
            <Link
              to="/browse"
              className="px-6 py-3 border border-black text-black font-medium hover:bg-black hover:text-white transition-colors"
            >
              Browse All Products
            </Link>
            <Link
              to="/browse?category=mens"
              className="px-6 py-3 border border-black text-black font-medium hover:bg-black hover:text-white transition-colors"
            >
              Men's Collection
            </Link>
            <Link
              to="/browse?category=womens"
              className="px-6 py-3 border border-black text-black font-medium hover:bg-black hover:text-white transition-colors"
            >
              Women's Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
