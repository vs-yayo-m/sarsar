// === === === === === === === === === === === === === === === === === === === ==
// FILE PATH: src/components/animations/SlideIn.jsx
// ============================================================
import { motion } from 'framer-motion';

const SlideIn = ({ children, direction = 'left', delay = 0, className = '' }) => {
  const directions = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: 100 },
    down: { y: -100 },
  };
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;