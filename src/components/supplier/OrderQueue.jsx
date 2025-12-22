// FILE PATH: src/components/supplier/OrderQueue.jsx

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Truck,
  Filter,
  Search,
  Bell,
  Printer,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import OrderCard from './OrderCard';
import PickingList from './PickingList';
import PackingInterface from './PackingInterface';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const OrderQueue = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, picking, packing, ready
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPickingModal, setShowPickingModal] = useState(false);
  const [showPackingModal, setShowPackingModal] = useState(false);
  const audioRef = useRef(null);

  // Fetch orders
  useEffect(() => {
    if (!user) return;

    const ordersQuery = query(
      collection(db, 'orders'),
      where('items', 'array-contains', { supplierId: user.uid }),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = [];
      let hasNewOrder = false;

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const order = { id: change.doc.id, ...change.doc.data() };
          if (order.status === 'placed') {
            hasNewOrder = true;
          }
        }
      });

      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });

      setOrders(ordersData);
      setLoading(false);

      // Play sound for new order
      if (hasNewOrder && audioRef.current) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (!order.orderId?.toLowerCase().includes(search) &&
          !order.customerName?.toLowerCase().includes(search)) {
        return false;
      }
    }

    // Status filter
    if (filter !== 'all') {
      if (filter === 'new' && order.status !== 'placed') return false;
      if (filter === 'picking' && order.status !== 'picking') return false;
      if (filter === 'packing' && order.status !== 'packing') return false;
      if (filter === 'ready' && order.status !== 'ready') return false;
    }

    return true;
  });

  // Group orders by status for Kanban view
  const groupedOrders = {
    new: filteredOrders.filter(o => o.status === 'placed'),
    confirmed: filteredOrders.filter(o => o.status === 'confirmed'),
    picking: filteredOrders.filter(o => o.status === 'picking'),
    packing: filteredOrders.filter(o => o.status === 'packing'),
    ready: filteredOrders.filter(o => o.status === 'ready'),
    delivered: filteredOrders.filter(o => o.status === 'delivered')
  };

  // Handle accept order
  const handleAcceptOrder = async (order) => {
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'confirmed',
        confirmedAt: new Date()
      });
      toast.success('Order accepted!');
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order');
    }
  };

  // Handle reject order
  const handleRejectOrder = async (order) => {
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelReason: 'Rejected by supplier'
      });
      toast.success('Order rejected');
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast.error('Failed to reject order');
    }
  };

  // Handle start picking
  const handleStartPicking = (order) => {
    setSelectedOrder(order);
    setShowPickingModal(true);
  };

  // Handle start packing
  const handleStartPacking = (order) => {
    setSelectedOrder(order);
    setShowPackingModal(true);
  };

  // Print packing slip
  const handlePrintPackingSlip = (order) => {
    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Packing Slip - ${order.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 24px; margin-bottom: 20px; }
            .order-info { margin-bottom: 20px; }
            .items { width: 100%; border-collapse: collapse; }
            .items th, .items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items th { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>Packing Slip</h1>
          <div class="order-info">
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Phone:</strong> ${order.customerPhone}</p>
            <p><strong>Address:</strong> ${order.deliveryAddress?.street}, ${order.deliveryAddress?.area}</p>
          </div>
          <table class="items">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>Rs. ${item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p style="margin-top: 20px;"><strong>Total:</strong> Rs. ${order.total}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Audio for new order notification */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Order Queue
        </h1>
        <p className="text-gray-600">
          Manage and fulfill customer orders ({filteredOrders.length} orders)
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
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'new'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              New ({groupedOrders.new.length})
            </button>
            <button
              onClick={() => setFilter('picking')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'picking'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Picking ({groupedOrders.picking.length})
            </button>
            <button
              onClick={() => setFilter('packing')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'packing'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Packing ({groupedOrders.packing.length})
            </button>
            <button
              onClick={() => setFilter('ready')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'ready'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ready ({groupedOrders.ready.length})
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {searchTerm || filter !== 'all'
              ? 'Try adjusting your filters'
              : 'New orders will appear here'
            }
          </p>
        </div>
      ) : (
        // Kanban Board View
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* New Orders Column */}
          <KanbanColumn
            title="New Orders"
            icon={Bell}
            color="red"
            orders={groupedOrders.new}
            onAccept={handleAcceptOrder}
            onReject={handleRejectOrder}
          />

          {/* Confirmed Column */}
          <KanbanColumn
            title="Confirmed"
            icon={CheckCircle}
            color="green"
            orders={groupedOrders.confirmed}
            onStartPicking={handleStartPicking}
          />

          {/* Picking Column */}
          <KanbanColumn
            title="Picking"
            icon={Package}
            color="orange"
            orders={groupedOrders.picking}
            onViewPicking={handleStartPicking}
          />

          {/* Packing Column */}
          <KanbanColumn
            title="Packing"
            icon={Package}
            color="blue"
            orders={groupedOrders.packing}
            onStartPacking={handleStartPacking}
          />

          {/* Ready Column */}
          <KanbanColumn
            title="Ready"
            icon={Truck}
            color="purple"
            orders={groupedOrders.ready}
            onPrint={handlePrintPackingSlip}
          />

          {/* Delivered Column */}
          <KanbanColumn
            title="Delivered"
            icon={CheckCircle}
            color="gray"
            orders={groupedOrders.delivered}
          />
        </div>
      )}

      {/* Picking Modal */}
      <Modal
        isOpen={showPickingModal}
        onClose={() => {
          setShowPickingModal(false);
          setSelectedOrder(null);
        }}
        title="Pick Items"
        size="large"
      >
        {selectedOrder && (
          <PickingList
            order={selectedOrder}
            onComplete={() => {
              setShowPickingModal(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </Modal>

      {/* Packing Modal */}
      <Modal
        isOpen={showPackingModal}
        onClose={() => {
          setShowPackingModal(false);
          setSelectedOrder(null);
        }}
        title="Pack Order"
        size="large"
      >
        {selectedOrder && (
          <PackingInterface
            order={selectedOrder}
            onComplete={() => {
              setShowPackingModal(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

// Kanban Column Component
const KanbanColumn = ({ title, icon: Icon, color, orders, onAccept, onReject, onStartPicking, onViewPicking, onStartPacking, onPrint }) => {
  const colorClasses = {
    red: 'bg-red-50 text-red-700 border-red-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      {/* Column Header */}
      <div className={`flex items-center justify-between mb-4 p-3 rounded-xl border-2 ${colorClasses[color]}`}>
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <h3 className="font-bold text-sm">{title}</h3>
        </div>
        <span className="text-sm font-bold">{orders.length}</span>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <OrderCard
                order={order}
                onAccept={onAccept}
                onReject={onReject}
                onStartPicking={onStartPicking}
                onViewPicking={onViewPicking}
                onStartPacking={onStartPacking}
                onPrint={onPrint}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No orders
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderQueue;