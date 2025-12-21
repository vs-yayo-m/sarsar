// FILE PATH: src/components/customer/AddressForm.jsx
// Address Form Component - Add/Edit delivery addresses

import { useState } from 'react';
import { MapPin, Home, Briefcase, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const AddressForm = ({ address, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    label: address?.label || '',
    ward: address?.ward || '',
    area: address?.area || '',
    street: address?.street || '',
    house: address?.house || '',
    landmark: address?.landmark || '',
    isDefault: address?.isDefault || false,
  });

  const [errors, setErrors] = useState({});

  // Quick label buttons
  const quickLabels = [
    { icon: Home, label: 'Home', value: 'Home' },
    { icon: Briefcase, label: 'Work', value: 'Work' },
    { icon: MapPin, label: 'Other', value: 'Other' },
  ];

  // Butwal wards
  const wards = Array.from({ length: 19 }, (_, i) => i + 1);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Label is required';
    }
    if (!formData.ward) {
      newErrors.ward = 'Ward is required';
    }
    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }
    if (!formData.street.trim()) {
      newErrors.street = 'Street is required';
    }
    if (!formData.house.trim()) {
      newErrors.house = 'House number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSave({
      ...formData,
      id: address?.id || Date.now().toString(),
      createdAt: address?.createdAt || new Date(),
      updatedAt: new Date(),
    });

    toast.success(address ? 'Address updated!' : 'Address added!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {address ? 'Edit Address' : 'Add New Address'}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Quick Label Selection */}
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">
            Address Label *
          </label>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {quickLabels.map(({ icon: Icon, label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, label: value }))}
                className={`
                  p-3 border-2 rounded-xl flex flex-col items-center gap-2
                  transition-all duration-200
                  ${formData.label === value
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="Or enter custom label"
            className={`
              w-full px-4 py-3 border-2 rounded-xl
              focus:outline-none transition-colors
              ${errors.label
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-orange-500'
              }
            `}
          />
          {errors.label && (
            <p className="text-red-500 text-sm mt-1">{errors.label}</p>
          )}
        </div>

        {/* Ward Selection */}
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">
            Ward *
          </label>
          <select
            name="ward"
            value={formData.ward}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 border-2 rounded-xl
              focus:outline-none transition-colors
              ${errors.ward
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-orange-500'
              }
            `}
          >
            <option value="">Select Ward</option>
            {wards.map(ward => (
              <option key={ward} value={ward}>
                Ward {ward}
              </option>
            ))}
          </select>
          {errors.ward && (
            <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
          )}
        </div>

        {/* Area */}
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">
            Area/Locality *
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="e.g., Traffic Chowk, Golpark"
            className={`
              w-full px-4 py-3 border-2 rounded-xl
              focus:outline-none transition-colors
              ${errors.area
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-orange-500'
              }
            `}
          />
          {errors.area && (
            <p className="text-red-500 text-sm mt-1">{errors.area}</p>
          )}
        </div>

        {/* Street */}
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">
            Street/Road *
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="e.g., Main Road, Siddhartha Highway"
            className={`
              w-full px-4 py-3 border-2 rounded-xl
              focus:outline-none transition-colors
              ${errors.street
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-orange-500'
              }
            `}
          />
          {errors.street && (
            <p className="text-red-500 text-sm mt-1">{errors.street}</p>
          )}
        </div>

        {/* House Number */}
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">
            House/Building Number *
          </label>
          <input
            type="text"
            name="house"
            value={formData.house}
            onChange={handleChange}
            placeholder="e.g., House #25, Building A"
            className={`
              w-full px-4 py-3 border-2 rounded-xl
              focus:outline-none transition-colors
              ${errors.house
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-orange-500'
              }
            `}
          />
          {errors.house && (
            <p className="text-red-500 text-sm mt-1">{errors.house}</p>
          )}
        </div>

        {/* Landmark */}
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">
            Nearby Landmark (Optional)
          </label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            placeholder="e.g., Near School, Opposite Bank"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Set as Default */}
        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
          />
          <div>
            <div className="font-semibold text-gray-900">
              Set as default address
            </div>
            <div className="text-sm text-gray-600">
              Use this address for future orders
            </div>
          </div>
        </label>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" className="flex-1">
            {address ? 'Update Address' : 'Save Address'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddressForm;