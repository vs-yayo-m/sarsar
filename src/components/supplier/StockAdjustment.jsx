// FILE PATH: src/components/supplier/StockAdjustment.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, RotateCcw, Package } from 'lucide-react';
import { updateDoc, doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatters';
import toast from 'react-hot-toast';

const StockAdjustment = ({ product, onSuccess }) => {
  const [adjustmentType, setAdjustmentType] = useState('set'); // set, add, remove
  const [quantity, setQuantity] = useState(product.stock);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdjustment = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for adjustment');
      return;
    }

    if (quantity < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    setSubmitting(true);

    try {
      let newStock = quantity;
      let change = 0;

      if (adjustmentType === 'add') {
        newStock = product.stock + quantity;
        change = quantity;
      } else if (adjustmentType === 'remove') {
        newStock = Math.max(0, product.stock - quantity);
        change = -(Math.min(quantity, product.stock));
      } else {
        change = quantity - product.stock;
      }

      // Update product stock
      await updateDoc(doc(db, 'products', product.id), {
        stock: newStock,
        updatedAt: serverTimestamp()
      });

      // Log adjustment history
      await addDoc(collection(db, 'stockAdjustments'), {
        productId: product.id,
        productName: product.name,
        supplierId: product.supplierId,
        previousStock: product.stock,
        newStock: newStock,
        change: change,
        type: adjustmentType,
        reason: reason,
        createdAt: serverTimestamp()
      });

      toast.success(`Stock updated to ${newStock}`);
      onSuccess();
    } catch (error) {
      console.error('Error adjusting stock:', error);
      toast.error('Failed to adjust stock');
    } finally {
      setSubmitting(false);
    }
  };

  const getResultingStock = () => {
    if (adjustmentType === 'set') return quantity;
    if (adjustmentType === 'add') return product.stock + quantity;
    if (adjustmentType === 'remove') return Math.max(0, product.stock - quantity);
    return product.stock;
  };

  const resultingStock = getResultingStock();

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Current Stock: <strong className="text-gray-900">{product.stock}</strong></span>
              <span>Price: <strong className="text-orange-600">{formatPrice(product.price)}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Adjustment Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Adjustment Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          <AdjustmentTypeButton
            type="set"
            label="Set To"
            icon={RotateCcw}
            selected={adjustmentType === 'set'}
            onClick={() => {
              setAdjustmentType('set');
              setQuantity(product.stock);
            }}
          />
          <AdjustmentTypeButton
            type="add"
            label="Add"
            icon={Plus}
            selected={adjustmentType === 'add'}
            onClick={() => {
              setAdjustmentType('add');
              setQuantity(0);
            }}
          />
          <AdjustmentTypeButton
            type="remove"
            label="Remove"
            icon={Minus}
            selected={adjustmentType === 'remove'}
            onClick={() => {
              setAdjustmentType('remove');
              setQuantity(0);
            }}
          />
        </div>
      </div>

      {/* Quantity Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {adjustmentType === 'set' ? 'New Stock Level' : 'Quantity'}
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-2xl font-bold text-center"
            placeholder="0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-orange-700 font-semibold mb-1">Current Stock</p>
            <p className="text-3xl font-bold text-orange-900">{product.stock}</p>
          </div>
          <div className="text-4xl font-bold text-orange-500">→</div>
          <div>
            <p className="text-sm text-orange-700 font-semibold mb-1">New Stock</p>
            <p className="text-3xl font-bold text-orange-900">{resultingStock}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-orange-700">
            Change: <strong className={resultingStock > product.stock ? 'text-green-700' : 'text-red-700'}>
              {resultingStock > product.stock ? '+' : ''}{resultingStock - product.stock}
            </strong>
          </span>
          <span className="text-orange-700">
            Value Change: <strong>{formatPrice((resultingStock - product.stock) * product.price)}</strong>
          </span>
        </div>
      </motion.div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Reason for Adjustment *
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
        >
          <option value="">Select a reason...</option>
          <option value="New Stock Received">New Stock Received</option>
          <option value="Inventory Count">Inventory Count</option>
          <option value="Damaged Items">Damaged Items</option>
          <option value="Expired Items">Expired Items</option>
          <option value="Returned Items">Returned Items</option>
          <option value="Theft/Loss">Theft/Loss</option>
          <option value="Sale Not Recorded">Sale Not Recorded</option>
          <option value="Initial Stock">Initial Stock</option>
          <option value="Other">Other</option>
        </select>
        {reason === 'Other' && (
          <textarea
            placeholder="Please specify the reason..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
          />
        )}
      </div>

      {/* Quick Presets */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Quick Adjustments</p>
        <div className="flex flex-wrap gap-2">
          {[10, 25, 50, 100].map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                if (adjustmentType === 'set') {
                  setQuantity(preset);
                } else {
                  setQuantity(preset);
                }
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
            >
              {adjustmentType === 'set' ? `Set to ${preset}` : preset}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={onSuccess}
          disabled={submitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdjustment}
          disabled={submitting || !reason || quantity === product.stock}
          loading={submitting}
          className="flex-1"
        >
          Update Stock
        </Button>
      </div>
    </div>
  );
};

// Adjustment Type Button
const AdjustmentTypeButton = ({ type, label, icon: Icon, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
        ${selected
          ? 'border-orange-500 bg-orange-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center
        ${selected ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}
      `}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`text-sm font-semibold ${selected ? 'text-orange-900' : 'text-gray-700'}`}>
        {label}
      </span>
    </button>
  );
};

export default StockAdjustment;