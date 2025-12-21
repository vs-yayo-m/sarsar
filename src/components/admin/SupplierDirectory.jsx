// FILE PATH: src/components/admin/SupplierDirectory.jsx
// Supplier Directory Table - Manage supplier accounts and verification
// Performance metrics, verification controls, and commission settings

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin,
  Package,
  ShoppingBag,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Ban,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

const SupplierDirectory = ({ suppliers, loading }) => {
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  // Verify supplier
  const handleVerify = async (supplierId) => {
    try {
      await updateDoc(doc(db, 'users', supplierId), {
        verified: true,
        verifiedAt: new Date(),
        verifiedBy: 'admin'
      });
      window.location.reload();
    } catch (error) {
      console.error('Error verifying supplier:', error);
    }
  };

  // Unverify supplier
  const handleUnverify = async (supplierId) => {
    if (window.confirm('Are you sure you want to remove verification?')) {
      try {
        await updateDoc(doc(db, 'users', supplierId), {
          verified: false,
          unverifiedAt: new Date(),
          unverifiedBy: 'admin'
        });
        window.location.reload();
      } catch (error) {
        console.error('Error unverifying supplier:', error);
      }
    }
  };

  // Suspend supplier
  const handleSuspend = async (supplierId) => {
    if (window.confirm('Are you sure you want to suspend this supplier?')) {
      try {
        await updateDoc(doc(db, 'users', supplierId), {
          status: 'suspended',
          suspendedAt: new Date(),
          suspendedBy: 'admin'
        });
        window.location.reload();
      } catch (error) {
        console.error('Error suspending supplier:', error);
      }
    }
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSuppliers(suppliers.map(s => s.id));
    } else {
      setSelectedSuppliers([]);
    }
  };

  // Handle select single
  const handleSelectSupplier = (supplierId) => {
    if (selectedSuppliers.includes(supplierId)) {
      setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplierId));
    } else {
      setSelectedSuppliers([...selectedSuppliers, supplierId]);
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

  if (suppliers.length === 0) {
    return (
      <div className="bg-white rounded-b-xl border border-gray-200 p-12 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No suppliers found</h3>
        <p className="text-gray-600">No suppliers match your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-xl border-b border-l border-r border-gray-200 overflow-hidden">
      {/* Bulk Actions */}
      {selectedSuppliers.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-6 py-3 bg-orange-50 border-b border-orange-200 flex items-center justify-between"
        >
          <span className="text-sm font-medium text-gray-900">
            {selectedSuppliers.length} supplier(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-colors">
              Bulk Verify
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-colors">
              Send Message
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
                  checked={selectedSuppliers.length === suppliers.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
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
              {suppliers.map((supplier, index) => (
                <motion.tr
                  key={supplier.id}
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
                      checked={selectedSuppliers.includes(supplier.id)}
                      onChange={() => handleSelectSupplier(supplier.id)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                  </td>

                  {/* Supplier Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg font-bold text-orange-600">
                          {supplier.businessName?.charAt(0).toUpperCase() || 'S'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">
                            {supplier.businessName || 'N/A'}
                          </div>
                          {supplier.verified && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {supplier.name || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(supplier.rating || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            ({supplier.rating?.toFixed(1) || '0.0'})
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-xs">{supplier.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {supplier.phone || 'N/A'}
                      </div>
                      {supplier.businessAddress && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-xs">{supplier.businessAddress}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Performance */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Package className="w-3 h-3 text-gray-400" />
                        {supplier.productsCount || 0} products
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <ShoppingBag className="w-3 h-3 text-gray-400" />
                        {supplier.ordersCount || 0} orders
                      </div>
                    </div>
                  </td>

                  {/* Revenue */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      Rs. {(supplier.revenue || 0).toLocaleString()}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        supplier.verified
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {supplier.verified ? 'Verified' : 'Pending'}
                      </span>
                      {supplier.status === 'suspended' && (
                        <span className="block px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-700">
                          Suspended
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {/* View Details */}
                      <Link
                        to={`/admin/suppliers/${supplier.id}`}
                        className="text-gray-600 hover:text-orange-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Verify/Unverify */}
                      {supplier.verified ? (
                        <button
                          onClick={() => handleUnverify(supplier.id)}
                          className="text-gray-600 hover:text-yellow-600 transition-colors"
                          title="Remove Verification"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerify(supplier.id)}
                          className="text-gray-600 hover:text-green-600 transition-colors"
                          title="Verify Supplier"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Suspend */}
                      {supplier.status !== 'suspended' && (
                        <button
                          onClick={() => handleSuspend(supplier.id)}
                          className="text-gray-600 hover:text-red-600 transition-colors"
                          title="Suspend Supplier"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}

                      {/* Settings */}
                      <Link
                        to={`/admin/suppliers/${supplier.id}/settings`}
                        className="text-gray-600 hover:text-orange-600 transition-colors"
                        title="Supplier Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </Link>
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

export default SupplierDirectory;