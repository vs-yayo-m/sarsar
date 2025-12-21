//=== === === === === === === === === === === === === === === === === === === ===
// FILE PATH: src/components/animations/StaggerChildren.jsx
// ============================================================
import { motion } from 'framer-motion';

const StaggerChildren = ({ children, staggerDelay = 0.1, className = '' }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: staggerDelay },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  
  return (
    <motion.div className={className} variants={container} initial="hidden" animate="show">
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={item}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={item}>{children}</motion.div>
      )}
    </motion.div>
  );
};

export default StaggerChildren;