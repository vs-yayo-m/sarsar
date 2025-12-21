// FILE PATH: src/utils/imageUtils.js

/**
 * Image utility functions for SARSAR platform
 */

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateImageFile = (file) => {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed' };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { valid: false, error: `File too large. Maximum size is 5MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)` };
  }

  return { valid: true, error: null };
};

/**
 * Compress image file
 * @param {File} file - Image file to compress
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} quality - Compression quality (0-1)
 * @returns {Promise<Blob>} - Compressed image blob
 */
export const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Generate thumbnail from image
 * @param {File} file - Image file
 * @param {number} size - Thumbnail size (width and height)
 * @returns {Promise<string>} - Thumbnail data URL
 */
export const generateThumbnail = (file, size = 200) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        
        // Calculate crop dimensions (center crop)
        const aspectRatio = img.width / img.height;
        let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;

        if (aspectRatio > 1) {
          // Landscape
          sourceWidth = img.height;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Portrait or square
          sourceHeight = img.width;
          sourceY = (img.height - sourceHeight) / 2;
        }

        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, size, size);
        
        resolve(canvas.toDataURL(file.type, 0.8));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Get image dimensions
 * @param {File|string} source - Image file or URL
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (source) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(source);
    }
  });
};

/**
 * Convert image to WebP format
 * @param {File} file - Image file
 * @param {number} quality - Conversion quality (0-1)
 * @returns {Promise<Blob>}
 */
export const convertToWebP = (file, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('WebP conversion failed'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Create image variants (multiple sizes)
 * @param {File} file - Original image file
 * @returns {Promise<Object>} - Object with different size variants
 */
export const createImageVariants = async (file) => {
  try {
    const variants = {
      thumbnail: await compressImage(file, 200, 200, 0.8),
      small: await compressImage(file, 400, 400, 0.85),
      medium: await compressImage(file, 800, 800, 0.85),
      large: await compressImage(file, 1200, 1200, 0.9),
      original: file
    };

    return variants;
  } catch (error) {
    console.error('Error creating image variants:', error);
    throw error;
  }
};

/**
 * Generate blurhash placeholder (simplified version)
 * Note: For production, use actual blurhash library
 * @param {File} file - Image file
 * @returns {Promise<string>} - Base64 placeholder
 */
export const generatePlaceholder = async (file) => {
  try {
    // Generate very small thumbnail as placeholder
    const placeholder = await generateThumbnail(file, 20);
    return placeholder;
  } catch (error) {
    console.error('Error generating placeholder:', error);
    // Return default gray placeholder
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3C/svg%3E';
  }
};

/**
 * Batch process images
 * @param {FileList|Array} files - Array of image files
 * @param {Function} processor - Processing function
 * @returns {Promise<Array>} - Array of processed results
 */
export const batchProcessImages = async (files, processor) => {
  const fileArray = Array.from(files);
  const results = [];

  for (const file of fileArray) {
    try {
      const result = await processor(file);
      results.push({ file, result, error: null });
    } catch (error) {
      results.push({ file, result: null, error: error.message });
    }
  }

  return results;
};

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Check if browser supports WebP
 * @returns {Promise<boolean>}
 */
export const supportsWebP = () => {
  return new Promise((resolve) => {
    const webP = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    const img = new Image();
    
    img.onload = () => resolve(img.width === 2);
    img.onerror = () => resolve(false);
    img.src = webP;
  });
};

export default {
  validateImageFile,
  compressImage,
  generateThumbnail,
  getImageDimensions,
  convertToWebP,
  createImageVariants,
  generatePlaceholder,
  batchProcessImages,
  formatFileSize,
  supportsWebP
};