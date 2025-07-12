import React from 'react';
import { assets } from '../assets/data';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <img src={assets.logo} alt="ReWear" className="h-8 mb-4" />
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              ReWear is your community-driven platform for sustainable fashion exchange. 
              Give your clothes a second life while discovering unique pre-loved treasures 
              from fellow fashion enthusiasts.
            </p>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">COMPANY</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-gray-900 transition-colors">Home</a></li>
              <li><a href="/browse" className="hover:text-gray-900 transition-colors">About us</a></li>
              <li><a href="/browse" className="hover:text-gray-900 transition-colors">Delivery</a></li>
              <li><a href="/browse" className="hover:text-gray-900 transition-colors">Privacy policy</a></li>
            </ul>
          </div>
          
          {/* Get in Touch */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">GET IN TOUCH</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>+1-212-456-7890</li>
              <li>contact@rewear.com</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Copyright 2025 @ rewear.com - All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
