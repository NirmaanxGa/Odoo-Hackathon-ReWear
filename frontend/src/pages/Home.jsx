import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import ItemCard from "../components/ItemCard";
import {
  assets,
  featuredItems,
  latestArrivals,
  bestSellers,
} from "../assets/data";

const Home = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-pink-50 min-h-[500px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight">
              ReWear
            </h1>
            <h2 className="text-2xl md:text-3xl font-light text-gray-700">
              Community Clothing Exchange
            </h2>
            <p className="text-lg text-gray-600 max-w-md">
              Exchange unused clothing through direct swaps or our point-based
              system. Promote sustainable fashion and reduce textile waste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/browse"
                className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors text-center"
              >
                START SWAPPING
              </Link>
              <Link
                to="/browse"
                className="border border-black text-black px-8 py-3 text-sm font-medium hover:bg-black hover:text-white transition-colors text-center"
              >
                BROWSE ITEMS
              </Link>
              {isSignedIn && (
                <Link
                  to="/add-item"
                  className="bg-gray-100 text-gray-900 px-8 py-3 text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  LIST AN ITEM
                </Link>
              )}
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src={assets.hero_img}
              alt="Sustainable Fashion"
              className="w-full h-auto max-w-lg mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Latest Collections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              LATEST COLLECTIONS
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {latestArrivals.slice(0, 10).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Seller */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              BEST SELLER
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {bestSellers.slice(0, 10).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <img
                  src={assets.exchange_icon}
                  alt="Exchange"
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Easy Exchanges
              </h3>
              <p className="text-gray-600">
                Simple and secure clothing exchanges within our community
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <img
                  src={assets.quality_icon}
                  alt="Quality"
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Quality Assured
              </h3>
              <p className="text-gray-600">
                All items are carefully reviewed for quality and condition
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Sustainable Fashion
              </h3>
              <p className="text-gray-600">
                Reduce waste and environmental impact through clothing reuse
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light mb-4">
            Subscribe now & get 20% off
          </h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Join our community and get exclusive access to new arrivals and
            special offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 text-black text-sm focus:outline-none"
            />
            <button className="bg-white text-black px-8 py-3 text-sm font-medium hover:bg-gray-100 transition-colors">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
