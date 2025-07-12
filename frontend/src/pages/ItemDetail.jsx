import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { reWearItems } from "../assets/data";

const ItemDetail = () => {
  const { id } = useParams();
  const { isSignedIn } = useAuth();
  const { addSwapHistory, pointsBalance, updatePoints } = useUserContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Find item by ID or use first item as fallback
  const item = reWearItems.find((item) => item.id === id) || reWearItems[0];

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleSwapRequest = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to request a swap");
      return;
    }
    setShowSwapModal(true);
  };

  const handleRedeemWithPoints = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to redeem with points");
      return;
    }

    if (pointsBalance < item.pointsValue) {
      toast.error(`Insufficient points. You need ${item.pointsValue} points.`);
      return;
    }

    updatePoints(-item.pointsValue);
    addSwapHistory({
      type: "points-redemption",
      item: item,
      status: "completed",
      pointsUsed: item.pointsValue,
      date: new Date().toISOString(),
    });
    toast.success(`Item redeemed for ${item.pointsValue} points!`);
  };

  const submitSwapRequest = () => {
    addSwapHistory({
      type: "swap-request",
      item: item,
      status: "pending",
      date: new Date().toISOString(),
    });
    setShowSwapModal(false);
    toast.success("Swap request sent! The owner will be notified.");
  };

  const handleContactOwner = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to contact the owner");
      return;
    }
    setShowContactModal(true);
  };

  const submitContactRequest = () => {
    addSwapHistory({
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
              {item.pointsValue && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Points Value:</span>
                  <span className="font-medium text-green-600">
                    {item.pointsValue} points
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-medium ${
                    item.status === "available"
                      ? "text-green-600"
                      : item.status === "swapped"
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
                  <button
                    onClick={handleContactOwner}
                    className="w-full bg-black text-white py-3 px-8 text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    CONTACT OWNER
                  </button>

                  {item.acceptsSwap && (
                    <button
                      onClick={handleSwapRequest}
                      className="w-full border border-black text-black py-3 px-8 text-sm font-medium hover:bg-black hover:text-white transition-colors"
                    >
                      REQUEST SWAP
                    </button>
                  )}

                  {item.acceptsPoints && item.pointsValue && (
                    <button
                      onClick={handleRedeemWithPoints}
                      className={`w-full py-3 px-8 text-sm font-medium transition-colors ${
                        pointsBalance >= item.pointsValue
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={pointsBalance < item.pointsValue}
                    >
                      REDEEM FOR {item.pointsValue} POINTS
                      {pointsBalance < item.pointsValue &&
                        " (Insufficient Points)"}
                    </button>
                  )}
                </>
              )}

              {item.status === "swapped" && (
                <div className="text-center py-4 text-gray-500">
                  This item has already been swapped
                </div>
              )}

              {item.status === "pending" && (
                <div className="text-center py-4 text-yellow-600">
                  This item has a pending swap request
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t border-gray-200 space-y-4 text-sm text-gray-600">
              <p>• All exchanges are facilitated through our secure platform</p>
              <p>• Items are carefully verified for quality and authenticity</p>
              <p>• Free local pickup and delivery in most areas</p>
              <p>• 7-day return policy for exchanges</p>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 max-w-md w-full mx-4">
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

        {/* Swap Request Modal */}
        {showSwapModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium mb-4">
                Request Swap for {item.title}
              </h3>
              <p className="text-gray-600 mb-6">
                Propose an item swap with the owner. Describe what you're
                offering in exchange.
              </p>
              <textarea
                placeholder="Describe the item you want to swap..."
                rows={4}
                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-gray-500"
              />
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={submitSwapRequest}
                  className="flex-1 bg-black text-white py-2 px-4 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  SEND SWAP REQUEST
                </button>
                <button
                  onClick={() => setShowSwapModal(false)}
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
