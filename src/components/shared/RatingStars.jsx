// FILE PATH: src/components/shared/RatingStars.jsx
// Rating Stars Component - Display and input ratings

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const RatingStars = ({
  rating = 0,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showCount = false,
  count = 0,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  // Size variants
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };
  
  const iconSize = sizeClasses[size] || sizeClasses.md;
  
  // Handle star click
  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };
  
  // Handle mouse enter
  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };
  
  // Calculate display rating
  const displayRating = hoverRating || rating;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          const isHalfFilled = !isFilled && starValue - 0.5 <= displayRating;

          return (
            <motion.button
              key={index}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
              whileHover={interactive ? { scale: 1.1 } : {}}
              whileTap={interactive ? { scale: 0.9 } : {}}
              className={`
                relative
                ${interactive ? 'cursor-pointer' : 'cursor-default'}
                ${!interactive && 'pointer-events-none'}
              `}
            >
              {/* Full star */}
              <Star
                className={`
                  ${iconSize}
                  transition-all duration-200
                  ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }
                  ${interactive && hoverRating >= starValue && 'fill-amber-400 text-amber-400'}
                `}
              />

              {/* Half star overlay */}
              {isHalfFilled && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star className={`${iconSize} fill-amber-400 text-amber-400`} />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Rating value and count */}
      {(showCount || rating > 0) && (
        <div className="flex items-center gap-1 text-sm">
          <span className="font-semibold text-gray-900">
            {rating.toFixed(1)}
          </span>
          {showCount && count > 0 && (
            <span className="text-gray-500">({count})</span>
          )}
        </div>
      )}
    </div>
  );
};

// Rating Summary Component
export const RatingSummary = ({ ratings, totalReviews }) => {
  // Calculate average rating
  const averageRating = ratings ?
    Object.entries(ratings).reduce(
      (sum, [stars, count]) => sum + stars * count,
      0
    ) / totalReviews :
    0;
  
  return (
    <div className="space-y-4">
      {/* Average Rating */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </div>
          <RatingStars rating={averageRating} size="lg" />
          <div className="text-sm text-gray-500 mt-1">
            {totalReviews} reviews
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      {ratings && (
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratings[stars] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-8">
                  {stars} ★
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: (5 - stars) * 0.1 }}
                    className="h-full bg-amber-400"
                  />
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RatingStars;