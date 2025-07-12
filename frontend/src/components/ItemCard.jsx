import React, { useState } from "react";
import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  const {
    id = 1,
    title = "Sample T-Shirt",
    image = "https://via.placeholder.com/300x400?text=Clothing+Item",
    size = "M",
    category = "T-Shirts",
    condition = "Good",
    location = "Mumbai, Maharashtra",
    uploadedBy = "John Doe",
    price = 199,
    originalPrice = 399,
    status = "available",
    availableFor = {
      purchase: true,
      exchange: true,
    },
  } = item || {};

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="group cursor-pointer">
      <Link to={`/item/${id}`} className="block">
        <div className="relative overflow-hidden bg-gray-100 mb-3">
          {!imageError ? (
            <img
              src={image}
              alt={title}
              className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-64 md:h-80 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">Image Preview</p>
              </div>
            </div>
          )}

          {/* Price overlay */}
          <div className="absolute top-2 left-2">
            <div className="bg-white bg-opacity-95 px-2 py-1 text-xs font-semibold rounded shadow-sm">
              ₹{price}
              {originalPrice > price && (
                <span className="text-gray-500 line-through ml-1 text-xs">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Available options */}
          <div className="absolute top-2 right-2 flex gap-1">
            {availableFor.purchase && (
              <div className="bg-black text-white px-2 py-0.5 text-xs font-medium rounded">
                BUY
              </div>
            )}
            {availableFor.exchange && (
              <div className="bg-white text-black border border-black px-2 py-0.5 text-xs font-medium rounded">
                SWAP
              </div>
            )}
          </div>

          {/* Status indicator */}
          {status !== "available" && (
            <div className="absolute bottom-2 left-2">
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded shadow-sm ${
                  status === "reserved"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {status === "reserved" ? "Reserved" : "Sold"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {title}
          </h3>
          <p className="text-sm text-gray-500">
            {condition} • Size {size}
          </p>
          <p className="text-xs text-gray-400">{location}</p>
          <p className="text-xs text-gray-400">by {uploadedBy}</p>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;
