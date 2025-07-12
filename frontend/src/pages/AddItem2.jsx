import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { assets } from "../assets/data";

const AddItem = () => {
  const { addUploadedItem } = useUserContext();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    brand: "",
    color: "",
    material: "",
    location: "",
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Topwear", "Bottomwear", "Winterwear"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const conditions = ["Like New", "Excellent", "Very Good", "Good", "Fair"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create new item
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        uploadedBy: "Current User",
        uploadedAt: new Date().toISOString(),
        status: "pending",
      };

      // Add to user's uploaded items
      addUploadedItem(newItem);

      toast.success(
        "Item uploaded successfully! It will be reviewed by our team."
      );

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        size: "",
        condition: "",
        brand: "",
        color: "",
        material: "",
        location: "",
        images: [],
      });
    } catch (error) {
      toast.error("Failed to upload item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-gray-900 mb-4">
            SHARE YOUR ITEM
          </h1>
          <div className="w-24 h-px bg-gray-300 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Upload Images*
            </label>
            <div className="border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer">
                <img
                  src={assets.upload_area}
                  alt="Upload"
                  className="w-16 h-16 mx-auto mb-4 opacity-60"
                />
                <p className="text-gray-600 mb-2">Click to upload images</p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </label>
              {formData.images.length > 0 && (
                <p className="mt-4 text-sm text-black">
                  {formData.images.length} file(s) selected
                </p>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Item Name*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter item name"
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your item..."
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Category and Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Category*
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-gray-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Size*
              </label>
              <select
                id="size"
                name="size"
                required
                value={formData.size}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-gray-500"
              >
                <option value="">Select Size</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition and Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="condition"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Condition*
              </label>
              <select
                id="condition"
                name="condition"
                required
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-gray-500"
              >
                <option value="">Select Condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter brand name"
                className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Color and Material */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Color
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Enter color"
                className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="material"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Material
              </label>
              <input
                type="text"
                id="material"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="Enter material"
                className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Location*
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter your location"
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-12 py-3 text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {isSubmitting ? "UPLOADING..." : "ADD ITEM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
