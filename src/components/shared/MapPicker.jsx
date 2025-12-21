// FILE PATH: src/components/shared/MapPicker.jsx
// Map Picker Component - Interactive map for selecting location

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const MapPicker = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || {
      lat: 27.6928, // Butwal coordinates
      lng: 83.4481,
      address: '',
    }
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock map - In production, integrate with Google Maps or Mapbox
  const handleMapClick = (e) => {
    // Simulate map click
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setSelectedLocation({
      lat: 27.6928 + (y - 50) * 0.001,
      lng: 83.4481 + (x - 50) * 0.001,
      address: `Location at ${x.toFixed(1)}%, ${y.toFixed(1)}%`,
    });
  };
  
  // Get current location
  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location',
          });
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
          alert('Unable to get your location. Please select manually.');
        }
      );
    } else {
      setIsLoading(false);
      alert('Geolocation is not supported by your browser.');
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // In production, integrate with geocoding API
    console.log('Searching for:', searchQuery);
  };
  
  // Confirm location
  const handleConfirm = () => {
    if (onLocationSelect) {
      onLocationSelect(selectedLocation);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for location..."
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </form>

      {/* Map Container */}
      <div className="relative bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
        {/* Mock Map */}
        <div
          onClick={handleMapClick}
          className="relative w-full aspect-video bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 cursor-crosshair"
        >
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Location Marker */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <MapPin className="w-12 h-12 text-orange-500 drop-shadow-lg" fill="currentColor" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm" />
            </motion.div>
          </motion.div>

          {/* Instructions */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
            <p className="text-sm font-medium text-gray-900">
              Click anywhere on the map to select location
            </p>
          </div>

          {/* Mock Map Label */}
          <div className="absolute bottom-4 right-4 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
            <p className="text-xs font-medium text-gray-600">Butwal, Nepal</p>
          </div>
        </div>

        {/* Current Location Button */}
        <button
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
          className="absolute top-4 right-4 p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Navigation className={`w-5 h-5 text-orange-500 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Selected Location Info */}
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 mb-1">Selected Location</p>
            <p className="text-sm text-gray-600">
              {selectedLocation.address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        className="w-full"
        size="lg"
      >
        Confirm Location
      </Button>

      {/* Note */}
      <p className="text-xs text-gray-500 text-center">
        Note: This is a demo map. In production, integrate with Google Maps or Mapbox for accurate location selection.
      </p>
    </div>
  );
};

export default MapPicker;