import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Package, Calendar, Settings, LogOut, Plus, Edit, Trash2, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import AddProductButton from './AddProductButton';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.stats);
      setUsers(response.recentActivity.users);
      setProducts(response.recentActivity.products);
      setEvents(response.recentActivity.events);
    } catch (error) {
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers({ search: searchTerm, status: filterStatus });
      setUsers(response.users);
    } catch (error) {
      console.error('Users fetch error:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await adminAPI.getProducts({ search: searchTerm, status: filterStatus });
      setProducts(response.products);
    } catch (error) {
      console.error('Products fetch error:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await adminAPI.getEvents({ search: searchTerm, status: filterStatus });
      setEvents(response.events);
    } catch (error) {
      console.error('Events fetch error:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Delete product error:', error);
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await adminAPI.deleteEvent(eventId);
        fetchEvents();
      } catch (error) {
        console.error('Delete event error:', error);
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon size={24} className={`text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.displayName}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <nav className="mt-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'dashboard' ? 'bg-red-50 text-red-600 border-r-2 border-red-600' : 'text-gray-700'
              }`}
            >
              <BarChart3 size={20} />
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('users');
                fetchUsers();
              }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'users' ? 'bg-red-50 text-red-600 border-r-2 border-red-600' : 'text-gray-700'
              }`}
            >
              <Users size={20} />
              Users
            </button>
            <button
              onClick={() => {
                setActiveTab('products');
                fetchProducts();
              }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'products' ? 'bg-red-50 text-red-600 border-r-2 border-red-600' : 'text-gray-700'
              }`}
            >
              <Package size={20} />
              Products
            </button>
            <button
              onClick={() => {
                setActiveTab('events');
                fetchEvents();
              }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'events' ? 'bg-red-50 text-red-600 border-r-2 border-red-600' : 'text-gray-700'
              }`}
            >
              <Calendar size={20} />
              Events
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'settings' ? 'bg-red-50 text-red-600 border-r-2 border-red-600' : 'text-gray-700'
              }`}
            >
              <Settings size={20} />
              Settings
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="blue" />
                <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={Package} color="green" />
                <StatCard title="Total Events" value={stats?.totalEvents || 0} icon={Calendar} color="purple" />
                <StatCard title="Artists" value={stats?.totalArtists || 0} icon={Users} color="orange" />
                <StatCard title="Available Products" value={stats?.availableProducts || 0} icon={Package} color="teal" />
                <StatCard title="Upcoming Events" value={stats?.upcomingEvents || 0} icon={Calendar} color="pink" />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div key={user._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div key={product._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">${product.price}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {product.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
                  <div className="space-y-3">
                    {events.map((event) => (
                      <div key={event._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-500">{new Date(event.date.start).toLocaleDateString()}</p>
                        </div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {event.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
                <AddProductButton />
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="artist">Artist</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{user.displayName}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'artist' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
                <AddProductButton />
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <Package size={48} className="text-gray-400" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-red-600">${product.price}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {product.status}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                          <Edit size={16} />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
                <button 
                  onClick={() => navigate('/event-management')}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <Plus size={20} />
                  Add Event
                </button>
              </div>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Events List */}
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-2">{event.description}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>📅 {new Date(event.date.start).toLocaleDateString()}</span>
                          <span>📍 {event.location.venue}</span>
                          <span>👥 {event.capacity.current}/{event.capacity.max}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {event.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      defaultValue="ArtArtist"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                    <textarea
                      rows={3}
                      defaultValue="A vibrant community for artists to showcase, connect, and grow"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="maintenance" className="rounded" />
                    <label htmlFor="maintenance" className="text-sm text-gray-700">Maintenance Mode</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="registrations" defaultChecked className="rounded" />
                    <label htmlFor="registrations" className="text-sm text-gray-700">Allow New Registrations</label>
                  </div>
                </div>
                
                <button className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
