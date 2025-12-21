// FILE PATH: src/components/animations/Confetti.jsx
// Confetti Animation Component - Celebration effect

import { useEffect } from 'react';
import { motion } from 'framer-motion';

const Confetti = ({ duration = 3000, onComplete }) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);
  
  // Generate random confetti pieces
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    rotate: Math.random() * 360,
    color: ['#FF6B35', '#F7931E', '#FFB88C', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)],
  }));
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: piece.x,
            top: -20,
            backgroundColor: piece.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: 0,
            rotate: piece.rotate,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;