import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { carouselImages } from "../assets/carousel/carouselData";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 2000); // Slower 6-second intervals for better viewing

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <section className="relative h-[80vh] overflow-hidden bg-gray-900">
      {/* Carousel Images */}
      <div className="relative w-full h-full">
        {carouselImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 tracking-wide drop-shadow-lg">
                  {image.title}
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-8 opacity-95 drop-shadow-md">
                  {image.subtitle}
                </h2>
                <p className="text-base md:text-lg font-light mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
                  {image.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/browse"
                    className="bg-white text-black px-10 py-4 text-sm font-semibold tracking-wider hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    START SWAPPING
                  </Link>
                  <Link
                    to="/browse"
                    className="border-2 border-white text-white px-10 py-4 text-sm font-semibold tracking-wider hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
                  >
                    BROWSE ITEMS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm group"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm group"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Minimal slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-12 h-1 transition-all duration-500 ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
