import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import ItemCard from "../components/ItemCard";
import ScrollVelocity from "../animations/ScrollVelocity";
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
                <svg
                  className="w-8 h-8 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                </svg>
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

      {/* Scroll Velocity Animation */}
      <section className="py-16 bg-black text-white overflow-hidden">
        <ScrollVelocity
          texts={["ReWear Community", "Sustainable Fashion"]}
          velocity={50}
          className="text-white opacity-80"
          parallaxClassName="h-24"
          scrollerClassName="text-2xl md:text-4xl font-light tracking-wider"
          numCopies={4}
        />
      </section>
    </div>
  );
};

export default Home;
