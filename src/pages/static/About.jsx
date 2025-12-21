// FILE PATH: src/pages/static/About.jsx
// About Page - Company information and mission
// Team, story, and values of SARSAR platform

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Zap, 
  Shield,
  Users,
  Target,
  Award
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: '1-hour delivery guarantee for all orders across Butwal'
    },
    {
      icon: Shield,
      title: 'Trustworthy',
      description: 'Verified products and transparent pricing you can rely on'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority, always'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Supporting local suppliers and serving our Butwal community'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Happy Customers' },
    { number: '50+', label: 'Local Suppliers' },
    { number: '5000+', label: 'Products Available' },
    { number: '10,000+', label: 'Orders Delivered' }
  ];

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About SARSAR
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Butwal's premier quick commerce platform, delivering everything you need in just 1 hour
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none text-gray-700"
          >
            <p className="text-lg leading-relaxed mb-6">
              SARSAR was born from a simple observation: Butwal needed a reliable, fast delivery service 
              that truly understood the needs of our community. Founded by Vishal Sharma, a Butwal local 
              passionate about technology and community service, SARSAR began with a vision to transform 
              how people in Butwal shop for their daily needs.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              We started with a small team and a big dream – to deliver anything you need within an hour. 
              Today, we partner with over 50 local suppliers, serve thousands of customers, and have 
              completed more than 10,000 deliveries across all 19 wards of Butwal.
            </p>
            <p className="text-lg leading-relaxed">
              Our mission is simple: make life easier for everyone in Butwal by providing instant access 
              to quality products with the reliability and speed you deserve.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-8" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</p>
                <p className="text-orange-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Want to Know More?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We'd love to hear from you. Get in touch with our team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/contact"
                className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Contact Us
              </a>
              <a
                href="https://www.instagram.com/_official_sarsar"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
              >
                Follow on Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;