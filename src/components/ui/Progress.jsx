import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Progress = ({
  value = 0,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  label,
  showPercentage = true,
  variant = 'default',
  animated = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  };

  const colors = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    gray: 'bg-gray-500',
  };

  const gradients = {
    primary: 'bg-gradient-to-r from-primary via-orange-500 to-orange-600',
    success: 'bg-gradient-to-r from-green-400 to-green-600',
    error: 'bg-gradient-to-r from-red-400 to-red-600',
    warning: 'bg-gradient-to-r from-amber-400 to-amber-600',
    info: 'bg-gradient-to-r from-blue-400 to-blue-600',
  };

  const ProgressBar = () => (
    <div className={`relative w-full ${sizes[size]} bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={animated ? { width: 0 } : { width: `${percentage}%` }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
        className={`h-full ${variant === 'gradient' ? gradients[color] : colors[color]} rounded-full relative`}
      >
        {/* Animated shimmer effect */}
        {animated && percentage > 0 && (
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        )}
      </motion.div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Label and percentage */}
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {showLabel && label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <ProgressBar />
    </div>
  );
};

// Circular Progress
export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showPercentage = true,
  label,
  animated = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    primary: '#FF6B35',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference : offset}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(percentage)}%
          </span>
        )}
        {label && (
          <span className="text-sm text-gray-600 mt-1">{label}</span>
        )}
      </div>
    </div>
  );
};

// Step Progress
export const StepProgress = ({
  steps = [],
  currentStep = 0,
  variant = 'default',
  orientation = 'horizontal',
  className = '',
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={`${className}`}>
      <div className={`flex ${isHorizontal ? 'items-center' : 'flex-col'} gap-0`}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              {/* Step circle */}
              <div className={`flex ${isHorizontal ? 'flex-col' : 'flex-row'} items-center gap-2`}>
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  className={`
                    relative flex items-center justify-center
                    w-10 h-10 rounded-full font-semibold text-sm
                    transition-colors duration-200
                    ${
                      isCompleted
                        ? 'bg-primary text-white'
                        : isActive
                        ? 'bg-primary text-white ring-4 ring-orange-100'
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>

                {/* Step label */}
                <div className={`${isHorizontal ? 'text-center' : 'flex-1'}`}>
                  <p
                    className={`
                      text-sm font-medium
                      ${isActive ? 'text-primary' : 'text-gray-600'}
                    `}
                  >
                    {step.label || step}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`
                    ${isHorizontal ? 'flex-1 h-0.5 mx-2' : 'w-0.5 h-12 ml-5'}
                    transition-colors duration-200
                    ${isCompleted ? 'bg-primary' : 'bg-gray-200'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Multi Progress (stacked progress bars)
export const MultiProgress = ({
  items = [],
  height = 'md',
  showLabels = true,
  animated = true,
  className = '',
}) => {
  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={className}>
      {/* Progress bar */}
      <div className={`relative w-full ${heights[height]} bg-gray-200 rounded-full overflow-hidden flex`}>
        {items.map((item, index) => {
          const percentage = (item.value / total) * 100;
          return (
            <motion.div
              key={index}
              initial={animated ? { width: 0 } : { width: `${percentage}%` }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: animated ? 0.5 : 0, delay: index * 0.1 }}
              className={`h-full ${item.color || 'bg-gray-400'}`}
              title={`${item.label}: ${Math.round(percentage)}%`}
            />
          );
        })}
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="mt-3 space-y-2">
          {items.map((item, index) => {
            const percentage = (item.value / total) * 100;
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {Math.round(percentage)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Upload Progress (file upload specific)
export const UploadProgress = ({
  files = [],
  onCancel,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {files.map((file, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {file.size} • {file.status}
              </p>
            </div>
            {onCancel && file.status === 'uploading' && (
              <button
                onClick={() => onCancel(file.id)}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                ✕
              </button>
            )}
          </div>
          
          <Progress
            value={file.progress}
            color={file.status === 'error' ? 'error' : file.status === 'complete' ? 'success' : 'primary'}
            size="sm"
            showPercentage={false}
            animated
          />
        </div>
      ))}
    </div>
  );
};

// Loading Progress (indeterminate)
export const LoadingProgress = ({
  color = 'primary',
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colors = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
  };

  return (
    <div className={`relative w-full ${sizes[size]} bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute h-full w-1/3 ${colors[color]} rounded-full`}
      />
    </div>
  );
};

// Score Progress (with icon)
export const ScoreProgress = ({
  score = 0,
  maxScore = 100,
  label = 'Score',
  icon: Icon,
  color = 'primary',
  className = '',
}) => {
  const percentage = (score / maxScore) * 100;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-primary';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-3 bg-orange-50 rounded-lg">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`text-3xl font-bold ${getScoreColor()}`}>
              {score}/{maxScore}
            </p>
          </div>
        </div>
      </div>
      
      <Progress
        value={percentage}
        color={color}
        size="lg"
        showPercentage={false}
        variant="gradient"
      />
    </div>
  );
};

export default Progress;