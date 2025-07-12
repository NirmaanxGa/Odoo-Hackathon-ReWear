import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import ItemCard from "../components/ItemCard";

const Dashboard = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { uploadedItems, swapHistory } = useUserContext();
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
    totalUploads: uploadedItems.length + 5,
    totalExchanges: swapHistory.length + 3,
    totalViews: 247,
    totalContacts: 12,
  };

  // Dummy uploaded items
  const myItems = [
    {
      id: 101,
      title: "My Blue Denim Jacket",
      image: "https://via.placeholder.com/300x400?text=My+Jacket",
      size: "M",
      category: "Jackets",
      condition: "Good",
      location: "Current Location",
      uploadedBy: "You",
      status: "active",
    },
    {
      id: 102,
      title: "My Summer Dress",
      image: "https://via.placeholder.com/300x400?text=My+Dress",
      size: "S",
      category: "Dresses",
      condition: "Excellent",
      location: "Current Location",
      uploadedBy: "You",
      status: "pending",
    },
  ];

  // Dummy activity history
  const recentActivity = [
    {
      id: 1,
      type: "contact",
      item: { title: "Vintage Sneakers" },
      date: "2025-01-08",
      status: "completed",
    },
    {
      id: 2,
      type: "exchange-request",
      item: { title: "Designer Handbag" },
      date: "2025-01-05",
      status: "pending",
    },
    {
      id: 3,
      type: "upload",
      item: { title: "Cotton T-Shirt" },
      date: "2025-01-03",
      status: "approved",
    },
  ];

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
            <div className="text-sm text-gray-600">Items Shared</div>
          </div>
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">
              {stats.totalExchanges}
            </div>
            <div className="text-sm text-gray-600">Exchanges</div>
          </div>
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">
              {stats.totalViews}
            </div>
            <div className="text-sm text-gray-600">Profile Views</div>
          </div>
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">
              {stats.totalContacts}
            </div>
            <div className="text-sm text-gray-600">Messages</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: "overview", label: "Overview" },
              { id: "items", label: "My Items" },
              { id: "activity", label: "Activity" },
              { id: "profile", label: "Profile" },
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
          {activeTab === "overview" && (
            <div>
              <h2 className="text-xl font-light mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border border-gray-200"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-4 ${
                          activity.status === "completed"
                            ? "bg-green-500"
                            : activity.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-sm">
                          {activity.type === "contact"
                            ? "Contacted about"
                            : activity.type === "exchange-request"
                            ? "Exchange requested for"
                            : "Uploaded"}{" "}
                          {activity.item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        activity.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "items" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light">My Items</h2>
                <Link
                  to="/add-item"
                  className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  ADD NEW ITEM
                </Link>
              </div>

              {myItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {myItems.map((item) => (
                    <div key={item.id} className="relative">
                      <ItemCard item={item} />
                      <div
                        className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                          item.status === "active"
                            ? "bg-green-100 text-green-800"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 mb-4">No items uploaded yet</p>
                  <Link
                    to="/add-item"
                    className="bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    UPLOAD YOUR FIRST ITEM
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div>
              <h2 className="text-xl font-light mb-6">Activity History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-700">
                        Date
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700">
                        Type
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700">
                        Item
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentActivity.map((activity) => (
                      <tr key={activity.id}>
                        <td className="py-3 text-sm text-gray-900">
                          {new Date(activity.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-sm text-gray-900 capitalize">
                          {activity.type.replace("-", " ")}
                        </td>
                        <td className="py-3 text-sm text-gray-900">
                          {activity.item.title}
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              activity.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : activity.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-light mb-6">Profile Settings</h2>
              <div className="max-w-2xl space-y-6">
                <div className="flex items-center mb-6">
                  <img
                    src={
                      user?.imageUrl ||
                      "https://via.placeholder.com/100x100?text=Avatar"
                    }
                    alt="Profile"
                    className="w-20 h-20 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium">
                      {user?.fullName || "User Name"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    defaultValue="New York, NY"
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Fashion enthusiast who loves sustainable clothing exchanges."
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifications"
                    defaultChecked
                    className="mr-3"
                  />
                  <label
                    htmlFor="notifications"
                    className="text-sm text-gray-700"
                  >
                    Receive email notifications
                  </label>
                </div>

                <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                  SAVE CHANGES
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
