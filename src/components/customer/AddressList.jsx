// FILE PATH: src/components/customer/AddressList.jsx
// Address List Component - Display and manage delivery addresses

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Edit, Trash2, Plus, Check, Home, Briefcase } from 'lucide-react';
import AddressForm from './AddressForm';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const AddressList = ({ onSelectAddress, selectedAddressId, showActions = true }) => {
  // Mock addresses - replace with real data from Firebase/API
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      label: 'Home',
      ward: 4,
      area: 'Traffic Chowk',
      street: 'Main Road',
      house: '25',
      landmark: 'Near School',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Work',
      ward: 7,
      area: 'Golpark',
      street: 'Siddhartha Highway',
      house: 'Building A, Floor 2',
      landmark: 'Opposite Bank',
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedId, setSelectedId] = useState(selectedAddressId);

  // Handle select address
  const handleSelectAddress = (address) => {
    setSelectedId(address.id);
    if (onSelectAddress) {
      onSelectAddress(address);
    }
  };

  // Handle save address (add or update)
  const handleSaveAddress = (addressData) => {
    if (editingAddress) {
      // Update existing
      setAddresses(prev =>
        prev.map(addr => (addr.id === addressData.id ? addressData : addr))
      );
    } else {
      // Add new
      setAddresses(prev => [...prev, addressData]);
    }
    setShowAddForm(false);
    setEditingAddress(null);
  };

  // Handle delete address
  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      toast.success('Address deleted');
    }
  };

  // Handle edit address
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  // Get icon based on label
  const getIcon = (label) => {
    switch (label.toLowerCase()) {
      case 'home':
        return Home;
      case 'work':
        return Briefcase;
      default:
        return MapPin;
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Address Button */}
      {!showAddForm && (
        <Button
          onClick={() => {
            setShowAddForm(true);
            setEditingAddress(null);
          }}
          variant="secondary"
          className="w-full"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Address
        </Button>
      )}

      {/* Address Form */}
      <AnimatePresence>
        {showAddForm && (
          <AddressForm
            address={editingAddress}
            onSave={handleSaveAddress}
            onCancel={() => {
              setShowAddForm(false);
              setEditingAddress(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Address List */}
      {!showAddForm && addresses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No addresses saved
          </h3>
          <p className="text-gray-600 mb-6">
            Add your first delivery address to continue
          </p>
        </div>
      )}

      {!showAddForm && addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address, index) => {
            const Icon = getIcon(address.label);
            const isSelected = selectedId === address.id;

            return (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectAddress(address)}
                className={`
                  relative p-5 rounded-xl border-2 cursor-pointer
                  transition-all duration-200
                  ${isSelected
                    ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                  }
                `}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'bg-orange-500' : 'bg-gray-100'}
                  `}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>

                  {/* Address Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-gray-900">{address.label}</h4>
                      {address.isDefault && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {address.house}, {address.street}<br />
                      {address.area}, Ward {address.ward}<br />
                      {address.landmark && (
                        <span className="text-gray-500">
                          Landmark: {address.landmark}
                        </span>
                      )}
                    </p>

                    {/* Actions */}
                    {showActions && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.id);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddressList;