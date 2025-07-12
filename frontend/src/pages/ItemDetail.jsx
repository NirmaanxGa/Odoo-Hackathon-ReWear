import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { reWearItems } from "../assets/data";

const ItemDetail = () => {
  const { id } = useParams();
  const { isSignedIn } = useAuth();
  const { addPurchase, addExchange, uploadedItems } = useUserContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedExchangeItem, setSelectedExchangeItem] = useState("");

  // Find item by ID or use first item as fallback
  const item = reWearItems.find((item) => item.id === id) || reWearItems[0];

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handlePurchase = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to purchase");
      return;
    }

    // Simulate Clerk payment process
    toast.info("Redirecting to payment...");

    // After successful payment, add to purchase history
    setTimeout(() => {
      addPurchase(item);
      toast.success(`Purchase successful! You earned 200 points.`);
    }, 2000);
  };

  const handleExchangeRequest = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to request an exchange");
      return;
    }

    // Check if user has uploaded any items
    if (uploadedItems.length === 0) {
      toast.error(
        "You need to list at least one item before you can request exchanges. Please upload an item first."
      );
      return;
    }

    setShowExchangeModal(true);
  };

  const submitExchangeRequest = () => {
    if (!selectedExchangeItem) {
      toast.error("Please select an item to exchange");
      return;
    }

    const exchangeItem = uploadedItems.find(
      (item) => item.id === selectedExchangeItem
    );

    addExchange({
      type: "exchange-request",
      item: item,
      exchangeItem: exchangeItem,
      status: "pending",
      date: new Date().toISOString(),
    });
    setShowExchangeModal(false);
    setSelectedExchangeItem("");
    toast.success("Exchange request sent! The owner will be notified.");
  };

  const handleContactOwner = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to contact the owner");
      return;
    }
    setShowContactModal(true);
  };

  const submitContactRequest = () => {
    addExchange({
      type: "contact-request",
      item: item,
      status: "pending",
      date: new Date().toISOString(),
    });
    setShowContactModal(false);
    toast.success("Contact request sent! The owner will be notified.");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>{">"}</span>
            <Link to="/browse" className="hover:text-gray-900">
              Collection
            </Link>
            <span>{">"}</span>
            <span className="text-gray-900">{item.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="mb-4">
              <img
                src={item.images ? item.images[selectedImage] : item.image}
                alt={item.title}
                className="w-full h-[600px] object-cover bg-gray-100"
              />
            </div>

            {item.images && item.images.length > 1 && (
              <div className="flex space-x-4">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 bg-gray-100 border-2 ${
                      selectedImage === index
                        ? "border-black"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                {item.title}
              </h1>
              <p className="text-gray-600">{item.description}</p>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-light text-gray-900">
                  ₹{item.price}
                </span>
                {item.originalPrice > item.price && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{item.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-sm text-green-600 mt-1">
                Earn 200 points with purchase
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Select Size
              </h3>
              <div className="flex gap-2">
                {item.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`px-4 py-2 border text-sm ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-900 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Item Info */}
            <div className="space-y-3 py-6 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Condition:</span>
                <span className="font-medium">{item.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{item.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-medium ${
                    item.status === "available"
                      ? "text-green-600"
                      : item.status === "sold"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{item.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Owner:</span>
                <span className="font-medium">{item.uploadedBy}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              {item.status === "available" && (
                <>
                  {item.availableFor?.purchase && (
                    <button
                      onClick={handlePurchase}
                      className="w-full bg-black text-white py-3 px-8 text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      BUY NOW - ₹{item.price}
                    </button>
                  )}

                  {item.availableFor?.exchange && (
                    <button
                      onClick={handleExchangeRequest}
                      className="w-full border border-black text-black py-3 px-8 text-sm font-medium hover:bg-black hover:text-white transition-colors"
                    >
                      REQUEST EXCHANGE
                    </button>
                  )}

                  <button
                    onClick={handleContactOwner}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-8 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    CONTACT OWNER
                  </button>
                </>
              )}

              {item.status === "sold" && (
                <div className="text-center py-4 text-gray-500">
                  This item has been sold
                </div>
              )}

              {item.status === "reserved" && (
                <div className="text-center py-4 text-yellow-600">
                  This item is currently reserved
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t border-gray-200 space-y-4 text-sm text-gray-600">
              <p>• Secure payments processed through Clerk</p>
              <p>• All exchanges are facilitated through our platform</p>
              <p>• Items are verified for quality and authenticity</p>
              <p>• Free local pickup and delivery in most areas</p>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
              <h3 className="text-lg font-medium mb-4">
                Contact {item.uploadedBy}
              </h3>
              <p className="text-gray-600 mb-6">
                Send a message to the owner about this item. They will receive
                your contact information and can reach out to you directly.
              </p>
              <textarea
                placeholder="Write your message here..."
                rows={4}
                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-gray-500"
              />
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={submitContactRequest}
                  className="flex-1 bg-black text-white py-2 px-4 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  SEND MESSAGE
                </button>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exchange Request Modal */}
        {showExchangeModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white p-8 max-w-lg w-full mx-4 shadow-2xl border border-gray-200 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-medium mb-4">
                Request Exchange for {item.title}
              </h3>
              <p className="text-gray-600 mb-6">
                Select one of your listed items to propose for exchange:
              </p>

              {/* User's Items Selection */}
              <div className="space-y-3 mb-6">
                {uploadedItems.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded">
                    <p className="text-gray-500">
                      You haven't listed any items yet.
                    </p>
                    <Link
                      to="/add-item"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      List an item first →
                    </Link>
                  </div>
                ) : (
                  uploadedItems.map((userItem) => (
                    <label
                      key={userItem.id}
                      className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="exchangeItem"
                        value={userItem.id}
                        checked={selectedExchangeItem === userItem.id}
                        onChange={(e) =>
                          setSelectedExchangeItem(e.target.value)
                        }
                        className="text-black focus:ring-black"
                      />
                      <img
                        src={userItem.image}
                        alt={userItem.title}
                        className="w-12 h-12 object-cover bg-gray-100"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {userItem.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {userItem.condition} • Size {userItem.size} • ₹
                          {userItem.price}
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={submitExchangeRequest}
                  disabled={!selectedExchangeItem}
                  className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                    selectedExchangeItem
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  SEND EXCHANGE REQUEST
                </button>
                <button
                  onClick={() => {
                    setShowExchangeModal(false);
                    setSelectedExchangeItem("");
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;
