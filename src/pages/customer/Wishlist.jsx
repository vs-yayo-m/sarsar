// File: src/pages/customer/Wishlist.jsx
// Customer Wishlist page with saved products

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Share2,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import ProductCard from '@/components/customer/ProductCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  // Demo wishlist product IDs - in production, fetch from user profile
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch wishlist items
  useEffect(() => {
    if (user && products.length > 0) {
      // Demo: Get first 6 products as wishlist items
      // In production: Fetch user's actual wishlist from Firestore
      const demoWishlist = products.slice(0, 6).map((product) => ({
        ...product,
        addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        priceAtAdd: product.price + Math.floor(Math.random() * 50) // Original price when added
      }));
      setWishlistItems(demoWishlist);
      setLoading(false);
    }
  }, [user, products]);
  
  // Remove from wishlist
  const handleRemove = (productId) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== productId));
  };
  
  // Add to cart from wishlist
  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally remove from wishlist after adding to cart
    // handleRemove(product.id);
  };
  
  // Move all to cart
  const handleMoveAllToCart = () => {
    wishlistItems.forEach((item) => addToCart(item));
    navigate('/cart');
  };
  
  // Share wishlist
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My SARSAR Wishlist',
        text: 'Check out my favorite products on SARSAR',
        url: window.location.href
      });
    }
  };
  
  // Calculate price drops
  const getPriceDrop = (item) => {
    const drop = item.priceAtAdd - item.price;
    if (drop > 0) {
      const percentage = ((drop / item.priceAtAdd) * 100).toFixed(0);
      return { amount: drop, percentage };
    }
    return null;
  };
  
  // Group items by category
  const groupedItems = wishlistItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Heart className="w-8 h-8 text-orange-600 fill-orange-600" />
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="primary" onClick={handleMoveAllToCart}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Move All to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Price Drop Alert */}
        {wishlistItems.some((item) => getPriceDrop(item)) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-start gap-3">
                <div className="bg-green-500 text-white p-2 rounded-full">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1">
                    Price Drops Detected! 🎉
                  </h3>
                  <p className="text-sm text-green-700">
                    Some items in your wishlist are now cheaper. Check them out!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Wishlist Content */}
        {wishlistItems.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, items], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {category}
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({items.length})
                  </span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((item, index) => {
                    const priceDrop = getPriceDrop(item);
                    return (
                      <div key={item.id} className="relative">
                        {/* Price Drop Badge */}
                        {priceDrop && (
                          <div className="absolute top-2 left-2 z-10">
                            <Badge className="bg-green-500 text-white">
                              {priceDrop.percentage}% OFF
                            </Badge>
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Product Card */}
                        <ProductCard product={item} />

                        {/* Quick Add to Cart */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute bottom-2 left-2 right-2"
                        >
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <Card className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your Wishlist is Empty
              </h3>
              <p className="text-gray-600 mb-6">
                Start adding products you love to your wishlist
              </p>
              <Button variant="primary" onClick={() => navigate('/shop')}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Tips Section */}
        {wishlistItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Wishlist Tips
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• We'll notify you when prices drop on your wishlist items</li>
                    <li>• Items stay in your wishlist even after you add them to cart</li>
                    <li>• Share your wishlist with friends for gift ideas</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;