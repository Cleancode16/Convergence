import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, User, Phone, MapPin, Calendar, Save, CheckCircle } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '../services/userProfileService';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
  });

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile(userInfo.token);
      if (response.success) {
        const user = response.data;
        setFormData({
          name: user.name || '',
          phoneNumber: user.phoneNumber || '',
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
          address: {
            street: user.address?.street || '',
            city: user.address?.city || '',
            state: user.address?.state || '',
            pincode: user.address?.pincode || '',
            country: user.address?.country || 'India',
          },
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');

    try {
      const response = await updateUserProfile(formData, userInfo.token);
      if (response.success) {
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/user-dashboard')}
              className="text-white hover:text-gray-200 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="ml-4 text-2xl font-bold text-white">My Profile</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl flex items-center gap-3 shadow-lg"
          >
            <CheckCircle className="w-6 h-6" />
            <p className="font-semibold">{successMessage}</p>
          </motion.div>
        )}

        <motion.form 
          onSubmit={handleSubmit} 
          className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Personal Information */}
          <motion.div className="mb-8" variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                  placeholder="Enter your full name"
                />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userInfo?.email}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-600" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                  placeholder="10-digit mobile number"
                />
                <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number</p>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                  style={{
                    minHeight: '50px',
                    fontSize: '16px',
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Address Information */}
          <motion.div className="mb-8" variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              Address Details
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                  placeholder="House no., Building name, Street"
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                    placeholder="Enter city"
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                    placeholder="Enter state"
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.address.pincode}
                    onChange={handleAddressChange}
                    required
                    pattern="[0-9]{6}"
                    maxLength="6"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                    placeholder="6-digit pincode"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter 6-digit pincode</p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.address.country}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                    readOnly
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
            <motion.button
              type="button"
              onClick={() => navigate('/user-dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </main>
    </div>
  );
};

export default UserProfile;
