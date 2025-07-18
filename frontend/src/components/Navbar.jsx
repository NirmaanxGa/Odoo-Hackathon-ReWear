import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignInButton, useAuth, UserButton } from "@clerk/clerk-react";
import { assets } from "../assets/data";

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);

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
              <img src={assets.logo} alt="ReWear" className="h-35 w-auto" />
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

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowCollectionDropdown(true)}
              onMouseLeave={() => setShowCollectionDropdown(false)}
            >
              <Link
                to="/browse"
                className={`py-2 px-1 text-sm font-medium transition-colors flex items-center ${isActive(
                  "/browse"
                )}`}
              >
                COLLECTION
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>

              {showCollectionDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 shadow-lg z-50">
                  <Link
                    to="/browse?category=mens"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Men's Collection
                  </Link>
                  <Link
                    to="/browse?category=womens"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Women's Collection
                  </Link>
                  <Link
                    to="/browse?category=kids"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Kids Collection
                  </Link>
                  <div className="border-t border-gray-200">
                    <Link
                      to="/browse"
                      className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      View All Items
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/dashboard"
              className={`py-2 px-1 text-sm font-medium transition-colors ${isActive(
                "/dashboard"
              )}`}
            >
              DASHBOARD
            </Link>
            <Link
              to="/rewards"
              className={`py-2 px-1 text-sm font-medium transition-colors ${isActive(
                "/rewards"
              )}`}
            >
              REWARDS
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

          {/* Right side - Cart, User */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon with count */}
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-gray-900"
            >
              <img src={assets.cart_icon} alt="Cart" className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User Authentication */}
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                  SIGN IN
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                to="/"
                className={`block px-3 py-2 text-sm font-medium ${isActive(
                  "/"
                )}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                HOME
              </Link>
              <Link
                to="/browse"
                className={`block px-3 py-2 text-sm font-medium ${isActive(
                  "/browse"
                )}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                COLLECTION
              </Link>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 text-sm font-medium ${isActive(
                  "/dashboard"
                )}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                DASHBOARD
              </Link>
              <Link
                to="/rewards"
                className={`block px-3 py-2 text-sm font-medium ${isActive(
                  "/rewards"
                )}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                REWARDS
              </Link>
              <Link
                to="/history"
                className={`block px-3 py-2 text-sm font-medium ${isActive(
                  "/history"
                )}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                HISTORY
              </Link>
              <Link
                to="/admin"
                className={`block px-3 py-2 text-sm font-medium ${isActive(
                  "/admin"
                )}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                ADMIN
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
