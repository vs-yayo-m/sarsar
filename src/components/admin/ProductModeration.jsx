// FILE PATH: src/components/admin/ProductModeration.jsx
// Product Moderation Table - Review and approve/reject products
// Quick actions for product status, visibility, and featured settings

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  Star,
  Edit,
  Trash2,
  Package,
  Image as ImageIcon
} from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Link } from 'react-router-dom';

const ProductModeration = ({ products, loading }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Handle approve product
  const handleApprove = async (productId) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        active: true,
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: 'admin'
      });
      window.location.reload();
    } catch (error) {
      console.error('Error approving product:', error);
    }
  };

  // Handle reject product
  const handleReject = async (productId) => {
    if (window.confirm('Are you sure you want to reject this product?')) {
      try {
        await updateDoc(doc(db, 'products', productId), {
          active: false,
          status: 'rejected',
          rejectedAt: new Date(),
          rejectedBy: 'admin'
        });
        window.location.reload();
      } catch (error) {
        console.error('Error rejecting product:', error);
      }
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (productId, currentFeatured) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        featured: !currentFeatured
      });
      window.location.reload();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  // Toggle active status
  const handleToggleActive = async (productId, currentActive) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        active: !currentActive
      });
      window.location.reload();
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        window.location.reload();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Handle select single
  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-b-xl border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-b-xl border border-gray-200 p-12 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-xl border-b border-l border-r border-gray-200 overflow-hidden">
      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-6 py-3 bg-orange-50 border-b border-orange-200 flex items-center justify-between"
        >
          <span className="text-sm font-medium text-gray-900">
            {selectedProducts.length} product(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-colors">
              Bulk Approve
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-colors">
              Bulk Reject
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-white rounded-lg transition-colors">
              Bulk Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Checkbox */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                  </td>

                  {/* Product Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mr-3">
                        {product.images && product.images[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="max-w-xs">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/product/${product.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-orange-600 line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          {product.featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          ID: {product.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      {product.category || 'Uncategorized'}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      Rs. {product.price?.toLocaleString() || 0}
                    </div>
                    {product.discountPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        Rs. {product.discountPrice.toLocaleString()}
                      </div>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      product.stock > 10 ? 'text-green-600' : 
                      product.stock > 0 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {product.stock || 0} units
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                      {product.status === 'pending' && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {/* View */}
                      <Link
                        to={`/product/${product.id}`}
                        className="text-gray-600 hover:text-orange-600 transition-colors"
                        title="View Product"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Toggle Active */}
                      <button
                        onClick={() => handleToggleActive(product.id, product.active)}
                        className={`transition-colors ${
                          product.active 
                            ? 'text-gray-600 hover:text-red-600' 
                            : 'text-gray-600 hover:text-green-600'
                        }`}
                        title={product.active ? 'Deactivate' : 'Activate'}
                      >
                        {product.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      {/* Toggle Featured */}
                      <button
                        onClick={() => handleToggleFeatured(product.id, product.featured)}
                        className={`transition-colors ${
                          product.featured 
                            ? 'text-yellow-500 hover:text-yellow-600' 
                            : 'text-gray-600 hover:text-yellow-500'
                        }`}
                        title={product.featured ? 'Remove from Featured' : 'Add to Featured'}
                      >
                        <Star className={`w-4 h-4 ${product.featured ? 'fill-yellow-500' : ''}`} />
                      </button>

                      {/* Approve (if pending) */}
                      {product.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(product.id)}
                          className="text-gray-600 hover:text-green-600 transition-colors"
                          title="Approve Product"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Reject (if pending) */}
                      {product.status === 'pending' && (
                        <button
                          onClick={() => handleReject(product.id)}
                          className="text-gray-600 hover:text-red-600 transition-colors"
                          title="Reject Product"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductModeration;