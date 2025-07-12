import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useAuth, useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const {
    uploadedItems,
    purchaseHistory,
    exchangeHistory,
    pointsBalance,
    rewardsRedeemed,
  } = useUserContext();
  const [activeTab, setActiveTab] = useState("overview");

  // If not signed in, show login prompt
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-light text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-8">
            Please login to access your dashboard
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

  const stats = {
    totalUploads: uploadedItems.length,
    totalPurchases: purchaseHistory.length,
    totalExchanges: exchangeHistory.length,
    pointsBalance: pointsBalance,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName || "User"}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">
              {stats.totalUploads}
            </div>
            <div className="text-sm text-gray-600">Items Listed</div>
          </div>
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">
              {stats.totalPurchases}
            </div>
            <div className="text-sm text-gray-600">Purchases Made</div>
          </div>
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">
              {stats.totalExchanges}
            </div>
            <div className="text-sm text-gray-600">Exchanges</div>
          </div>
          <div className="bg-gray-50 p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors">
            <Link to="/rewards" className="block">
              <div className="text-2xl font-light text-green-600 mb-1">
                {stats.pointsBalance}
              </div>
              <div className="text-sm text-gray-600">Points Available</div>
              <div className="text-xs text-green-600 mt-1">
                Click to redeem →
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/add-item"
            className={`border p-6 text-center hover:bg-gray-50 transition-colors ${
              stats.totalUploads === 0
                ? "border-blue-300 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div
              className={`text-lg font-medium mb-2 ${
                stats.totalUploads === 0 ? "text-blue-700" : "text-gray-900"
              }`}
            >
              List New Item
            </div>
            <div
              className={`text-sm ${
                stats.totalUploads === 0 ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {stats.totalUploads === 0
                ? "Required to request exchanges from others"
                : "Upload items for sale or exchange"}
            </div>
          </Link>

          <Link
            to="/browse"
            className="border border-gray-200 p-6 text-center hover:bg-gray-50 transition-colors"
          >
            <div className="text-lg font-medium text-gray-900 mb-2">
              Browse Items
            </div>
            <div className="text-sm text-gray-600">
              Find items to buy or exchange
            </div>
          </Link>

          <Link
            to="/rewards"
            className="border border-gray-200 p-6 text-center hover:bg-gray-50 transition-colors bg-green-50"
          >
            <div className="text-lg font-medium text-green-700 mb-2">
              Redeem Rewards
            </div>
            <div className="text-sm text-green-600">
              Use {pointsBalance} points for ReWear items
            </div>
          </Link>
        </div>

        {/* Exchange Requirements Info */}
        {stats.totalUploads === 0 && (
          <div className="mb-8 bg-blue-50 border border-blue-200 p-6 rounded">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              💡 Want to Request Exchanges?
            </h3>
            <p className="text-blue-700 mb-3">
              To request exchanges from other users, you need to have at least
              one item listed on the platform.
            </p>
            <div className="text-sm text-blue-600 space-y-1">
              <p>• List your items to unlock exchange requests</p>
              <p>• Choose from your listed items when proposing exchanges</p>
              <p>• Build trust in the community by contributing items</p>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-medium text-gray-900">Recent Activity</h2>

          {purchaseHistory.length === 0 && exchangeHistory.length === 0 ? (
            <div className="text-center py-12 bg-gray-50">
              <p className="text-gray-500">No activity yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Start by browsing items or listing your own!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Purchase History */}
              {purchaseHistory.map((purchase, index) => (
                <div
                  key={`purchase-${index}`}
                  className="border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {purchase.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Purchased for ₹{purchase.price}
                      </p>
                      <p className="text-sm text-green-600">
                        +{purchase.pointsEarned} points earned
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}

              {/* Exchange History */}
              {exchangeHistory.map((exchange, index) => (
                <div
                  key={`exchange-${index}`}
                  className="border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {exchange.item?.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Exchange {exchange.type}
                      </p>
                      <p
                        className={`text-sm ${
                          exchange.status === "pending"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        Status: {exchange.status}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(exchange.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
