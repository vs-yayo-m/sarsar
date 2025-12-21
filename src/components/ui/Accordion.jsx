import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccordionItem = ({
  id,
  title,
  content,
  icon: Icon,
  isOpen,
  onToggle,
  variant = 'default',
  disabled = false,
  className = '',
}) => {
  const variants = {
    default: {
      header: 'border-b border-gray-200',
      headerActive: 'bg-gray-50',
      title: 'text-gray-900',
      icon: <ChevronDown className="w-5 h-5" />,
    },
    bordered: {
      header: 'border border-gray-200 rounded-lg mb-2',
      headerActive: 'bg-orange-50 border-primary',
      title: 'text-gray-900',
      icon: <ChevronDown className="w-5 h-5" />,
    },
    filled: {
      header: 'bg-gray-100 rounded-lg mb-2',
      headerActive: 'bg-primary text-white',
      title: 'text-gray-900',
      icon: <ChevronDown className="w-5 h-5" />,
    },
    minimal: {
      header: 'border-b border-gray-100',
      headerActive: '',
      title: 'text-gray-900',
      icon: <Plus className="w-5 h-5" />,
    },
  };

  const variantStyle = variants[variant];

  return (
    <div className={`${className}`}>
      {/* Header */}
      <button
        onClick={() => !disabled && onToggle(id)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-4
          text-left transition-all duration-200
          ${variantStyle.header}
          ${isOpen ? variantStyle.headerActive : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
          ${variant === 'bordered' || variant === 'filled' ? '' : ''}
        `}
      >
        {/* Left side: Icon + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Custom Icon */}
          {Icon && (
            <div
              className={`
                flex-shrink-0
                ${
                  isOpen && variant === 'filled'
                    ? 'text-white'
                    : 'text-gray-600'
                }
              `}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}

          {/* Title */}
          <h3
            className={`
              font-semibold text-base truncate
              ${
                isOpen && variant === 'filled'
                  ? 'text-white'
                  : variantStyle.title
              }
            `}
          >
            {title}
          </h3>
        </div>

        {/* Toggle Icon */}
        <div
          className={`
            flex-shrink-0 ml-4 transition-all duration-200
            ${
              isOpen && variant === 'filled'
                ? 'text-white'
                : 'text-gray-500'
            }
          `}
        >
          {variant === 'minimal' ? (
            isOpen ? (
              <Minus className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )
          ) : (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {variantStyle.icon}
            </motion.div>
          )}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className={`
                px-4 py-4 text-gray-600
                ${variant === 'bordered' ? 'border-t border-gray-200' : ''}
              `}
            >
              {typeof content === 'string' ? (
                <p className="text-sm leading-relaxed">{content}</p>
              ) : (
                content
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Accordion = ({
  items = [],
  allowMultiple = false,
  defaultOpen = [],
  variant = 'default',
  className = '',
}) => {
  const [openItems, setOpenItems] = useState(defaultOpen);

  const handleToggle = (id) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id]
      );
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={className}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          icon={item.icon}
          isOpen={openItems.includes(item.id)}
          onToggle={handleToggle}
          variant={variant}
          disabled={item.disabled}
        />
      ))}
    </div>
  );
};

// Controlled Accordion Component
export const ControlledAccordion = ({
  items = [],
  openItems = [],
  onToggle,
  variant = 'default',
  className = '',
}) => {
  return (
    <div className={className}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          icon={item.icon}
          isOpen={openItems.includes(item.id)}
          onToggle={onToggle}
          variant={variant}
          disabled={item.disabled}
        />
      ))}
    </div>
  );
};

// FAQ Accordion (pre-styled for FAQs)
export const FAQAccordion = ({ faqs = [], className = '' }) => {
  const [openItems, setOpenItems] = useState([]);

  const handleToggle = (id) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [id]
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {faqs.map((faq, index) => (
        <div
          key={faq.id || index}
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <AccordionItem
            id={faq.id || index}
            title={faq.question}
            content={faq.answer}
            isOpen={openItems.includes(faq.id || index)}
            onToggle={handleToggle}
            variant="bordered"
          />
        </div>
      ))}
    </div>
  );
};

// Step Accordion (for processes/tutorials)
export const StepAccordion = ({ steps = [], className = '' }) => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className={`space-y-3 ${className}`}>
      {steps.map((step, index) => {
        const isOpen = currentStep === index;
        const isCompleted = currentStep > index;

        return (
          <div
            key={step.id || index}
            className={`
              border-2 rounded-lg transition-all duration-200
              ${isOpen ? 'border-primary shadow-lg' : 'border-gray-200'}
              ${isCompleted ? 'border-green-500 bg-green-50' : ''}
            `}
          >
            <button
              onClick={() => setCurrentStep(index)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left"
            >
              {/* Step number/status */}
              <div
                className={`
                  flex-shrink-0 w-10 h-10 rounded-full
                  flex items-center justify-center font-bold text-sm
                  transition-all duration-200
                  ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isOpen
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }
                `}
              >
                {isCompleted ? '✓' : index + 1}
              </div>

              {/* Step title */}
              <div className="flex-1 min-w-0">
                <h4
                  className={`
                    font-semibold text-base
                    ${isOpen ? 'text-primary' : 'text-gray-900'}
                  `}
                >
                  {step.title}
                </h4>
                {step.subtitle && (
                  <p className="text-sm text-gray-500 mt-0.5">{step.subtitle}</p>
                )}
              </div>

              {/* Arrow */}
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown
                  className={`w-5 h-5 ${isOpen ? 'text-primary' : 'text-gray-400'}`}
                />
              </motion.div>
            </button>

            {/* Step content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pl-[76px]">
                    <div className="text-gray-600">{step.content}</div>

                    {/* Action buttons */}
                    <div className="flex gap-3 mt-4">
                      {index > 0 && (
                        <button
                          onClick={() => setCurrentStep(index - 1)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Previous
                        </button>
                      )}
                      {index < steps.length - 1 ? (
                        <button
                          onClick={() => setCurrentStep(index + 1)}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          Next Step
                        </button>
                      ) : (
                        <button
                          onClick={() => step.onComplete?.()}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;