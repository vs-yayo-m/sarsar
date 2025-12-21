// FILE PATH: src/pages/Home.jsx
// Home Page - Landing page with hero, categories, featured products

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CategoryGrid from '@/components/customer/CategoryGrid';
import ProductGrid from '@/components/customer/ProductGrid';
import useProducts from '@/hooks/useProducts';
import Button from '@/components/ui/Button';

const Home = () => {
  const navigate = useNavigate();
  const { products, loading, fetchFeatured } = useProducts();
  
  // Fetch featured products on mount
  useEffect(() => {
    fetchFeatured(8);
  }, [fetchFeatured]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold">Now delivering in Butwal</span>
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Everything You Need,
                <span className="block text-yellow-300">Delivered in 1 Hour</span>
              </h1>

              <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                Fresh groceries, daily essentials, and more - delivered to your doorstep faster than ever. Welcome to SARSAR!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/shop')}
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-100 shadow-xl"
                >
                  Start Shopping
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={() => navigate('/how-it-works')}
                  size="lg"
                  variant="secondary"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                >
                  How It Works
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">1 Hour</div>
                  <div className="text-sm text-orange-100">Fast Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">1000+</div>
                  <div className="text-sm text-orange-100">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">4.8★</div>
                  <div className="text-sm text-orange-100">Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10">
                <img
                  src="/hero-shopping.png"
                  alt="Shopping illustration"
                  className="w-full h-auto drop-shadow-2xl"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop';
                  }}
                />
              </div>
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 right-10 w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full"
              />
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-20 left-10 w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1-Hour Delivery</h3>
              <p className="text-gray-600 text-sm">Lightning-fast delivery to your doorstep</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">100% Secure</h3>
              <p className="text-gray-600 text-sm">Safe and secure payment options</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Always here to help you</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Best Quality</h3>
              <p className="text-gray-600 text-sm">Fresh and verified products</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need in one place
            </p>
          </motion.div>

          <CategoryGrid layout="grid" />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">
                Handpicked just for you
              </p>
            </div>
            <Button
              onClick={() => navigate('/shop')}
              variant="secondary"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          <ProductGrid products={products} loading={loading} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Ready to experience the fastest delivery?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of happy customers in Butwal
            </p>
            <Button
              onClick={() => navigate('/shop')}
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 shadow-2xl"
            >
              Start Shopping Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;