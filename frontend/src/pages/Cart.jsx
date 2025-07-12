import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useUserContext } from "../context/UserContext";
import { assets } from "../assets/data";

const Cart = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUserContext();

  // Show empty cart if not authenticated
  const [cartItems, setCartItems] = useState(
    isSignedIn
      ? [
          {
            id: 1,
            title: "Men Round Neck Pure Cotton T-shirt",
            price: 149,
            originalPrice: 299,
            image: assets.p_img1,
            size: "L",
            quantity: 1,
            seller: "John D.",
          },
          {
            id: 2,
            title: "Men Round Neck Pure Cotton T-shirt",
            price: 149,
            originalPrice: 299,
            image: assets.p_img2,
            size: "L",
            quantity: 1,
            seller: "Emma K.",
          },
        ]
      : []
  );

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // Implement Clerk payment integration here
    alert("Proceeding to payment...");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">YOUR CART</h1>
          <div className="w-16 h-0.5 bg-gray-900"></div>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="border border-gray-200 p-6">
                  <div className="flex gap-6">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-32 object-cover bg-gray-100"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <img
                            src={assets.bin_icon}
                            alt="Remove"
                            className="w-4 h-4"
                          />
                        </button>
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        Size: {item.size}
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        Seller: {item.seller}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">₹{item.price}</div>
                          {item.originalPrice > item.price && (
                            <div className="text-sm text-gray-500 line-through">
                              ₹{item.originalPrice}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-medium mb-6">CART TOTALS</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <img
                src={assets.cart_icon}
                alt="Empty Cart"
                className="w-16 h-16 mx-auto opacity-50"
              />
            </div>
            <h2 className="text-xl font-light text-gray-600 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              {!isSignedIn
                ? "Please login to add items to your cart"
                : "Browse our collection and add items to your cart"}
            </p>
            <div className="space-y-4">
              <a
                href="/browse"
                className="block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                CONTINUE SHOPPING
              </a>
              {!isSignedIn && (
                <p className="text-sm text-gray-500">
                  <a href="/" className="text-black hover:underline">
                    Login
                  </a>{" "}
                  to save items and checkout
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
