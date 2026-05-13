import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Calendar, Edit, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { logoutFirebase } from '../firebase';

const UserProfile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    document.title = 'My Profile - ARTARTIST';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logoutFirebase();
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const joinDate = (user.createdAt || user.metadata?.creationTime) 
    ? new Date(user.createdAt || user.metadata.creationTime).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }) 
    : 'Recently';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-600 to-red-800 h-32"></div>
          <div className="px-6 pb-6">
            <div className="relative flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-4">
              <div className="relative">
                {user.photoURL ? (
                  <>
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const placeholder = e.target.parentElement.querySelector('.profile-placeholder');
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                    <div className="profile-placeholder hidden w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg items-center justify-center">
                      <User size={40} className="text-gray-500" />
                    </div>
                  </>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                    <User size={40} className="text-gray-500" />
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{user.displayName || 'User'}</h1>
                <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <Mail size={16} />
                  {user.email}
                </p>
                <p className="text-sm text-gray-400 flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <Calendar size={14} />
                  Member since {joinDate}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-3">
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <nav className="flex flex-col">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-red-50 text-red-600 border-l-4 border-red-600' 
                          : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Orders</span>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Favorites</span>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Reviews</span>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Overview</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Full Name</p>
                      <p className="font-medium text-gray-900">{user.displayName || 'Not set'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">User ID</p>
                      <p className="font-medium text-gray-900 text-sm truncate">{user.uid || user.id}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Account Type</p>
                      <p className="font-medium text-gray-900 capitalize">{user.role || 'User'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">No recent activity to show.</p>
                      <Link to="/art" className="text-red-600 hover:text-red-700 font-medium mt-2 inline-block">
                        Browse Art Store
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">My Orders</h2>
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <ShoppingBag size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No orders yet.</p>
                    <Link to="/art" className="text-red-600 hover:text-red-700 font-medium mt-2 inline-block">
                      Start Shopping
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">My Favorites</h2>
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Heart size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No favorites yet.</p>
                    <Link to="/art" className="text-red-600 hover:text-red-700 font-medium mt-2 inline-block">
                      Discover Artworks
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Profile Information</h3>
                      <p className="text-sm text-gray-500 mb-3">Update your account profile details.</p>
                      <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                        Edit Profile →
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Password</h3>
                      <p className="text-sm text-gray-500 mb-3">Change your password or enable 2FA.</p>
                      <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                        Security Settings →
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Notifications</h3>
                      <p className="text-sm text-gray-500 mb-3">Manage your email and push notifications.</p>
                      <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                        Notification Preferences →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
