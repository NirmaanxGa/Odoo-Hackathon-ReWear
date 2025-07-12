import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignInButton, useAuth, UserButton } from "@clerk/clerk-react";
import { assets } from "../assets/data";

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path
      ? "text-gray-900 border-b-2 border-gray-900"
      : "text-gray-600 hover:text-gray-900";
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
            <Link
              to="/"
              className={`py-2 px-1 text-sm font-medium transition-colors ${isActive(
                "/"
              )}`}
            >
              HOME
            </Link>
            <Link
              to="/browse"
              className={`py-2 px-1 text-sm font-medium transition-colors ${isActive(
                "/browse"
              )}`}
            >
              COLLECTION
            </Link>
            <Link
              to="/dashboard"
              className={`py-2 px-1 text-sm font-medium transition-colors ${isActive(
                "/dashboard"
              )}`}
            >
              DASHBOARD
            </Link>
            <Link
              to="/history"
              className={`py-2 px-1 text-sm font-medium transition-colors ${isActive(
                "/history"
              )}`}
            >
              HISTORY
            </Link>
            <Link
              to="/admin"
              className={`py-2 px-1 text-sm font-medium transition-colors ${isActive(
                "/admin"
              )}`}
            >
              ADMIN
            </Link>
          </div>

          {/* Right side - Search, Cart, User */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="text-gray-600 hover:text-gray-900">
              <img src={assets.search_icon} alt="Search" className="w-5 h-5" />
            </button>

            {/* Cart Icon with count */}
            <Link
              to="/cart"
              className="text-gray-600 hover:text-gray-900 relative"
            >
              <img src={assets.cart_icon} alt="Cart" className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User Authentication */}
            {isSignedIn ? (
              <div className="flex items-center space-x-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                  LOGIN
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
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                DASHBOARD
              </Link>
              <Link
                to="/history"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                HISTORY
              </Link>
              <Link
                to="/admin"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                ADMIN
              </Link>
              <Link
                to="/cart"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                CART
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
