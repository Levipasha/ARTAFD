import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Send, MessageSquare, User, Clock, Trash2, ArrowLeft } from 'lucide-react';
import { logoutFirebase } from '../firebase';
import SEO from './SEO';

const UserDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('userMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('userMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    
    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const message = {
      id: Date.now(),
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      sender: 'user',
      status: 'sent'
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage('');
    setSending(false);

    // Simulate admin reply after 2 seconds
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: "Thanks for your message! Our team will get back to you soon.",
        timestamp: new Date().toISOString(),
        sender: 'admin',
        status: 'received'
      };
      setMessages(prev => [reply, ...prev]);
    }, 2000);
  };

  const handleDeleteMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleLogout = async () => {
    try {
      await logoutFirebase();
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <SEO 
        title="My Dashboard"
        description="Your personal dashboard. Send messages and view your conversation history."
        keywords="user dashboard, messages, artist dashboard"
        canonical="https://artartist.com/dashboard"
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-black text-white py-6 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">My Dashboard</h1>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Home
              </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                  <h2 className="font-bold text-lg">{user.displayName || 'Artist'}</h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Messages</span>
                    <span className="font-semibold">{messages.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Member Since</span>
                    <span className="font-semibold">{new Date(user.createdAt || user.metadata?.creationTime || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-4">
                <h3 className="font-bold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => navigate('/art-store')}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    🛍️ Browse Art Store
                  </button>
                  <button 
                    onClick={() => navigate('/artists')}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    🎨 Find Artists
                  </button>
                  <button 
                    onClick={() => navigate('/events')}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    📅 View Events
                  </button>
                  <button 
                    onClick={() => navigate('/artist-hub')}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    ⭐ Become Verified Artist
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Section */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Message Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center gap-3">
                  <MessageSquare size={24} className="text-white" />
                  <h2 className="text-white font-bold text-lg">Messages</h2>
                </div>

                {/* Send Message Form */}
                <div className="p-4 border-b border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Send size={18} />
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                </div>

                {/* Messages List */}
                <div className="max-h-[500px] overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No messages yet.</p>
                      <p className="text-sm">Send a message to get started!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`p-4 ${message.sender === 'admin' ? 'bg-blue-50' : 'bg-white'}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                  message.sender === 'admin' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-red-500 text-white'
                                }`}>
                                  {message.sender === 'admin' ? 'ADMIN' : 'YOU'}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Clock size={12} />
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                              <p className="text-gray-800">{message.text}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
