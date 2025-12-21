// ============================================================
// FILE PATH: src/components/shared/EmptyState.jsx
// ============================================================
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {Icon && (
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <Icon className="w-12 h-12 text-orange-600" />
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 text-center max-w-md mb-8">{description}</p>}
      
      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;