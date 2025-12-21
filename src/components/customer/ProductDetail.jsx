// FILE PATH: src/components/customer/ProductDetail.jsx
// Product Detail Component - Reusable product information display

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import RatingStars from '@/components/shared/RatingStars';
import Button from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';

const ProductDetail = ({ product, onAddToCart, onBuyNow }) => {
  const { isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const price = product.discountPrice || product.price;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  // Handle quantity change
  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && (!product.stock || newQty <= product.stock)) {
      setQuantity(newQty);
    }
  };

  // Handle wishlist
  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        {/* Category & Actions */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
            {product.category}
          </span>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={`p-2 rounded-full transition-all ${
                isWishlisted
                  ? 'bg-red-100 text-red-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Product Name */}
        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
          {product.name}
        </h1>

        {/* Rating */}
        {product.rating > 0 && (
          <RatingStars
            rating={product.rating}
            showCount
            count={product.reviewCount || 0}
            size="lg"
          />
        )}

        {/* Price Section */}
        <div className="flex items-end gap-4 py-4">
          <div className="text-4xl font-black text-orange-600">
            Rs. {price.toFixed(2)}
          </div>
          {product.discountPrice && (
            <>
              <div className="text-2xl text-gray-400 line-through mb-1">
                Rs. {product.price.toFixed(2)}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-1"
              >
                {discountPercent}% OFF
              </motion.div>
            </>
          )}
        </div>

        {/* Stock Status */}
        <div>
          {product.stock > 0 ? (
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-semibold">
                {product.stock <= 5
                  ? `Only ${product.stock} left in stock!`
                  : 'In Stock'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Quantity & Actions */}
      {product.stock > 0 && (
        <div className="space-y-4">
          {/* Quantity Selector */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-700"
                >
                  −
                </button>
                <div className="px-6 py-3 text-xl font-bold text-gray-900 min-w-[60px] text-center">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={product.stock && quantity >= product.stock}
                  className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-700"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {product.stock} available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => onAddToCart(product, quantity)}
              disabled={isInCart(product.id)}
              size="lg"
              className="flex-1"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isInCart(product.id) ? 'Already in Cart' : 'Add to Cart'}
            </Button>
            <Button
              onClick={() => onBuyNow(product, quantity)}
              size="lg"
              variant="secondary"
              className="flex-1"
            >
              Buy Now
            </Button>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">Fast Delivery</div>
            <div className="text-xs text-gray-600">Within 1 hour</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">Secure Payment</div>
            <div className="text-xs text-gray-600">100% protected</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">Easy Returns</div>
            <div className="text-xs text-gray-600">7 days return</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        {/* Tab Headers */}
        <div className="flex border-b-2 border-gray-200">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-colors relative ${
                selectedTab === tab
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {selectedTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {selectedTab === 'description' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose max-w-none"
            >
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </motion.div>
          )}

          {selectedTab === 'specifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {product.specifications ? (
                Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No specifications available.</p>
              )}
            </motion.div>
          )}

          {selectedTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;