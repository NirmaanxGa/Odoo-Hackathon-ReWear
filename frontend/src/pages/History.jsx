import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useUserContext } from "../context/UserContext";
import { assets } from "../assets/data";

const History = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUserContext();
  const [activeTab, setActiveTab] = useState("orders");
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (imageId) => {
    setImageErrors((prev) => ({ ...prev, [imageId]: true }));
  };

  const ImageWithFallback = ({ src, alt, className, imageId }) => {
    if (imageErrors[imageId]) {
      return (
        <div
          className={`bg-gray-100 flex items-center justify-center ${className}`}
        >
          <div className="text-center text-gray-400">
            <svg
              className="w-6 h-6 mx-auto mb-1"
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
            <p className="text-xs">No Image</p>
          </div>
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => handleImageError(imageId)}
      />
    );
  };

  // If not signed in, show login prompt
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-light text-gray-900 mb-4">
            Order History
          </h1>
          <p className="text-gray-600 mb-8">
            Please login to view your order history
          </p>
          <a
            href="/"
            className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            LOGIN
          </a>
        </div>
      </div>
    );
  }

  // Dummy order history
  const orders = [
    {
      id: "ORD001",
      date: "25 May 2024",
      items: [
        {
          title: "Men Round Neck Pure Cotton T-shirt",
          price: 149,
          image: assets.p_img1,
          size: "L",
          quantity: 1,
          seller: "John D.",
        },
      ],
      status: "Ready to ship",
      total: 149,
      statusColor: "text-green-600",
    },
    {
      id: "ORD002",
      date: "18 May 2024",
      items: [
        {
          title: "Men Round Neck Pure Cotton T-shirt",
          price: 149,
          image: assets.p_img2,
          size: "L",
          quantity: 1,
          seller: "Emma K.",
        },
      ],
      status: "Shipped",
      total: 149,
      statusColor: "text-blue-600",
    },
  ];

  // Dummy exchange requests
  const exchanges = [
    {
      id: "EXC001",
      date: "20 May 2024",
      requestedItem: {
        title: "Designer Silk Scarf",
        image: assets.p_img3,
        owner: "Sarah M.",
      },
      offeredItem: {
        title: "Vintage Leather Jacket",
        image: assets.p_img4,
        value: 299,
      },
      status: "Pending Review",
      statusColor: "text-yellow-600",
    },
    {
      id: "EXC002",
      date: "15 May 2024",
      requestedItem: {
        title: "Cotton Summer Dress",
        image: assets.p_img5,
        owner: "Lisa K.",
      },
      offeredItem: {
        title: "Denim Jacket",
        image: assets.p_img6,
        value: 199,
      },
      status: "Accepted",
      statusColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">MY ORDERS</h1>
          <div className="w-16 h-0.5 bg-gray-900"></div>
        </div>

        {/* User Profile Dropdown (like in screenshot) */}
        <div className="mb-8 flex justify-end">
          <div className="relative">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>My Profile</span>
              <span>Orders</span>
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: "orders", label: "Purchase Orders" },
              { id: "exchanges", label: "Exchange Requests" },
              { id: "listings", label: "My Listings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "orders" && (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        Order #{order.id}
                      </div>
                      <div className="text-sm text-gray-600">
                        Date: {order.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${order.statusColor}`}
                      >
                        ● {order.status}
                      </div>
                      <button className="text-sm text-gray-600 hover:text-gray-900 mt-1">
                        Track Order
                      </button>
                    </div>
                  </div>

                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 mb-4">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-20 object-cover bg-gray-100"
                        imageId={`order-${order.id}-item-${index}`}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.title}</h3>
                        <div className="text-xs text-gray-600 mt-1">
                          ₹{item.price} • Quantity: {item.quantity} • Size:{" "}
                          {item.size}
                        </div>
                        <div className="text-xs text-gray-600">
                          Seller: {item.seller}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-4 text-right">
                    <span className="font-medium">Total: ₹{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "exchanges" && (
            <div className="space-y-6">
              {exchanges.map((exchange) => (
                <div key={exchange.id} className="border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        Exchange #{exchange.id}
                      </div>
                      <div className="text-sm text-gray-600">
                        Date: {exchange.date}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-medium ${exchange.statusColor}`}
                    >
                      ● {exchange.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Requested Item
                      </h4>
                      <div className="flex gap-3">
                        <ImageWithFallback
                          src={exchange.requestedItem.image}
                          alt={exchange.requestedItem.title}
                          className="w-12 h-16 object-cover bg-gray-100"
                          imageId={`exchange-${exchange.id}-requested`}
                        />
                        <div>
                          <div className="text-sm font-medium">
                            {exchange.requestedItem.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            Owner: {exchange.requestedItem.owner}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Your Offered Item
                      </h4>
                      <div className="flex gap-3">
                        <ImageWithFallback
                          src={exchange.offeredItem.image}
                          alt={exchange.offeredItem.title}
                          className="w-12 h-16 object-cover bg-gray-100"
                          imageId={`exchange-${exchange.id}-offered`}
                        />
                        <div>
                          <div className="text-sm font-medium">
                            {exchange.offeredItem.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            Value: ₹{exchange.offeredItem.value}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "listings" && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <img
                  src={assets.upload_area}
                  alt="No Listings"
                  className="w-16 h-16 mx-auto opacity-50"
                />
              </div>
              <h2 className="text-xl font-light text-gray-600 mb-4">
                No active listings
              </h2>
              <p className="text-gray-500 mb-8">
                Start by adding items to share with the community
              </p>
              <a
                href="/add-item"
                className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                ADD ITEM
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
