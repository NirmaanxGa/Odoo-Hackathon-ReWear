import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import Pagination from "../components/Pagination";
import { assets, allItems } from "../assets/data";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 12 items per page for better layout

  // Handle URL category parameter
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedSize, sortBy]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "mens", label: "Men's" },
    { value: "womens", label: "Women's" },
    { value: "kids", label: "Kids" },
    { value: "Topwear", label: "Topwear" },
    { value: "Bottomwear", label: "Bottomwear" },
    { value: "Winterwear", label: "Winterwear" },
  ];
  const sizes = ["all", "XS", "S", "M", "L", "XL", "XXL"];

  // Filter items based on search and filters
  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCategory = selectedCategory === "all";
    if (!matchesCategory) {
      // Handle main categories
      if (selectedCategory === "mens") {
        matchesCategory =
          item.category.toLowerCase().includes("men") ||
          item.title.toLowerCase().includes("men") ||
          ["Topwear", "Bottomwear"].includes(item.category);
      } else if (selectedCategory === "womens") {
        matchesCategory =
          item.category.toLowerCase().includes("women") ||
          item.title.toLowerCase().includes("women") ||
          ["Topwear", "Bottomwear", "Winterwear"].includes(item.category);
      } else if (selectedCategory === "kids") {
        matchesCategory =
          item.category.toLowerCase().includes("kid") ||
          item.title.toLowerCase().includes("kid");
      } else {
        matchesCategory = item.category === selectedCategory;
      }
    }

    const matchesSize =
      selectedSize === "all" || item.sizes.includes(selectedSize);

    return matchesSearch && matchesCategory && matchesSize;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title);
      case "price-low":
        return a.originalPrice - b.originalPrice;
      case "price-high":
        return b.originalPrice - a.originalPrice;
      case "newest":
      default:
        return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedItems.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-gray-900 mb-4">
            {selectedCategory === "all"
              ? "ALL COLLECTIONS"
              : selectedCategory === "mens"
              ? "MEN'S COLLECTION"
              : selectedCategory === "womens"
              ? "WOMEN'S COLLECTION"
              : selectedCategory === "kids"
              ? "KIDS COLLECTION"
              : selectedCategory.toUpperCase()}
          </h1>
          <div className="w-24 h-px bg-gray-300 mx-auto"></div>
        </div>

        {/* Filters */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              {/* Size */}
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
              >
                <option value="all">All Sizes</option>
                {sizes.slice(1).map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
              >
                <option value="newest">Newest</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {currentItems.length} of {sortedItems.length} products
            {sortedItems.length !== allItems.length &&
              ` (${allItems.length} total)`}
          </p>
        </div>

        {/* Items Grid */}
        {currentItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {currentItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={sortedItems.length}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg mb-2">
              No products found matching your criteria.
            </p>
            <p className="text-gray-400">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
