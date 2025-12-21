// FILE PATH: src/pages/supplier/Products.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ProductManagement from '@/components/supplier/ProductManagement';
import LoadingScreen from '@/components/shared/LoadingScreen';

const SupplierProductsPage = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'supplier')) {
      navigate('/login');
    }
  }, [user, userRole, authLoading, navigate]);
  
  if (authLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ProductManagement />
    </div>
  );
};

export default SupplierProductsPage;