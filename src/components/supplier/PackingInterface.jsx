// FILE PATH: src/components/supplier/PackingInterface.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Printer, Box, Truck, AlertTriangle } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatters';
import toast from 'react-hot-toast';

const PackingInterface = ({ order, onComplete }) => {
  const [checklist, setChecklist] = useState({
    itemsVerified: false,
    qualityChecked: false,
    invoiceIncluded: false,
    packageSealed: false
  });
  const [packingNotes, setPackingNotes] = useState('');

  // Toggle checklist item
  const toggleChecklistItem = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Check if all items checked
  const allChecked = Object.values(checklist).every(Boolean);

  // Handle mark ready for delivery
  const handleMarkReady = async () => {
    if (!allChecked) {
      toast.error('Please complete all packing steps');
      return;
    }

    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'ready',
        packingCompletedAt: new Date(),
        packingNotes: packingNotes || null
      });

      toast.success('Order ready for delivery!');
      onComplete();
    } catch (error) {
      console.error('Error marking order ready:', error);
      toast.error('Failed to mark order as ready');
    }
  };

  // Print packing slip
  const handlePrintPackingSlip = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Packing Slip - ${order.orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Courier New', monospace; padding: 20px; font-size: 12px; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .header h1 { font-size: 18px; margin-bottom: 5px; }
            .section { margin-bottom: 15px; }
            .section h2 { font-size: 14px; margin-bottom: 5px; border-bottom: 1px solid #000; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
            .items-table th, .items-table td { border: 1px solid #000; padding: 5px; text-align: left; }
            .items-table th { background-color: #f0f0f0; font-weight: bold; }
            .total { text-align: right; font-size: 14px; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 2px solid #000; }
            .footer { margin-top: 20px; padding-top: 10px; border-top: 2px dashed #000; text-align: center; font-size: 10px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SARSAR</h1>
            <p>Packing Slip</p>
          </div>

          <div class="section">
            <h2>Order Information</h2>
            <div class="info-row">
              <span>Order ID:</span>
              <span>${order.orderId}</span>
            </div>
            <div class="info-row">
              <span>Date:</span>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div class="section">
            <h2>Customer Details</h2>
            <div class="info-row">
              <span>Name:</span>
              <span>${order.customerName}</span>
            </div>
            <div class="info-row">
              <span>Phone:</span>
              <span>${order.customerPhone}</span>
            </div>
            <div class="info-row">
              <span>Address:</span>
              <span>${order.deliveryAddress?.street}, ${order.deliveryAddress?.area}</span>
            </div>
            ${order.deliveryAddress?.landmark ? `
            <div class="info-row">
              <span>Landmark:</span>
              <span>${order.deliveryAddress.landmark}</span>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <h2>Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items?.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>Rs. ${item.price}</td>
                    <td>Rs. ${item.price * item.quantity}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              <div>Subtotal: Rs. ${order.subtotal || order.total}</div>
              ${order.deliveryFee ? `<div>Delivery: Rs. ${order.deliveryFee}</div>` : ''}
              <div>TOTAL: Rs. ${order.total}</div>
            </div>
          </div>

          ${order.notes ? `
          <div class="section">
            <h2>Customer Notes</h2>
            <p>${order.notes}</p>
          </div>
          ` : ''}

          ${packingNotes ? `
          <div class="section">
            <h2>Packing Notes</h2>
            <p>${packingNotes}</p>
          </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for choosing SARSAR!</p>
            <p>For support: +977 9821072912 | support@sarsar.com.np</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Pack Order #{order.orderId?.slice(-6)}
            </h2>
            <p className="text-blue-100 text-sm">
              {order.items?.length} items • {formatPrice(order.total)}
            </p>
          </div>
          <Box className="w-12 h-12 opacity-50" />
        </div>
      </div>

      {/* Items Summary */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-500" />
          Items to Pack
        </h3>
        <div className="space-y-2">
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Packing Checklist */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Packing Checklist
        </h3>

        <div className="space-y-3">
          <ChecklistItem
            checked={checklist.itemsVerified}
            onToggle={() => toggleChecklistItem('itemsVerified')}
            label="All items verified and counted"
            description="Double-check quantities match the order"
          />
          <ChecklistItem
            checked={checklist.qualityChecked}
            onToggle={() => toggleChecklistItem('qualityChecked')}
            label="Quality checked (no damage)"
            description="Ensure products are in good condition"
          />
          <ChecklistItem
            checked={checklist.invoiceIncluded}
            onToggle={() => toggleChecklistItem('invoiceIncluded')}
            label="Invoice/Receipt included"
            description="Place packing slip in the package"
          />
          <ChecklistItem
            checked={checklist.packageSealed}
            onToggle={() => toggleChecklistItem('packageSealed')}
            label="Package sealed properly"
            description="Ensure secure packaging for delivery"
          />
        </div>

        {/* Progress */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Completion: {Object.values(checklist).filter(Boolean).length}/4
            </span>
            <span className="text-sm font-bold text-blue-600">
              {Math.round((Object.values(checklist).filter(Boolean).length / 4) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(Object.values(checklist).filter(Boolean).length / 4) * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Packing Notes */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
        <label className="block font-semibold text-gray-900 mb-2">
          Packing Notes (Optional)
        </label>
        <textarea
          value={packingNotes}
          onChange={(e) => setPackingNotes(e.target.value)}
          placeholder="Add any special notes about packaging, substitutions, or handling..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Warning if not all checked */}
      {!allChecked && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-900 mb-1">
                Complete all checklist items
              </p>
              <p className="text-sm text-yellow-700">
                Make sure all packing steps are completed before marking the order as ready for delivery.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={handlePrintPackingSlip}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Printer className="w-5 h-5" />
          Print Packing Slip
        </Button>
        <Button
          onClick={handleMarkReady}
          disabled={!allChecked}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Truck className="w-5 h-5" />
          Mark Ready for Delivery
        </Button>
      </div>
    </div>
  );
};

// Checklist Item Component
const ChecklistItem = ({ checked, onToggle, label, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onToggle}
      className={`
        flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all
        ${checked
          ? 'bg-green-50 border-2 border-green-500'
          : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
        }
      `}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
          ${checked
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-blue-500'
          }
        `}
      >
        {checked && <CheckCircle className="w-5 h-5 text-white" />}
      </button>

      <div className="flex-1">
        <p className={`font-semibold mb-1 ${checked ? 'text-green-900' : 'text-gray-900'}`}>
          {label}
        </p>
        <p className={`text-sm ${checked ? 'text-green-700' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default PackingInterface;