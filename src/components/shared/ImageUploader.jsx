// FILE PATH: src/components/shared/ImageUploader.jsx

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';
import toast from 'react-hot-toast';

const ImageUploader = ({ images = [], onChange, maxImages = 5, onUploading }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  // Handle file selection
  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    
    // Check max images
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }
    
    // Validate and upload files
    setUploading(true);
    onUploading?.(true);
    
    const uploadPromises = Array.from(files).map(async (file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return null;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return null;
      }
      
      try {
        // Create unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const filename = `products/${timestamp}-${randomStr}-${file.name}`;
        
        // Upload to Firebase Storage
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, file);
        
        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(`Failed to upload ${file.name}`);
        return null;
      }
    });
    
    const uploadedURLs = await Promise.all(uploadPromises);
    const validURLs = uploadedURLs.filter(url => url !== null);
    
    if (validURLs.length > 0) {
      onChange([...images, ...validURLs]);
      toast.success(`${validURLs.length} image(s) uploaded successfully!`);
    }
    
    setUploading(false);
    onUploading?.(false);
  };
  
  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  // Handle remove image
  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    toast.success('Image removed');
  };
  
  // Handle reorder (move image)
  const handleReorder = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };
  
  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${dragActive 
              ? 'border-orange-500 bg-orange-50' 
              : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/50'
            }
            ${uploading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader className="w-12 h-12 text-orange-500 animate-spin mb-3" />
              <p className="text-sm font-semibold text-gray-700">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WebP up to 5MB ({images.length}/{maxImages} uploaded)
              </p>
            </>
          )}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-orange-400 transition-colors group"
              >
                {/* Image */}
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

                {/* Main Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
                      Main
                    </span>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Reorder Buttons */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      onClick={() => handleReorder(index, index - 1)}
                      className="px-2 py-1 bg-white text-gray-700 text-xs rounded hover:bg-gray-100"
                      type="button"
                    >
                      ←
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      onClick={() => handleReorder(index, index + 1)}
                      className="px-2 py-1 bg-white text-gray-700 text-xs rounded hover:bg-gray-100"
                      type="button"
                    >
                      →
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="text-center py-4 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;