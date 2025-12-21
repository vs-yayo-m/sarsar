// FILE PATH: src/pages/ProductDetail.jsx
// Product Detail Page - Full product information and purchase

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductGallery from '@/components/customer/ProductGallery';
import ProductGrid from '@/components/customer/ProductGrid';
import useProducts from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import Button from '@/components/ui/Button';
import RatingStars from '@/components/shared/RatingStars';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error, fetchProduct, fetchRelated } = useProducts();
  const { addToCart, isInCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch product on mount
  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  // Fetch related products when product loads
  useEffect(() => {
    if (product?.category) {
      fetchRelated(product.id, product.category).then(setRelatedProducts);
    }
  }, [product, fetchRelated]);

  // Handle quantity change
  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && (!product.stock || newQty <= product.stock)) {
      setQuantity(newQty);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  // Handle buy now
  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  // Handle wishlist toggle
  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/shop')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const price = product.discountPrice || product.price;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-2xl p-6 lg:p-10 shadow-sm mb-12">
          {/* Gallery */}
          <div>
            <ProductGallery
              images={product.images || [product.image]}
              productName={product.name}
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Category & Share */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
                {product.category}
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlist}
                  className={`p-2 rounded-full ${
                    isWishlisted
                      ? 'bg-red-100 text-red-500'
                      : 'bg-gray-100 text-gray-600'
                  } hover:scale-110 transition-all`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-2 bg-gray-100 text-gray-600 rounded-full hover:scale-110 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <RatingStars
                rating={product.rating}
                showCount
                count={product.reviewCount}
                size="lg"
              />
            )}

            {/* Price */}
            <div className="flex items-end gap-4">
              <div className="text-4xl font-black text-orange-600">
                Rs. {price.toFixed(2)}
              </div>
              {product.discountPrice && (
                <>
                  <div className="text-2xl text-gray-400 line-through">
                    Rs. {product.price.toFixed(2)}
                  </div>
                  <div className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold">
                    {discountPercent}% OFF
                  </div>
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
                      ? `Only ${product.stock} left!`
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

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-xl font-bold">−</span>
                    </button>
                    <div className="px-6 py-3 text-xl font-bold text-gray-900 min-w-[60px] text-center">
                      {quantity}
                    </div>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={product.stock && quantity >= product.stock}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isInCart(product.id)}
                size="lg"
                className="flex-1"
              >
                {isInCart(product.id) ? 'Already in Cart' : 'Add to Cart'}
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                size="lg"
                variant="secondary"
                className="flex-1"
              >
                Buy Now
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">🚚</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">1-Hour Delivery</div>
                  <div className="text-sm text-gray-600">
                    Order now and get it delivered within 1 hour!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-8">
              Related Products
            </h2>
            <ProductGrid products={relatedProducts.slice(0, 4)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;