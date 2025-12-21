// ============================================================
// FILE PATH: src/components/animations/Shimmer.jsx
// ============================================================
import { motion } from 'framer-motion';

const Shimmer = ({ className = '', width = '100%', height = '20px' }) => {
  return (
    <div
      className={`bg-gray-200 rounded overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export default Shimmer;
