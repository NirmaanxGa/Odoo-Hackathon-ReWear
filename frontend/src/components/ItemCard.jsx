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
    exchangeOptions = { acceptsCash: true, acceptsExchange: true },
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
          {/* Price overlay */}
          <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 text-xs font-medium">
            ₹{price}
            {originalPrice > price && (
              <span className="text-gray-500 line-through ml-1">
                ₹{originalPrice}
              </span>
            )}
          </div>
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
