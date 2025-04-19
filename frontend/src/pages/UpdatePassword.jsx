import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiCheckCircle, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

const UpdatePassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    
    // Calculate password strength
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.put('http://localhost:8080/api/users/forgot-password', {
        email,
        newPassword,
      });

      setMessage(response.data || 'Password updated successfully!');
    } catch (err) {
      setError(err.response?.data || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-gray-400';
    if (passwordStrength === 3) return 'bg-gray-600';
    return 'bg-black';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-gray-200"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Update Password</h2>
            <p className="text-gray-600">Enter your email and new password</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className="block w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiLock className="h-5 w-5" /> : <FiLock className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className={`h-1 flex-1 rounded-full ${i <= passwordStrength ? getStrengthColor() : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-1 text-gray-500">
                    {passwordStrength <= 2 ? 'Weak' : 
                     passwordStrength <= 3 ? 'Moderate' : 'Strong'} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center ${
                isSubmitting ? 'bg-gray-400' : 'bg-gray-900 hover:bg-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2`}
            >
              {isSubmitting ? (
                'Updating...'
              ) : (
                <>
                  Update Password
                  <FiArrowRight className="ml-2" />
                </>
              )}
            </motion.button>

            {/* Messages */}
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg text-gray-800"
              >
                <FiCheckCircle className="h-5 w-5 mr-2 text-gray-700" />
                <span>{message}</span>
              </motion.div>
            )}
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg text-gray-800"
              >
                <FiAlertCircle className="h-5 w-5 mr-2 text-gray-700" />
                <span>{error}</span>
              </motion.div>
            )}
          </form>
        </div>
        
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Remember your password?{' '}
            <a href="/login" className="text-gray-900 hover:underline font-medium">Sign in</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdatePassword;