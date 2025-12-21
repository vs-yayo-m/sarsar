// FILE PATH: src/components/customer/CategoryGrid.jsx
// Category Grid Component - Display product categories with icons

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Apple,
  Milk,
  ShoppingBag,
  Beef,
  Coffee,
  Candy,
  Utensils,
  Home,
  Baby,
  Sparkles,
  Pill,
  Shirt,
} from 'lucide-react';

// Category data with icons
const CATEGORIES = [
  { id: 'groceries', name: 'Groceries', icon: ShoppingBag, color: 'from-green-500 to-green-600' },
  { id: 'vegetables', name: 'Vegetables', icon: Apple, color: 'from-emerald-500 to-emerald-600' },
  { id: 'fruits', name: 'Fruits', icon: Apple, color: 'from-red-500 to-red-600' },
  { id: 'dairy', name: 'Dairy', icon: Milk, color: 'from-blue-500 to-blue-600' },
  { id: 'meat', name: 'Meat & Fish', icon: Beef, color: 'from-pink-500 to-pink-600' },
  { id: 'beverages', name: 'Beverages', icon: Coffee, color: 'from-amber-500 to-amber-600' },
  { id: 'snacks', name: 'Snacks', icon: Candy, color: 'from-purple-500 to-purple-600' },
  { id: 'kitchen', name: 'Kitchen', icon: Utensils, color: 'from-orange-500 to-orange-600' },
  { id: 'household', name: 'Household', icon: Home, color: 'from-teal-500 to-teal-600' },
  { id: 'baby', name: 'Baby Care', icon: Baby, color: 'from-pink-400 to-pink-500' },
  { id: 'beauty', name: 'Beauty', icon: Sparkles, color: 'from-violet-500 to-violet-600' },
  { id: 'health', name: 'Health', icon: Pill, color: 'from-cyan-500 to-cyan-600' },
];

const CategoryGrid = ({ onCategoryClick, layout = 'grid' }) => {
  const navigate = useNavigate();
  
  // Handle category click
  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    } else {
      navigate(`/shop?category=${category.id}`);
    }
  };
  
  // Grid layout (default)
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-orange-500 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/20"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-200`} />

              {/* Content */}
              <div className="relative flex flex-col items-center gap-3">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Category Name */}
                <span className="text-sm font-semibold text-gray-900 text-center group-hover:text-orange-600 transition-colors">
                  {category.name}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  }
  
  // Horizontal scroll layout
  if (layout === 'scroll') {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex-shrink-0 bg-white rounded-2xl p-4 border-2 border-gray-200 hover:border-orange-500 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/20 min-w-[140px]"
            >
              {/* Content */}
              <div className="flex flex-col items-center gap-3">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Category Name */}
                <span className="text-sm font-semibold text-gray-900 text-center group-hover:text-orange-600 transition-colors">
                  {category.name}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  }
  
  // Compact list layout
  if (layout === 'list') {
    return (
      <div className="space-y-2">
        {CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ x: 5 }}
              className="group w-full flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-500 transition-all duration-200 hover:shadow-lg"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Category Name */}
              <span className="text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                {category.name}
              </span>

              {/* Arrow */}
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-orange-500" />
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  }
  
  return null;
};

export default CategoryGrid;