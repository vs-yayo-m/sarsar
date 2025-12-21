// FILE PATH: src/components/customer/FilterSidebar.jsx
// Filter Sidebar - Product filtering options

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

const CATEGORIES = [
  'Groceries',
  'Vegetables',
  'Fruits',
  'Dairy',
  'Meat & Fish',
  'Beverages',
  'Snacks',
  'Kitchen',
  'Household',
  'Baby Care',
  'Beauty',
  'Health',
];

const FilterSidebar = ({ filters, onFilterChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    availability: true,
  });

  // Update local filters when prop changes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    const newFilters = {
      ...localFilters,
      category: localFilters.category === category ? '' : category
    };
    setLocalFilters(newFilters);
  };

  // Handle price change
  const handlePriceChange = (type, value) => {
    const newFilters = {
      ...localFilters,
      [type]: Number(value)
    };
    setLocalFilters(newFilters);
  };

  // Handle stock filter
  const handleStockChange = (checked) => {
    const newFilters = {
      ...localFilters,
      inStock: checked
    };
    setLocalFilters(newFilters);
  };

  // Apply filters
  const handleApply = () => {
    onFilterChange(localFilters);
    if (onClose) onClose();
  };

  // Reset filters
  const handleReset = () => {
    const defaultFilters = {
      category: '',
      minPrice: 0,
      maxPrice: 10000,
      sortBy: 'newest',
      inStock: true,
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="divide-y divide-gray-200">
        {/* Category Filter */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-semibold text-gray-900">Category</span>
            {expandedSections.category ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.category && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2 max-h-64 overflow-y-auto"
              >
                {CATEGORIES.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={localFilters.category === category}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
                {localFilters.category && (
                  <button
                    onClick={() => handleCategoryChange('')}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Clear selection
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range Filter */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-semibold text-gray-900">Price Range</span>
            {expandedSections.price ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.price && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Min Price */}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Min Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={localFilters.minPrice}
                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-colors"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Max Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={localFilters.maxPrice}
                    onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-colors"
                  />
                </div>

                {/* Price Range Display */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Range:</span>
                  <span className="font-semibold text-gray-900">
                    Rs. {localFilters.minPrice} - Rs. {localFilters.maxPrice}
                  </span>
                </div>

                {/* Quick Price Ranges */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      handlePriceChange('minPrice', 0);
                      handlePriceChange('maxPrice', 100);
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    Under Rs. 100
                  </button>
                  <button
                    onClick={() => {
                      handlePriceChange('minPrice', 100);
                      handlePriceChange('maxPrice', 500);
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    Rs. 100-500
                  </button>
                  <button
                    onClick={() => {
                      handlePriceChange('minPrice', 500);
                      handlePriceChange('maxPrice', 1000);
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    Rs. 500-1000
                  </button>
                  <button
                    onClick={() => {
                      handlePriceChange('minPrice', 1000);
                      handlePriceChange('maxPrice', 10000);
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    Above Rs. 1000
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Availability Filter */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('availability')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-semibold text-gray-900">Availability</span>
            {expandedSections.availability ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.availability && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={localFilters.inStock}
                    onChange={(e) => handleStockChange(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button onClick={handleApply} className="w-full" size="lg">
          Apply Filters
        </Button>
        <button
          onClick={handleReset}
          className="w-full py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;