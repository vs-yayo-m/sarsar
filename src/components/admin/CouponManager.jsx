// FILE PATH: src/components/admin/CouponManager.jsx
// Coupon Manager Component - Create and manage discount coupons
// Coupon code generation, usage tracking, and management

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, 
  Plus,
  Copy,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import { doc, addDoc, updateDoc, deleteDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

const CouponManager = ({ coupons = [], onRefresh }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    expiryDate: '',
    description: ''
  });

  // Generate random coupon code
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  // Handle create coupon
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'coupons'), {
        ...formData,
        value: parseFloat(formData.value),
        minOrderValue: parseFloat(formData.minOrderValue) || 0,
        maxDiscount: parseFloat(formData.maxDiscount) || null,
        usageLimit: parseInt(formData.usageLimit) || null,
        usageCount: 0,
        active: true,
        createdAt: Timestamp.now()
      });

      setShowCreateModal(false);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        minOrderValue: '',
        maxDiscount: '',
        usageLimit: '',
        expiryDate: '',
        description: ''
      });

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Failed to create coupon');
    }
  };

  // Toggle coupon status
  const handleToggleStatus = async (couponId, currentActive) => {
    try {
      await updateDoc(doc(db, 'coupons', couponId), {
        active: !currentActive,
        updatedAt: Timestamp.now()
      });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating coupon:', error);
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteDoc(doc(db, 'coupons', couponId));
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  // Copy coupon code
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Coupon Management</h3>
          <p className="text-sm text-gray-600">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No coupons yet. Create your first coupon!</p>
          </div>
        ) : (
          coupons.map((coupon, index) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl border-2 p-6 relative overflow-hidden ${
                coupon.active ? 'border-orange-500' : 'border-gray-200'
              }`}
            >
              {/* Status Indicator */}
              <div className="absolute top-0 right-0">
                <div className={`px-3 py-1 text-xs font-medium ${
                  coupon.active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                }`}>
                  {coupon.active ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-5 h-5 text-orange-600" />
                  <span className="text-xs text-gray-500">Coupon Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xl font-bold text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
                    {coupon.code}
                  </code>
                  <button
                    onClick={() => handleCopyCode(coupon.code)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Discount Value */}
              <div className="mb-4">
                <p className="text-2xl font-bold text-orange-600">
                  {coupon.type === 'percentage' 
                    ? `${coupon.value}% OFF` 
                    : `Rs. ${coupon.value} OFF`}
                </p>
                {coupon.minOrderValue > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    Min. order: Rs. {coupon.minOrderValue}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Used</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {coupon.usageCount || 0}
                    {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Expires</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {coupon.expiryDate 
                      ? new Date(coupon.expiryDate).toLocaleDateString() 
                      : 'No expiry'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(coupon.id, coupon.active)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {coupon.active ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Inactive</span>
                    </>
                  )}
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Coupon Modal */}
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
                <h3 className="text-xl font-bold text-gray-900">Create New Coupon</h3>
                <p className="text-sm text-gray-600 mt-1">Set up a discount coupon</p>
              </div>

              <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="SUMMER2025"
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* Discount Type and Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder={formData.type === 'percentage' ? '10' : '100'}
                    />
                  </div>
                </div>

                {/* Conditions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min. Order Value (Rs.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max. Discount (Rs.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="No limit"
                    />
                  </div>
                </div>

                {/* Usage and Expiry */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="Internal note about this coupon..."
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Create Coupon
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
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

export default CouponManager;