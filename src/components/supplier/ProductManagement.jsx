// FILE PATH: src/components/supplier/ProductManagement.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ProductForm from './ProductForm';
import { formatPrice } from '@/utils/formatters';
import toast from 'react-hot-toast';

const ProductManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive', 'low-stock'
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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
        productsData.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Filter products
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
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => {
        if (filterStatus === 'active') return p.active;
        if (filterStatus === 'inactive') return !p.active;
        if (filterStatus === 'low-stock') return p.stock < 10;
        return true;
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, filterStatus]);

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteDoc(doc(db, 'products', productToDelete.id));
      toast.success('Product deleted successfully!');
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Handle duplicate product
  const handleDuplicateProduct = (product) => {
    const duplicated = {
      ...product,
      name: `${product.name} (Copy)`,
      id: undefined // Will get new ID
    };
    setEditingProduct(duplicated);
    setShowProductForm(true);
  };

  // Handle toggle active status
  const handleToggleActive = async (product) => {
    try {
      await updateDoc(doc(db, 'products', product.id), {
        active: !product.active
      });
      toast.success(`Product ${!product.active ? 'activated' : 'deactivated'}!`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first');
      return;
    }

    try {
      if (action === 'delete') {
        await Promise.all(
          selectedProducts.map(id => deleteDoc(doc(db, 'products', id)))
        );
        toast.success(`${selectedProducts.length} products deleted!`);
      } else if (action === 'activate' || action === 'deactivate') {
        await Promise.all(
          selectedProducts.map(id => 
            updateDoc(doc(db, 'products', id), { active: action === 'activate' })
          )
        );
        toast.success(`${selectedProducts.length} products ${action}d!`);
      }
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform action');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Product Management
        </h1>
        <p className="text-gray-600">
          Manage your product catalog ({filteredProducts.length} products)
        </p>
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

          {/* Filters and Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="all">All Products</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="low-stock">Low Stock</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{selectedProducts.length} selected</span>
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            )}

            {/* Add Product Button */}
            <Button
              onClick={() => {
                setEditingProduct(null);
                setShowProductForm(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Archive className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first product'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button onClick={() => setShowProductForm(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add First Product
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selected={selectedProducts.includes(product.id)}
              onSelect={() => {
                setSelectedProducts(prev =>
                  prev.includes(product.id)
                    ? prev.filter(id => id !== product.id)
                    : [...prev, product.id]
                );
              }}
              onEdit={() => {
                setEditingProduct(product);
                setShowProductForm(true);
              }}
              onDelete={() => {
                setProductToDelete(product);
                setShowDeleteModal(true);
              }}
              onDuplicate={() => handleDuplicateProduct(product)}
              onToggleActive={() => handleToggleActive(product)}
            />
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(filteredProducts.map(p => p.id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  selected={selectedProducts.includes(product.id)}
                  onSelect={() => {
                    setSelectedProducts(prev =>
                      prev.includes(product.id)
                        ? prev.filter(id => id !== product.id)
                        : [...prev, product.id]
                    );
                  }}
                  onEdit={() => {
                    setEditingProduct(product);
                    setShowProductForm(true);
                  }}
                  onDelete={() => {
                    setProductToDelete(product);
                    setShowDeleteModal(true);
                  }}
                  onToggleActive={() => handleToggleActive(product)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Form Modal */}
      <Modal
        isOpen={showProductForm}
        onClose={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="large"
      >
        <ProductForm
          product={editingProduct}
          onSuccess={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Product"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Are you sure?
          </h3>
          <p className="text-gray-600 mb-6">
            This will permanently delete "{productToDelete?.name}". This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteProduct}
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Product Card Component (Grid View)
const ProductCard = ({ product, selected, onSelect, onEdit, onDelete, onDuplicate, onToggleActive }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative"
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="w-5 h-5 rounded border-gray-300"
        />
      </div>

      {/* More Menu */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50"
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
            <button onClick={() => { onEdit(); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button onClick={() => { onDuplicate(); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
              <Copy className="w-4 h-4" /> Duplicate
            </button>
            <button onClick={() => { onToggleActive(); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
              <Eye className="w-4 h-4" /> {product.active ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => { onDelete(); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-gray-100 relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Archive className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {product.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Stock Badge */}
        {product.stock < 10 && (
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
              Low Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-orange-600">{formatPrice(product.price)}</p>
            {product.discountPrice && (
              <p className="text-sm text-gray-500 line-through">{formatPrice(product.discountPrice)}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Stock</p>
            <p className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
              {product.stock}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Product Row Component (List View)
const ProductRow = ({ product, selected, onSelect, onEdit, onDelete, onToggleActive }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="rounded border-gray-300"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Archive className="w-6 h-6 text-gray-300" />
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-600">{product.sku || 'No SKU'}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{product.category}</td>
      <td className="px-4 py-3">
        <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
        {product.discountPrice && (
          <p className="text-sm text-gray-500 line-through">{formatPrice(product.discountPrice)}</p>
        )}
      </td>
      <td className="px-4 py-3">
        <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
          {product.stock}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {product.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button onClick={onEdit} className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={onToggleActive} className="p-2 hover:bg-gray-100 rounded-lg" title={product.active ? 'Deactivate' : 'Activate'}>
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={onDelete} className="p-2 hover:bg-red-50 rounded-lg" title="Delete">
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductManagement;