// FILE PATH: src/pages/static/FAQ.jsx
// FAQ Page - Frequently Asked Questions
// Collapsible accordion with common questions and answers

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      category: 'Orders & Delivery',
      questions: [
        {
          q: 'How fast is your delivery?',
          a: 'We guarantee delivery within 1 hour for all orders placed within our service area (all 19 wards of Butwal). For express delivery, we can deliver in 30 minutes with an additional charge of Rs. 50.'
        },
        {
          q: 'What are your delivery charges?',
          a: 'Delivery is FREE for your first order! After that, standard delivery charges are: Zone 1 (Central): Rs. 0, Zone 2 (Extended): Rs. 30, Zone 3 (Outer): Rs. 50. Orders above Rs. 1000 qualify for free delivery.'
        },
        {
          q: 'Can I track my order?',
          a: 'Yes! You can track your order in real-time through our platform. You\'ll see the exact location of your delivery person and estimated arrival time on a live map.'
        },
        {
          q: 'Can I cancel my order?',
          a: 'You can cancel your order within 5 minutes of placing it without any charges. After 5 minutes, cancellation depends on the order status and may incur charges.'
        },
        {
          q: 'What if I\'m not home during delivery?',
          a: 'You can add delivery instructions when placing your order. Options include leaving with a neighbor, at the door, or you can reschedule the delivery by contacting our support.'
        }
      ]
    },
    {
      category: 'Payment & Refunds',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'Currently, we accept Cash on Delivery (COD). We\'re working on integrating digital payment options like eSewa and Khalti which will be available soon.'
        },
        {
          q: 'How do refunds work?',
          a: 'If you receive a damaged or incorrect product, contact us immediately. We\'ll either replace the product or process a full refund within 3-5 business days.'
        },
        {
          q: 'Do you have a minimum order value?',
          a: 'There is no minimum order value. However, orders above Rs. 1000 qualify for free delivery.'
        }
      ]
    },
    {
      category: 'Products & Availability',
      questions: [
        {
          q: 'What products do you deliver?',
          a: 'We deliver groceries, vegetables, fruits, dairy products, beverages, snacks, personal care items, household essentials, and more. Browse our extensive catalog with 5000+ products from 50+ local suppliers.'
        },
        {
          q: 'What if a product is out of stock?',
          a: 'If a product becomes out of stock after you order, we\'ll notify you immediately. You can choose a replacement product or cancel that item from your order without any penalty.'
        },
        {
          q: 'Are your products fresh and genuine?',
          a: 'Absolutely! We partner only with verified suppliers and conduct quality checks. All products come with authenticity and freshness guarantees.'
        },
        {
          q: 'Can I request a specific product?',
          a: 'Yes! If you can\'t find a product you need, contact us and we\'ll do our best to source it from our supplier network.'
        }
      ]
    },
    {
      category: 'Account & App',
      questions: [
        {
          q: 'Do I need to create an account?',
          a: 'Yes, creating an account helps us provide faster checkout, order tracking, and personalized recommendations. It only takes a minute to sign up!'
        },
        {
          q: 'How do I reset my password?',
          a: 'Click on "Forgot Password" on the login page, enter your registered email, and we\'ll send you a password reset link.'
        },
        {
          q: 'Can I save multiple delivery addresses?',
          a: 'Yes! You can save multiple addresses in your account and easily switch between them during checkout.'
        },
        {
          q: 'How do I contact customer support?',
          a: 'You can reach us via WhatsApp at +977 9821072912, email at hello@sarsar.com.np, or through the in-app chat feature. We\'re available from 6 AM to 11 PM daily.'
        }
      ]
    },
    {
      category: 'For Suppliers',
      questions: [
        {
          q: 'How can I become a supplier on SARSAR?',
          a: 'We\'re always looking to partner with quality local suppliers! Contact us at hello@sarsar.com.np with your business details, and our team will reach out to discuss the partnership.'
        },
        {
          q: 'What are the benefits of selling on SARSAR?',
          a: 'Benefits include access to thousands of customers, no upfront costs, dedicated support, fast payment cycles, and growth opportunities in the Butwal market.'
        },
        {
          q: 'What is the commission structure?',
          a: 'We charge a competitive 10% commission on sales. There are no listing fees or hidden charges.'
        }
      ]
    }
  ];

  // Filter FAQs based on search
  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      item =>
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Find answers to common questions about SARSAR
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-2"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-0 outline-none text-gray-900 placeholder-gray-500"
            />
          </div>
        </motion.div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No questions found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredFAQs.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((item, questionIndex) => {
                    const index = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === index;

                    return (
                      <div
                        key={questionIndex}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">
                            {item.q}
                          </span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Still Have Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Still Have Questions?
          </h3>
          <p className="text-gray-700 mb-6">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Contact Support
            </a>
            <a
              href="https://wa.me/9779821072912"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-white transition-colors font-medium"
            >
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;