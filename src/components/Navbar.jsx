import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logoutFirebase } from '../firebase';
import logo from './cropped_circle_image.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/art-store', label: 'Art Store' },
    { to: '/events', label: 'Events' },
    { to: '/virtual-gallery', label: '3D Gallery' },
    { to: '/nft', label: 'NFTs' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logoutFirebase();
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="w-full bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-[72px] gap-3">
          {/* Logo */}
          <div className="flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="ArtArtist"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border border-gray-200"
              />
              <div className="text-lg md:text-2xl font-bold leading-none whitespace-nowrap">
                <span className="text-black">ART</span>
                <span className="text-red-600">ARTIST</span>
              </div>
            </Link>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isActive ? 'text-red-600 bg-red-50 border border-red-100' : 'text-gray-700 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User size={24} className="text-gray-600" />
                  )}
                  <span className="text-gray-700 text-sm font-medium max-w-[160px] truncate">{user?.displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-black text-sm font-medium transition-colors px-2 py-1"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-black text-sm font-medium transition-colors px-2 py-1">
                  ACCOUNT
                </Link>
                <Link to="/artist-hub" className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
                  JOIN ARTIST HUB
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-600 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-3 pb-4 space-y-2 bg-white border-t border-gray-200">
          {/* Mobile Navigation Links */}
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'text-red-600 bg-red-50 border border-red-100' : 'text-gray-700 hover:text-black hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-3"></div>
          
          {/* Mobile Account Actions */}
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-gray-200">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <User size={18} className="text-gray-600" />
                )}
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{user?.displayName || 'Account'}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold border border-gray-300 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors w-full"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-black hover:bg-gray-50 border border-gray-200 transition-colors w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={16} />
                Account
              </Link>
              <Link 
                to="/artist-hub"
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold bg-black text-white hover:bg-gray-800 transition-colors w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Artist Hub
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
