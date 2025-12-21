// File: src/pages/customer/Addresses.jsx
// Manage delivery addresses page

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
  Home,
  Briefcase,
  Star
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import AddressForm from '@/components/customer/AddressForm';

const Addresses = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([
    // Demo data - in production, fetch from Firestore
    {
      id: '1',
      label: 'Home',
      area: 'Traffic Chowk',
      street: 'Main Road',
      house: 'House No. 25',
      ward: 4,
      landmark: 'Near City Hospital',
      isDefault: true,
      icon: 'home'
    },
    {
      id: '2',
      label: 'Office',
      area: 'Golpark',
      street: 'Office Complex',
      house: 'Floor 3, Room 301',
      ward: 8,
      landmark: 'Opposite Bus Park',
      isDefault: false,
      icon: 'work'
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // Get icon based on label
  const getAddressIcon = (icon) => {
    const icons = {
      home: Home,
      work: Briefcase,
      other: MapPin
    };
    return icons[icon] || MapPin;
  };
  
  // Handle add address
  const handleAddAddress = (addressData) => {
    const newAddress = {
      id: Date.now().toString(),
      ...addressData,
      isDefault: addresses.length === 0 // First address is default
    };
    setAddresses([...addresses, newAddress]);
    setShowAddModal(false);
  };
  
  // Handle edit address
  const handleEditAddress = (addressData) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === editingAddress.id ? { ...addr, ...addressData } : addr
      )
    );
    setEditingAddress(null);
  };
  
  // Handle delete address
  const handleDeleteAddress = (addressId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this address?'
    );
    if (confirmed) {
      const address = addresses.find((a) => a.id === addressId);
      const newAddresses = addresses.filter((a) => a.id !== addressId);
      
      // If deleted address was default, make first address default
      if (address.isDefault && newAddresses.length > 0) {
        newAddresses[0].isDefault = true;
      }
      
      setAddresses(newAddresses);
    }
  };
  
  // Handle set as default
  const handleSetDefault = (addressId) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Addresses
              </h1>
              <p className="text-gray-600">
                Manage your delivery addresses
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Address
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Addresses Grid */}
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address, index) => {
              const Icon = getAddressIcon(address.icon);
              return (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`
                      relative hover:shadow-lg transition-all cursor-pointer
                      ${address.isDefault ? 'border-2 border-orange-500' : ''}
                    `}
                  >
                    {/* Default Badge */}
                    {address.isDefault && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Default
                        </div>
                      </div>
                    )}

                    {/* Address Content */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {address.label}
                        </h3>
                      </div>

                      <div className="space-y-1 text-sm text-gray-700">
                        <p className="font-medium">{address.area}</p>
                        <p>{address.street}</p>
                        {address.house && <p>{address.house}</p>}
                        <p>Ward {address.ward}, Butwal</p>
                        {address.landmark && (
                          <p className="text-gray-600 mt-2">
                            Near: {address.landmark}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingAddress(address)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
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
                <MapPin className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Addresses Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Add your first delivery address to get started
              </p>
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Address
              </Button>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Address"
      >
        <AddressForm
          onSubmit={handleAddAddress}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        isOpen={!!editingAddress}
        onClose={() => setEditingAddress(null)}
        title="Edit Address"
      >
        <AddressForm
          address={editingAddress}
          onSubmit={handleEditAddress}
          onCancel={() => setEditingAddress(null)}
        />
      </Modal>
    </div>
  );
};

export default Addresses;