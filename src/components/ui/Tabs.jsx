import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'underline',
  size = 'md',
  fullWidth = false,
  className = '',
  tabClassName = '',
  panelClassName = '',
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef([]);
  const containerRef = useRef(null);

  // Update indicator position
  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
      const tab = tabsRef.current[activeIndex];
      const container = containerRef.current;
      
      if (variant === 'underline' || variant === 'pills') {
        setIndicatorStyle({
          left: tab.offsetLeft,
          width: tab.offsetWidth,
        });
      }
    }
  }, [activeTab, tabs, variant]);

  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-2.5',
    lg: 'text-lg px-5 py-3',
  };

  const variantClasses = {
    underline: {
      container: 'border-b border-gray-200',
      tab: (isActive) => `
        relative font-medium transition-colors duration-200
        ${isActive ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}
      `,
      activeClass: '',
    },
    pills: {
      container: 'bg-gray-100 rounded-lg p-1',
      tab: (isActive) => `
        relative font-medium rounded-md transition-all duration-200
        ${isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'}
      `,
      activeClass: '',
    },
    bordered: {
      container: 'border-b border-gray-200',
      tab: (isActive) => `
        relative font-medium rounded-t-lg border-t border-l border-r transition-all duration-200
        ${
          isActive
            ? 'text-primary border-gray-200 bg-white -mb-px'
            : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-200'
        }
      `,
      activeClass: '',
    },
    solid: {
      container: 'gap-2',
      tab: (isActive) => `
        relative font-medium rounded-lg transition-all duration-200
        ${
          isActive
            ? 'bg-primary text-white shadow-md'
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }
      `,
      activeClass: '',
    },
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={className}>
      {/* Tabs Header */}
      <div
        ref={containerRef}
        className={`
          relative flex
          ${fullWidth ? 'w-full' : 'inline-flex'}
          ${variantClasses[variant].container}
          ${fullWidth ? 'justify-stretch' : 'justify-start'}
        `}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              ref={(el) => (tabsRef.current[index] = el)}
              onClick={() => !isDisabled && onChange(tab.id)}
              disabled={isDisabled}
              className={`
                ${sizeClasses[size]}
                ${variantClasses[variant].tab(isActive)}
                ${fullWidth ? 'flex-1' : ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${tabClassName}
              `}
            >
              {/* Tab content */}
              <div className="flex items-center justify-center gap-2">
                {/* Icon */}
                {tab.icon && (
                  <span className={isActive ? 'text-current' : 'text-gray-500'}>
                    {typeof tab.icon === 'function' ? (
                      <tab.icon className="w-5 h-5" />
                    ) : (
                      tab.icon
                    )}
                  </span>
                )}
                
                {/* Label */}
                <span>{tab.label}</span>
                
                {/* Badge */}
                {tab.badge && (
                  <span
                    className={`
                      px-2 py-0.5 text-xs font-semibold rounded-full
                      ${
                        isActive
                          ? variant === 'pills' || variant === 'solid'
                            ? 'bg-white text-primary'
                            : 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-600'
                      }
                    `}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Animated indicator */}
        {(variant === 'underline' || variant === 'pills') && (
          <motion.div
            className={`
              absolute bottom-0 h-0.5
              ${variant === 'underline' ? 'bg-primary' : ''}
              ${variant === 'pills' ? 'bg-primary rounded-md top-1 bottom-1 h-auto' : ''}
            `}
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          />
        )}
      </div>

      {/* Tab Panel */}
      <div className={`mt-4 ${panelClassName}`}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTabContent?.content}
        </motion.div>
      </div>
    </div>
  );
};

// Vertical Tabs Component
export const VerticalTabs = ({
  tabs = [],
  activeTab,
  onChange,
  size = 'md',
  className = '',
  tabClassName = '',
  panelClassName = '',
}) => {
  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-2.5',
    lg: 'text-lg px-5 py-3',
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={`flex gap-6 ${className}`}>
      {/* Tabs Sidebar */}
      <div className="flex flex-col space-y-1 min-w-[200px]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onChange(tab.id)}
              disabled={isDisabled}
              className={`
                ${sizeClasses[size]}
                flex items-center gap-3 text-left rounded-lg
                font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${tabClassName}
              `}
            >
              {/* Icon */}
              {tab.icon && (
                <span>
                  {typeof tab.icon === 'function' ? (
                    <tab.icon className="w-5 h-5" />
                  ) : (
                    tab.icon
                  )}
                </span>
              )}
              
              {/* Label */}
              <span className="flex-1">{tab.label}</span>
              
              {/* Badge */}
              {tab.badge && (
                <span
                  className={`
                    px-2 py-0.5 text-xs font-semibold rounded-full
                    ${
                      isActive
                        ? 'bg-white text-primary'
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      <div className={`flex-1 ${panelClassName}`}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTabContent?.content}
        </motion.div>
      </div>
    </div>
  );
};

// Scrollable Tabs (for many tabs)
export const ScrollableTabs = ({
  tabs = [],
  activeTab,
  onChange,
  size = 'md',
  className = '',
  tabClassName = '',
  panelClassName = '',
}) => {
  const scrollContainerRef = useRef(null);
  const activeTabRef = useRef(null);

  // Scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        tab.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeTab]);

  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-2.5',
    lg: 'text-lg px-5 py-3',
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={className}>
      {/* Tabs Header */}
      <div className="relative">
        {/* Scroll container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide border-b border-gray-200"
        >
          <div className="flex gap-2 min-w-min px-1 pb-px">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              const isDisabled = tab.disabled;

              return (
                <button
                  key={tab.id}
                  ref={isActive ? activeTabRef : null}
                  onClick={() => !isDisabled && onChange(tab.id)}
                  disabled={isDisabled}
                  className={`
                    ${sizeClasses[size]}
                    relative whitespace-nowrap font-medium rounded-t-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600 hover:text-gray-900'
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${tabClassName}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {tab.icon && (
                      <span>
                        {typeof tab.icon === 'function' ? (
                          <tab.icon className="w-5 h-5" />
                        ) : (
                          tab.icon
                        )}
                      </span>
                    )}
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`
                          px-2 py-0.5 text-xs font-semibold rounded-full
                          ${
                            isActive
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 text-gray-600'
                          }
                        `}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scroll indicators (optional) */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* Tab Panel */}
      <div className={`mt-4 ${panelClassName}`}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTabContent?.content}
        </motion.div>
      </div>
    </div>
  );
};

export default Tabs;