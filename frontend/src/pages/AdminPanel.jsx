import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const { setUserRole } = useUserContext();
  const [activeTab, setActiveTab] = useState('pending');

  // Dummy pending items for approval
  const [pendingItems, setPendingItems] = useState([
    {
      id: 201,
      title: "Vintage Leather Boots",
      description: "Classic brown leather boots in great condition.",
      image: "https://via.placeholder.com/150x200?text=Boots",
      size: "10",
      category: "Shoes",
      condition: "Very Good",
      brand: "Clarks",
      location: "Boston, MA",
      uploadedBy: "John D.",
      uploadedAt: "2025-01-10T10:30:00Z",
      status: "pending"
    },
    {
      id: 202,
      title: "Designer Silk Scarf",
      description: "Beautiful silk scarf with floral pattern.",
      image: "https://via.placeholder.com/150x200?text=Scarf",
      size: "One Size",
      category: "Accessories",
      condition: "Like New",
      brand: "Hermès",
      location: "New York, NY",
      uploadedBy: "Emma K.",
      uploadedAt: "2025-01-10T14:15:00Z",
      status: "pending"
    }
  ]);

  // Dummy users for role management
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      joinedAt: "2024-12-15",
      itemsUploaded: 12
    },
    {
      id: 2,
      name: "Emma Smith",
      email: "emma@example.com",
      role: "user",
      joinedAt: "2024-11-20",
      itemsUploaded: 8
    }
  ]);

  // Stats
  const stats = {
    totalUsers: users.length + 150,
    totalItems: 45,
    pendingApprovals: pendingItems.filter(item => item.status === 'pending').length,
    totalExchanges: 89
  };

  const handleApproveItem = (itemId) => {
    setPendingItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, status: 'approved' }
          : item
      )
    );
    toast.success('Item approved successfully!');
  };

  const handleRejectItem = (itemId) => {
    setPendingItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, status: 'rejected' }
          : item
      )
    );
    toast.error('Item rejected.');
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(users => 
      users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      )
    );
    toast.success(`User role updated to ${newRole}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage items, users, and platform settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">{stats.totalItems}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">{stats.pendingApprovals}</div>
            <div className="text-sm text-gray-600">Pending Approvals</div>
          </div>
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">{stats.totalExchanges}</div>
            <div className="text-sm text-gray-600">Total Exchanges</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'pending', label: 'Pending Items' },
              { id: 'users', label: 'User Management' },
              { id: 'reports', label: 'Reports' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'pending' && (
            <div>
              <h2 className="text-xl font-light mb-6">Pending Item Approvals</h2>
              
              {pendingItems.filter(item => item.status === 'pending').length > 0 ? (
                <div className="space-y-6">
                  {pendingItems.filter(item => item.status === 'pending').map((item) => (
                    <div key={item.id} className="border border-gray-200 p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full lg:w-48 h-48 object-cover bg-gray-100"
                        />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium">{item.title}</h3>
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs">
                              PENDING
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-xs">
                            <div>
                              <span className="text-gray-500">Category:</span>
                              <div className="font-medium">{item.category}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Size:</span>
                              <div className="font-medium">{item.size}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Condition:</span>
                              <div className="font-medium">{item.condition}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Brand:</span>
                              <div className="font-medium">{item.brand}</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
                            <span>By: {item.uploadedBy}</span>
                            <span>{item.location}</span>
                            <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleApproveItem(item.id)}
                              className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                              APPROVE
                            </button>
                            <button
                              onClick={() => handleRejectItem(item.id)}
                              className="border border-gray-300 text-gray-700 px-6 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                              REJECT
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500">No pending items to review</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-light mb-6">User Management</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-700">User</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700">Items</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700">Joined</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="py-3 text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            user.role === 'admin' 
                              ? 'bg-black text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-900">
                          {user.itemsUploaded}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="text-xs border border-gray-300 px-2 py-1 focus:outline-none focus:border-gray-500"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2 className="text-xl font-light mb-6">Platform Reports</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="border border-gray-200 p-6">
                  <h3 className="font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items uploaded today:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Exchanges completed:</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New users registered:</span>
                      <span className="font-medium">5</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 p-6">
                  <h3 className="font-medium mb-4">Top Categories</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Topwear:</span>
                      <span className="font-medium">45 items</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bottomwear:</span>
                      <span className="font-medium">32 items</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Winterwear:</span>
                      <span className="font-medium">28 items</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
