import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignInButton, useAuth, UserButton } from '@clerk/clerk-react';
import { assets } from '../assets/data';

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img src={assets.logo} alt="ReWear" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`py-2 px-1 text-sm font-medium transition-colors ${isActive('/')}`}>
              HOME
            </Link>
            <Link to="/browse" className={`py-2 px-1 text-sm font-medium transition-colors ${isActive('/browse')}`}>
              COLLECTION
            </Link>
            {isSignedIn && (
              <>
                <Link to="/add-item" className={`py-2 px-1 text-sm font-medium transition-colors ${isActive('/add-item')}`}>
                  SHARE
                </Link>
                <Link to="/dashboard" className={`py-2 px-1 text-sm font-medium transition-colors ${isActive('/dashboard')}`}>
                  ACCOUNT
                </Link>
              </>
            )}
            <Link to="/browse" className="text-gray-600 hover:text-gray-900">
              ABOUT
            </Link>
            <Link to="/browse" className="text-gray-600 hover:text-gray-900">
              CONTACT
            </Link>
          </div>

          {/* Right side - Search, Cart, User */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="text-gray-600 hover:text-gray-900">
              <img src={assets.search_icon} alt="Search" className="w-5 h-5" />
            </button>

            {/* Cart/Exchange Icon */}
            <Link to="/browse" className="text-gray-600 hover:text-gray-900 relative">
              <img src={assets.exchange_icon} alt="Exchange" className="w-5 h-5" />
            </Link>

            {/* User Authentication */}
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="text-gray-600 hover:text-gray-900">
                  <img src={assets.profile_icon} alt="Login" className="w-5 h-5" />
                </button>
              </SignInButton>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              <img src={assets.menu_icon} alt="Menu" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                HOME
              </Link>
              <Link 
                to="/browse" 
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                COLLECTION
              </Link>
              {isSignedIn && (
                <>
                  <Link 
                    to="/add-item" 
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    SHARE
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ACCOUNT
                  </Link>
                </>
              )}
              <Link 
                to="/browse" 
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                ABOUT
              </Link>
              <Link 
                to="/browse" 
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                CONTACT
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
