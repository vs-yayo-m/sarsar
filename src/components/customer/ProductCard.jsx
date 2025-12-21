// FILE PATH: src/components/customer/ProductCard.jsx
// Product Card Component - Premium design with animations

import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Calculate discount percentage
  const discountPercent = product.discountPrice ?
    Math.round(((product.price - product.discountPrice) / product.price) * 100) :
    0;
  
  // Handle add to cart with animation
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };
  
  // Handle wishlist toggle
  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };
  
  // Handle card click
  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/20"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Product Image */}
        <motion.img
          src={product.image || product.images?.[0] || '/placeholder-product.jpg'}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg"
            >
              {discountPercent}% OFF
            </motion.div>
          )}

          {/* New Badge */}
          {product.isNew && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="px-2.5 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full shadow-lg"
            >
              NEW
            </motion.div>
          )}

          {/* Trending Badge */}
          {product.isTrending && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.4 }}
              className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              HOT
            </motion.div>
          )}
        </div>

        {/* Action Buttons - Show on hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={`p-2.5 rounded-full shadow-lg transition-colors ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.button>

          {/* Quick View Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Open quick view modal
            }}
            className="p-2.5 bg-white rounded-full shadow-lg text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Stock Indicator */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="px-4 py-2 bg-white rounded-full">
              <span className="text-sm font-bold text-gray-900">Out of Stock</span>
            </div>
          </div>
        )}

        {/* Low Stock Warning */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="px-3 py-1.5 bg-amber-500/90 backdrop-blur-sm rounded-full text-white text-xs font-semibold text-center">
              Only {product.stock} left!
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Category */}
        {product.category && (
          <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
            {product.category}
          </span>
        )}

        {/* Product Name */}
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-orange-600">
            Rs. {(product.discountPrice || product.price).toFixed(2)}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-400 line-through mb-1">
              Rs. {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isInCart(product.id)}
          className={`
            w-full py-3 px-4 rounded-xl font-semibold text-sm
            transition-all duration-200 flex items-center justify-center gap-2
            ${
              product.stock === 0 || isInCart(product.id)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30'
            }
          `}
        >
          <ShoppingCart className="w-5 h-5" />
          {isInCart(product.id)
            ? 'In Cart'
            : product.stock === 0
            ? 'Out of Stock'
            : 'Add to Cart'}
        </motion.button>

        {/* Delivery Info */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Delivery in 1 hour</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;