import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { allItems } from "../assets/data";
import LoadingSpinner from "../components/LoadingSpinner";
import PaymentModal from "../components/PaymentModal";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { addPurchase, addExchange, uploadedItems } = useUserContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedExchangeItem, setSelectedExchangeItem] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Find item by ID or show error
  const item = allItems.find((item) => item.id === id);

  const handleImageError = () => {
    setImageError(true);
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Item Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The item you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/browse"
            className="inline-block bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Browse All Items
          </Link>
        </div>
      </div>
    );
  }

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handlePurchase = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to purchase");
      return;
    }

    if (!selectedSize && item.sizes?.length > 0) {
      toast.error("Please select a size");
      return;
    }

    // Show payment modal instead of direct payment
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Create purchase details
      const purchaseDetails = {
        ...item,
        purchaseId: `PUR_${Date.now()}`,
        selectedSize,
        paymentData,
        purchaseDate: new Date().toISOString(),
        customerEmail: user?.emailAddresses[0]?.emailAddress,
        customerName: user?.fullName || user?.firstName || "Customer",
      };

      // Add to purchase history
      addPurchase(purchaseDetails);

      // Show success message
      toast.success("Purchase successful! You earned 200 ReWear points!", {
        autoClose: 3000,
      });

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Purchase processing failed:", error);
      toast.error("Purchase processing failed. Please contact support.");
    }
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

    const exchangeDetails = {
      type: "exchange-request",
      item: item,
      exchangeItem: exchangeItem,
      status: "pending",
      date: new Date().toISOString(),
      requestId: `EXC_${Date.now()}`,
      customerEmail: user?.emailAddresses[0]?.emailAddress,
      customerName: user?.fullName || user?.firstName || "Customer",
    };

    // Add to exchange history immediately
    addExchange(exchangeDetails);

    setShowExchangeModal(false);
    setSelectedExchangeItem("");

    // Show success immediately
    toast.success("Exchange request sent! The owner will be notified.", {
      autoClose: 3000,
    });

    // Navigate to dashboard after short delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  const handleContactOwner = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to contact the owner");
      return;
    }
    setShowContactModal(true);
  };

  const submitContactRequest = () => {
    const contactDetails = {
      type: "contact-request",
      item: item,
      status: "pending",
      date: new Date().toISOString(),
      requestId: `CON_${Date.now()}`,
      customerEmail: user?.emailAddresses[0]?.emailAddress,
      customerName: user?.fullName || user?.firstName || "Customer",
    };

    // Add to exchange history immediately
    addExchange(contactDetails);

    setShowContactModal(false);

    // Show success immediately
    toast.success("Contact request sent! The owner will be notified.", {
      autoClose: 3000,
    });

    // Navigate to dashboard after short delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
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
              {!imageError ? (
                <img
                  src={item.images ? item.images[selectedImage] : item.image}
                  alt={item.title}
                  className="w-full h-[600px] object-cover bg-gray-100"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg
                      className="w-24 h-24 mx-auto mb-4"
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
                    <p className="text-lg">Image not available</p>
                  </div>
                </div>
              )}
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
            {item.sizes && item.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Select Size{" "}
                  {!selectedSize && <span className="text-red-500">*</span>}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {item.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? "border-black bg-black text-white shadow-lg transform scale-105"
                          : "border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-xs text-red-500 mt-2">
                    Please select a size before purchasing
                  </p>
                )}
              </div>
            )}

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
                      className="w-full py-4 px-8 text-sm font-semibold tracking-wide transition-all duration-300 bg-gradient-to-r from-gray-900 to-black text-white hover:from-black hover:to-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      BUY NOW - ₹{item.price}
                    </button>
                  )}

                  {item.availableFor?.exchange && (
                    <button
                      onClick={handleExchangeRequest}
                      disabled={isProcessing}
                      className={`w-full py-4 px-8 text-sm font-semibold tracking-wide transition-all duration-300 ${
                        isProcessing
                          ? "border border-gray-300 text-gray-400 cursor-not-allowed"
                          : "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      }`}
                    >
                      REQUEST EXCHANGE
                    </button>
                  )}

                  <button
                    onClick={handleContactOwner}
                    disabled={isProcessing}
                    className={`w-full py-4 px-8 text-sm font-medium tracking-wide transition-all duration-300 ${
                      isProcessing
                        ? "border border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                    }`}
                  >
                    CONTACT OWNER
                  </button>
                </>
              )}

              {item.status === "sold" && (
                <div className="text-center py-6 bg-red-50 border border-red-200 text-red-600 font-medium">
                  This item has been sold
                </div>
              )}

              {item.status === "reserved" && (
                <div className="text-center py-6 bg-yellow-50 border border-yellow-200 text-yellow-600 font-medium">
                  This item is currently reserved
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t border-gray-200 space-y-4 text-sm text-gray-600">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Secure Payment & Exchange Process
                </h4>
                <ul className="space-y-1">
                  <li>
                    • Secure payments processed through Clerk authentication
                  </li>
                  <li>• Earn 200 ReWear points with every purchase</li>
                  <li>• All exchanges are facilitated through our platform</li>
                  <li>• Items are verified for quality and authenticity</li>
                  <li>• Free local pickup and delivery in most areas</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Rewards & Benefits
                </h4>
                <ul className="space-y-1">
                  <li>• Get 200 points instantly on purchase completion</li>
                  <li>• Redeem points for exclusive ReWear merchandise</li>
                  <li>• Track all your transactions in the dashboard</li>
                  <li>• Exchange only with verified community members</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 transform transition-all">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Contact {item.uploadedBy}
                </h3>
                <p className="text-gray-600 text-sm">
                  Send a message to the owner about this item. They will receive
                  your contact information and can reach out to you directly.
                </p>
              </div>
              <textarea
                placeholder="Write your message here..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
              />
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={submitContactRequest}
                  className="flex-1 bg-gradient-to-r from-gray-900 to-black text-white py-3 px-4 text-sm font-semibold rounded-lg hover:from-black hover:to-gray-800 transition-all transform hover:-translate-y-0.5 shadow-lg"
                >
                  SEND MESSAGE
                </button>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exchange Request Modal */}
        {showExchangeModal && (
          <div className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl border border-gray-100 max-h-[85vh] overflow-y-auto transform transition-all">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Exchange for {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  Select one of your listed items to propose for exchange:
                </p>
              </div>

              {/* User's Items Selection */}
              <div className="space-y-3 mb-6">
                {uploadedItems.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <p className="text-gray-500 mb-3 font-medium">
                      You haven't listed any items yet.
                    </p>
                    <Link
                      to="/add-item"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      List an item first →
                    </Link>
                  </div>
                ) : (
                  uploadedItems.map((userItem) => (
                    <label
                      key={userItem.id}
                      className={`flex items-center space-x-4 p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all ${
                        selectedExchangeItem === userItem.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="exchangeItem"
                        value={userItem.id}
                        checked={selectedExchangeItem === userItem.id}
                        onChange={(e) =>
                          setSelectedExchangeItem(e.target.value)
                        }
                        className="text-green-600 focus:ring-green-500 w-4 h-4"
                      />
                      <img
                        src={userItem.image}
                        alt={userItem.title}
                        className="w-16 h-16 object-cover rounded-lg bg-gray-100 border"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          {userItem.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {userItem.condition}
                          </span>
                          <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                            Size {userItem.size}
                          </span>
                          <span className="bg-green-100 px-2 py-1 rounded text-xs font-medium">
                            ₹{userItem.price}
                          </span>
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
                  className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all transform ${
                    selectedExchangeItem
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:-translate-y-0.5 shadow-lg"
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
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          item={item}
          selectedSize={selectedSize}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default ItemDetail;
