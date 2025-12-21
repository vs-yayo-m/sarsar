// File: src/pages/auth/VerifyEmail.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { resendEmailVerification } from '@/services/auth.service';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countdown, setCountdown] = useState(0);
  
  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    setMessage({ type: '', text: '' });
    
    try {
      const result = await resendEmailVerification();
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Verification email sent! Please check your inbox.'
        });
        setCountdown(60); // 60 second cooldown
        
        // Countdown timer
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to resend email. Please try again.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setResending(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">SARSAR</h1>
              <p className="text-xs text-gray-500">Quick Commerce</p>
            </div>
          </Link>
        </div>

        {/* Verify Email Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
            <p className="text-gray-600">
              We've sent a verification link to
            </p>
            <p className="font-semibold text-gray-900 mt-1">
              {user?.email}
            </p>
          </div>

          {message.text && (
            <Alert
              type={message.type}
              message={message.text}
              dismissible
              onClose={() => setMessage({ type: '', text: '' })}
              className="mb-6"
            />
          )}

          <div className="space-y-4">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Check your email inbox</li>
                <li>Click the verification link</li>
                <li>Return here and continue</li>
              </ol>
            </div>

            {/* Resend Button */}
            <Button
              variant="outline"
              fullWidth
              onClick={handleResendEmail}
              disabled={resending || countdown > 0}
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${resending ? 'animate-spin' : ''}`} />
              {countdown > 0
                ? `Resend in ${countdown}s`
                : resending
                ? 'Sending...'
                : 'Resend Verification Email'}
            </Button>

            {/* Continue Button */}
            <Link to={ROUTES.HOME}>
              <Button variant="primary" fullWidth>
                Continue to Homepage
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign out and use different account
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the email? Check your spam folder.
          </p>
          <p className="text-sm text-gray-600">
            Still need help?{' '}
            <Link to={ROUTES.CONTACT} className="text-primary hover:text-primary-dark font-medium">
              Contact Support
            </Link>
          </p>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Email not arriving?
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Check your spam or junk folder</li>
            <li>• Make sure {user?.email} is correct</li>
            <li>• Wait a few minutes and try again</li>
            <li>• Contact support if issue persists</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;