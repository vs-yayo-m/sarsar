// FILE PATH: src/components/supplier/InventoryTable.jsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Package,
  Plus,
  Minus,
  Download,
  Upload,
  Edit
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import StockAdjustment from './StockAdjustment';
import { formatPrice } from '@/utils/formatters';
import toast from 'react-hot-toast';

const InventoryTable = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // name, stock, value

  // Fetch products
  useEffect(() => {
    if (!user) return;

    const productsQuery = query(
      collection(db, 'products'),
      where('supplierId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
      const productsData = [];
      snapshot.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() };
        productsData.push(product);
      });
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === 'low-stock') {
      filtered = filtered.filter(p => p.stock > 0 && p.stock < 10);
    } else if (filterStatus === 'out-of-stock') {
      filtered = filtered.filter(p => p.stock === 0);
    } else if (filterStatus === 'in-stock') {
      filtered = filtered.filter(p => p.stock >= 10);
    }

    // Sort
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'stock') {
      filtered.sort((a, b) => a.stock - b.stock);
    } else if (sortBy === 'value') {
      filtered.sort((a, b) => (b.stock * b.price) - (a.stock * a.price));
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, filterStatus, sortBy]);

  // Calculate totals
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);

  // Quick stock adjustment
  const handleQuickAdjust = async (product, change) => {
    const newStock = Math.max(0, product.stock + change);
    try {
      await updateDoc(doc(db, 'products', product.id), {
        stock: newStock,
        updatedAt: new Date()
      });
      toast.success(`Stock updated to ${newStock}`);
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Product Name', 'SKU', 'Category', 'Stock', 'Price', 'Total Value', 'Status'];
    const rows = filteredProducts.map(p => [
      p.name,
      p.sku || 'N/A',
      p.category,
      p.stock,
      p.price,
      p.stock * p.price,
      p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'In Stock'
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Inventory exported!');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Inventory Management
        </h1>
        <p className="text-gray-600">
          Track and manage your product stock levels
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Low Stock"
          value={lowStockCount}
          icon={AlertTriangle}
          color="orange"
          alert={lowStockCount > 0}
        />
        <StatsCard
          title="Out of Stock"
          value={outOfStockCount}
          icon={TrendingDown}
          color="red"
          alert={outOfStockCount > 0}
        />
        <StatsCard
          title="Total Value"
          value={formatPrice(totalValue)}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="all">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="stock">Sort by Stock</option>
              <option value="value">Sort by Value</option>
            </select>

            <Button
              variant="secondary"
              onClick={handleExportCSV}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Add products to start tracking inventory'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Stock</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Value</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <InventoryRow
                    key={product.id}
                    product={product}
                    onQuickAdjust={handleQuickAdjust}
                    onAdjust={() => {
                      setSelectedProduct(product);
                      setShowAdjustModal(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={showAdjustModal}
        onClose={() => {
          setShowAdjustModal(false);
          setSelectedProduct(null);
        }}
        title="Adjust Stock"
      >
        {selectedProduct && (
          <StockAdjustment
            product={selectedProduct}
            onSuccess={() => {
              setShowAdjustModal(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, alert }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all ${
        alert ? 'border-orange-300' : 'border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {alert && (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
            Alert
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </motion.div>
  );
};

// Inventory Row Component
const InventoryRow = ({ product, onQuickAdjust, onAdjust }) => {
  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (product.stock < 10) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-700' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  const status = getStockStatus();

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hover:bg-gray-50"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-300" />
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500">{product.sku || 'No SKU'}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">{product.category}</td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onQuickAdjust(product, -1)}
            disabled={product.stock === 0}
            className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className={`font-bold text-lg min-w-[3ch] text-center ${
            product.stock === 0 ? 'text-red-600' :
            product.stock < 10 ? 'text-orange-600' :
            'text-gray-900'
          }`}>
            {product.stock}
          </span>
          <button
            onClick={() => onQuickAdjust(product, 1)}
            className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </td>
      <td className="px-6 py-4 text-right font-semibold text-gray-900">
        {formatPrice(product.price)}
      </td>
      <td className="px-6 py-4 text-right font-bold text-orange-600">
        {formatPrice(product.stock * product.price)}
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
          {status.label}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={onAdjust}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Adjust Stock"
        >
          <Edit className="w-4 h-4 text-gray-600" />
        </button>
      </td>
    </motion.tr>
  );
};

export default InventoryTable;