import React from "react";
import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
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
    pointsValue = 75,
    status = "available",
    exchangeOptions = {
      acceptsCash: true,
      acceptsExchange: true,
      acceptsPoints: true,
    },
  } = item || {};

  return (
    <div className="group cursor-pointer">
      <Link to={`/item/${id}`} className="block">
        <div className="relative overflow-hidden bg-gray-100 mb-3">
          <img
            src={image}
            alt={title}
            className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Price and Points overlay */}
          <div className="absolute top-2 left-2 space-y-1">
            <div className="bg-white bg-opacity-90 px-2 py-1 text-xs font-medium">
              ₹{price}
              {originalPrice > price && (
                <span className="text-gray-500 line-through ml-1">
                  ₹{originalPrice}
                </span>
              )}
            </div>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium">
              {pointsValue} Points
            </div>
          </div>

          {/* Status indicator */}
          {status !== "available" && (
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  status === "pending_swap"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {status === "pending_swap" ? "Pending" : "Swapped"}
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

          {/* Exchange options */}
          <div className="flex gap-1 mt-2">
            {exchangeOptions.acceptsCash && (
              <span className="text-xs bg-green-50 text-green-700 px-1 py-0.5 rounded">
                Cash
              </span>
            )}
            {exchangeOptions.acceptsExchange && (
              <span className="text-xs bg-blue-50 text-blue-700 px-1 py-0.5 rounded">
                Swap
              </span>
            )}
            {exchangeOptions.acceptsPoints && (
              <span className="text-xs bg-purple-50 text-purple-700 px-1 py-0.5 rounded">
                Points
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;
