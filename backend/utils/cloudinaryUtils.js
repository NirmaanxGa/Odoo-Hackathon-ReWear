const cloudinary = require('../config/cloudinary');

// Upload single image to Cloudinary
const uploadImage = async (file, folder = 'rewear') => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 1000, crop: 'limit' },
          { quality: 'auto:good' },
          { format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 1000, crop: 'limit' },
            { quality: 'auto:good' },
            { format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              public_id: result.public_id,
              url: result.secure_url
            });
          }
        }
      );
      
      stream.end(file.buffer);
    });
  } catch (error) {
    throw new Error('Image upload failed: ' + error.message);
  }
};

// Upload multiple images to Cloudinary
const uploadMultipleImages = async (files, folder = 'rewear') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error('Multiple image upload failed: ' + error.message);
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error('Image deletion failed: ' + error.message);
  }
};

// Delete multiple images from Cloudinary
const deleteMultipleImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(id => deleteImage(id));
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    throw new Error('Multiple image deletion failed: ' + error.message);
  }
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages
};
