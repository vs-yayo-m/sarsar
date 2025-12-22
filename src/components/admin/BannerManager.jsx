// FILE PATH: src/components/admin/BannerManager.jsx
// Banner Manager Component - Homepage banner management
// Upload, position, and schedule promotional banners

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { doc, addDoc, updateDoc, deleteDoc, collection, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';

const BannerManager = ({ banners = [], onRefresh }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    linkUrl: '',
    position: 1,
    active: true
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle create banner
  const handleCreateBanner = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    setUploading(true);

    try {
      // Upload image
      const imageRef = ref(storage, `banners/${Date.now()}_${selectedImage.name}`);
      await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(imageRef);

      // Create banner document
      await addDoc(collection(db, 'banners'), {
        ...formData,
        imageUrl,
        createdAt: Timestamp.now(),
        clicks: 0,
        impressions: 0
      });

      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        linkUrl: '',
        position: 1,
        active: true
      });
      setSelectedImage(null);
      setImagePreview('');
      setUploading(false);

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error creating banner:', error);
      alert('Failed to create banner');
      setUploading(false);
    }
  };

  // Toggle banner visibility
  const handleToggleVisibility = async (bannerId, currentActive) => {
    try {
      await updateDoc(doc(db, 'banners', bannerId), {
        active: !currentActive,
        updatedAt: Timestamp.now()
      });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating banner:', error);
    }
  };

  // Delete banner
  const handleDeleteBanner = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteDoc(doc(db, 'banners', bannerId));
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  // Update position
  const handleUpdatePosition = async (bannerId, newPosition) => {
    try {
      await updateDoc(doc(db, 'banners', bannerId), {
        position: newPosition,
        updatedAt: Timestamp.now()
      });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating position:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Banner Management</h3>
          <p className="text-sm text-gray-600">Manage homepage promotional banners</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Banner</span>
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {banners.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No banners yet. Create your first banner!</p>
          </div>
        ) : (
          banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">
                {/* Banner Preview */}
                <div className="w-48 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {banner.imageUrl ? (
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Banner Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{banner.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      banner.active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {banner.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Position {banner.position}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{banner.description}</p>
                  {banner.linkUrl && (
                    <a 
                      href={banner.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-600 hover:text-orange-700"
                    >
                      {banner.linkUrl}
                    </a>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-xs text-gray-500">
                      <Eye className="w-3 h-3 inline mr-1" />
                      {banner.impressions || 0} views
                    </div>
                    <div className="text-xs text-gray-500">
                      {banner.clicks || 0} clicks
                    </div>
                    {banner.impressions > 0 && (
                      <div className="text-xs text-gray-500">
                        {((banner.clicks / banner.impressions) * 100).toFixed(1)}% CTR
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Position Controls */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleUpdatePosition(banner.id, Math.max(1, banner.position - 1))}
                      disabled={banner.position === 1}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <MoveUp className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleUpdatePosition(banner.id, banner.position + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Move down"
                    >
                      <MoveDown className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Toggle Visibility */}
                  <button
                    onClick={() => handleToggleVisibility(banner.id, banner.active)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={banner.active ? 'Hide' : 'Show'}
                  >
                    {banner.active ? (
                      <Eye className="w-4 h-4 text-gray-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-600" />
                    )}
                  </button>

                  {/* Edit */}
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Banner Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Create New Banner</h3>
                <p className="text-sm text-gray-600 mt-1">Upload and configure a promotional banner</p>
              </div>

              <form onSubmit={handleCreateBanner} className="p-6 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image * (Recommended: 1920x400px)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview('');
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Banner Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="Summer Sale 2025"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="Get up to 50% off on all items"
                  />
                </div>

                {/* Link URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="https://example.com/sale"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Position
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Create Banner'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={uploading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BannerManager;