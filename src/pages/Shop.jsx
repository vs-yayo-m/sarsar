// FILE PATH: src/pages/Shop.jsx
// Shop Page - Browse all products with filters and sorting

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from '@/components/customer/ProductGrid';
import FilterSidebar from '@/components/customer/FilterSidebar';
import SearchBar from '@/components/customer/SearchBar';
import useProducts from '@/hooks/useProducts';
import Button from '@/components/ui/Button';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'newest',
    inStock: true,
  });
  
  const { products, loading, error, fetchProducts, fetchByCategory, searchProducts } = useProducts();
  
  // Initial fetch
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (search) {
      searchProducts(search);
    } else if (category) {
      fetchByCategory(category);
      setFilters(prev => ({ ...prev, category }));
    } else {
      fetchProducts(filters);
    }
  }, [searchParams]);
  
  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchProducts(newFilters);
  };
  
  // Handle sort change
  const handleSortChange = (sortBy) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    fetchProducts(newFilters);
  };
  
  // Handle search
  const handleSearch = (term) => {
    searchProducts(term);
  };
  
  // Clear filters
  const handleClearFilters = () => {
    const defaultFilters = {
      category: '',
      minPrice: 0,
      maxPrice: 10000,
      sortBy: 'newest',
      inStock: true,
    };
    setFilters(defaultFilters);
    fetchProducts(defaultFilters);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
            Shop All Products
          </h1>
          
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} className="mb-6" />

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-semibold">Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold focus:border-orange-500 focus:outline-none transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.category || filters.minPrice > 0 || filters.maxPrice < 10000) && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {filters.category && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                >
                  {filters.category}
                  <button
                    onClick={() => handleFilterChange({ ...filters, category: '' })}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              )}

              {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                >
                  Rs. {filters.minPrice} - Rs. {filters.maxPrice}
                  <button
                    onClick={() => handleFilterChange({ ...filters, minPrice: 0, maxPrice: 10000 })}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              )}

              <button
                onClick={handleClearFilters}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className={`
            lg:col-span-1
            ${showFilters ? 'block' : 'hidden lg:block'}
          `}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowFilters(false)}
            />
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {/* Results Count */}
            {!loading && products.length > 0 && (
              <p className="text-sm text-gray-600 mb-6">
                Showing <span className="font-semibold">{products.length}</span> products
              </p>
            )}

            {/* Products */}
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
            />

            {/* Load More */}
            {!loading && products.length > 0 && (
              <div className="mt-12 text-center">
                <Button
                  onClick={() => {/* TODO: Load more */}}
                  variant="secondary"
                  size="lg"
                >
                  Load More Products
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;