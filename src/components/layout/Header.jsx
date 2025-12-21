import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, MapPin, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { ROUTES } from '@/config/routes';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, userProfile, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const cartItemCount = items?.length || 0;
  const wishlistCount = userProfile?.wishlist?.length || 0;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+9779821072912" className="flex items-center gap-2 hover:text-orange-100 transition-colors">
                <Phone className="w-4 h-4" />
                <span>+977 9821072912</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Delivery in Butwal (All 19 Wards)</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to={ROUTES.HOW_IT_WORKS} className="hover:text-orange-100 transition-colors">
                How It Works
              </Link>
              <Link to={ROUTES.CONTACT} className="hover:text-orange-100 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`
          sticky top-0 z-40 bg-white transition-all duration-300
          ${isScrolled ? 'shadow-md' : 'border-b border-gray-200'}
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-xl md:text-2xl">S</span>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                  SARSAR
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Quick Commerce</p>
              </div>
            </Link>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-1.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors font-medium"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Wishlist */}
              {user && (
                <Link to={ROUTES.WISHLIST}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 hover:bg-orange-50 rounded-lg transition-colors hidden md:block"
                  >
                    <Heart className="w-6 h-6 text-gray-700" />
                    {wishlistCount > 0 && (
                      <Badge variant="solid" color="error" className="absolute -top-1 -right-1">
                        {wishlistCount}
                      </Badge>
                    )}
                  </motion.button>
                </Link>
              )}

              {/* Cart */}
              <Link to={ROUTES.CART}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  {cartItemCount > 0 && (
                    <Badge variant="solid" color="primary" className="absolute -top-1 -right-1">
                      {cartItemCount}
                    </Badge>
                  )}
                </motion.button>
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative group hidden md:block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {userProfile?.name?.charAt(0) || 'U'}
                    </div>
                  </motion.button>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{userProfile?.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to={ROUTES[`${userProfile?.role?.toUpperCase()}_ROUTES`]?.DASHBOARD || ROUTES.CUSTOMER_DASHBOARD}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-orange-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-orange-50 transition-colors text-left text-red-600"
                      >
                        <X className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to={ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to={ROUTES.REGISTER}>
                    <Button variant="primary" size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar (Mobile) */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="hidden md:block border-t border-gray-200 bg-gray-50">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-center gap-8 h-12">
              <Link to={ROUTES.SHOP} className="text-gray-700 hover:text-primary font-medium transition-colors">
                All Products
              </Link>
              <Link to={ROUTES.CATEGORY.replace(':category', 'groceries')} className="text-gray-700 hover:text-primary font-medium transition-colors">
                Groceries
              </Link>
              <Link to={ROUTES.CATEGORY.replace(':category', 'vegetables')} className="text-gray-700 hover:text-primary font-medium transition-colors">
                Vegetables
              </Link>
              <Link to={ROUTES.CATEGORY.replace(':category', 'fruits')} className="text-gray-700 hover:text-primary font-medium transition-colors">
                Fruits
              </Link>
              <Link to={ROUTES.CATEGORY.replace(':category', 'dairy')} className="text-gray-700 hover:text-primary font-medium transition-colors">
                Dairy
              </Link>
              <Link to={ROUTES.ABOUT} className="text-gray-700 hover:text-primary font-medium transition-colors">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {user && (
                <div className="p-4 border-b border-gray-200 bg-orange-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                      {userProfile?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold">{userProfile?.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="py-2">
                <Link to={ROUTES.SHOP} className="flex items-center px-4 py-3 hover:bg-orange-50 transition-colors">
                  All Products
                </Link>
                <Link to={ROUTES.CATEGORY.replace(':category', 'groceries')} className="flex items-center px-4 py-3 hover:bg-orange-50 transition-colors">
                  Groceries
                </Link>
                <Link to={ROUTES.CATEGORY.replace(':category', 'vegetables')} className="flex items-center px-4 py-3 hover:bg-orange-50 transition-colors">
                  Vegetables
                </Link>
                <Link to={ROUTES.CATEGORY.replace(':category', 'fruits')} className="flex items-center px-4 py-3 hover:bg-orange-50 transition-colors">
                  Fruits
                </Link>
                <Link to={ROUTES.CATEGORY.replace(':category', 'dairy')} className="flex items-center px-4 py-3 hover:bg-orange-50 transition-colors">
                  Dairy
                </Link>
                <Link to={ROUTES.ABOUT} className="flex items-center px-4 py-3 hover:bg-orange-50 transition-colors">
                  About
                </Link>
                <Link to={ROUTES.CONTACT} className="flex items-center px-4 py-3 hover:bg-orange-50 transition-colors">
                  Contact
                </Link>
              </nav>

              <div className="p-4 border-t border-gray-200">
                {user ? (
                  <>
                    <Link to={ROUTES[`${userProfile?.role?.toUpperCase()}_ROUTES`]?.DASHBOARD || ROUTES.CUSTOMER_DASHBOARD}>
                      <Button variant="primary" fullWidth className="mb-2">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" fullWidth onClick={handleLogout} className="text-red-600 border-red-600">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to={ROUTES.LOGIN}>
                      <Button variant="outline" fullWidth className="mb-2">
                        Login
                      </Button>
                    </Link>
                    <Link to={ROUTES.REGISTER}>
                      <Button variant="primary" fullWidth>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;