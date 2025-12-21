// FILE PATH: src/pages/supplier/Orders.jsx

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import OrderQueue from '@/components/supplier/OrderQueue';
import LoadingScreen from '@/components/shared/LoadingScreen';

const SupplierOrdersPage = () => {
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
      <OrderQueue />
    </div>
  );
};

export default SupplierOrdersPage;