import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Building2, Phone, FileText, Hash, MapPin, Home, Globe, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { createOrUpdateProfile, getProfile } from '../services/ngoService';

const NgoProfileSetup = () => {
  const { register, handleSubmit, formState: { errors }, watch, setValue, control } = useForm();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState([]);

  const ngoType = watch('ngoType');

  const ngoTypes = [
    { value: 'trust', label: 'Trust' },
    { value: 'society', label: 'Society' },
    { value: 'section_8_company', label: 'Section 8 Company' },
    { value: 'others', label: 'Others' },
  ];

  const artDomains = [
    { value: 'pottery', label: 'Pottery' },
    { value: 'weavery', label: 'Weavery' },
    { value: 'paintings', label: 'Paintings' },
    { value: 'tanjore_paintings', label: 'Tanjore Paintings' },
    { value: 'puppetry', label: 'Puppetry' },
    { value: 'dokra_jewellery', label: 'Dokra Jewellery' },
    { value: 'meenakari', label: 'Meenakari' },
    { value: 'kondapalli_bommalu', label: 'Kondapalli Bommalu' },
    { value: 'ikkat', label: 'Ikkat' },
    { value: 'mandala', label: 'Mandala' },
    { value: 'stationary', label: 'Stationary' },
    { value: 'all', label: 'All Art Forms' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(userInfo.token);
        if (data.success && data.data) {
          setIsEdit(true);
          setValue('ngoType', data.data.ngoType);
          setValue('otherNgoType', data.data.otherNgoType || '');
          setValue('registrationNumber', data.data.registrationNumber);
          setValue('phoneNumber', data.data.phoneNumber);
          setSelectedDomains(data.data.interestedArtDomains || []);
          setValue('description', data.data.description || '');
          setValue('yearEstablished', data.data.yearEstablished || '');
          setValue('website', data.data.website || '');
          setValue('address.street', data.data.address?.street || '');
          setValue('address.city', data.data.address?.city || '');
          setValue('address.state', data.data.address?.state || '');
          setValue('address.pincode', data.data.address?.pincode || '');
        }
      } catch (err) {
        console.log('No existing profile found');
      }
    };

    if (userInfo?.token) {
      fetchProfile();
    }
  }, [userInfo, setValue]);

  const handleDomainToggle = (domain) => {
    setSelectedDomains(prev => {
      if (domain === 'all') {
        return prev.includes('all') ? [] : ['all'];
      }
      
      const filtered = prev.filter(d => d !== 'all');
      if (prev.includes(domain)) {
        return filtered.filter(d => d !== domain);
      } else {
        return [...filtered, domain];
      }
    });
  };

  const onSubmit = async (data) => {
    if (selectedDomains.length === 0) {
      setError('Please select at least one art domain');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const profileData = {
        ngoType: data.ngoType,
        registrationNumber: data.registrationNumber,
        phoneNumber: data.phoneNumber,
        interestedArtDomains: selectedDomains,
        description: data.description,
        yearEstablished: data.yearEstablished ? parseInt(data.yearEstablished) : undefined,
        website: data.website,
        address: {
          street: data.address?.street,
          city: data.address?.city,
          state: data.address?.state,
          pincode: data.address?.pincode,
        },
      };

      if (data.ngoType === 'others' && data.otherNgoType) {
        profileData.otherNgoType = data.otherNgoType;
      }

      await createOrUpdateProfile(profileData, userInfo.token);
      setSuccess(true);
      setTimeout(() => {
        navigate('/ngo-dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100"
        >
          <div className="text-center mb-8">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <div className="bg-purple-100 p-4 rounded-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-12 h-12 text-[#783be8]" />
                </motion.div>
              </div>
            </motion.div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
              {isEdit ? 'Update NGO Profile' : 'Complete Your NGO Profile'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please provide your organization details
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
            >
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg"
            >
              <p className="text-sm text-green-700">
                Profile {isEdit ? 'updated' : 'created'} successfully! Redirecting...
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* NGO Type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 mr-2 text-[#783be8]" />
                NGO Type <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register('ngoType', { required: 'NGO type is required' })}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition bg-white"
              >
                <option value="">Select NGO type</option>
                {ngoTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.ngoType && (
                <p className="mt-1 text-sm text-red-600">{errors.ngoType.message}</p>
              )}
            </motion.div>

            {/* Other NGO Type */}
            {ngoType === 'others' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 mr-2 text-[#783be8]" />
                  Specify NGO Type <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...register('otherNgoType', {
                    required: ngoType === 'others' ? 'Please specify NGO type' : false,
                  })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition"
                  placeholder="Enter NGO type"
                />
                {errors.otherNgoType && (
                  <p className="mt-1 text-sm text-red-600">{errors.otherNgoType.message}</p>
                )}
              </motion.div>
            )}

            {/* Registration Number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 mr-2 text-[#783be8]" />
                Registration Number <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register('registrationNumber', { required: 'Registration number is required' })}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition"
                placeholder="REG123456"
              />
              {errors.registrationNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.registrationNumber.message}</p>
              )}
            </motion.div>

            {/* Phone Number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 mr-2 text-[#783be8]" />
                Contact Number <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit phone number',
                  },
                })}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition"
                placeholder="9876543210"
                maxLength="10"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </motion.div>

            {/* Interested Art Domains */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <FileText className="w-4 h-4 mr-2 text-teal-600" />
                Interested Art Domains <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {artDomains.map((domain) => (
                  <label
                    key={domain.value}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      selectedDomains.includes(domain.value)
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDomains.includes(domain.value)}
                      onChange={() => handleDomainToggle(domain.value)}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{domain.label}</span>
                  </label>
                ))}
              </div>
              {selectedDomains.length === 0 && error && (
                <p className="mt-2 text-sm text-red-600">Please select at least one art domain</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2 text-teal-600" />
                Organization Description (Optional)
              </label>
              <textarea
                {...register('description', {
                  maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' },
                })}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition resize-none"
                placeholder="Tell us about your organization's mission and work..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Year Established */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                  Year Established (Optional)
                </label>
                <input
                  type="number"
                  {...register('yearEstablished', {
                    min: { value: 1800, message: 'Invalid year' },
                    max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="2010"
                  min="1800"
                  max={new Date().getFullYear()}
                />
                {errors.yearEstablished && (
                  <p className="mt-1 text-sm text-red-600">{errors.yearEstablished.message}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 mr-2 text-teal-600" />
                  Website (Optional)
                </label>
                <input
                  type="url"
                  {...register('website')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="https://example.org"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="border-t pt-6">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                <MapPin className="w-5 h-5 mr-2 text-teal-600" />
                Address (Optional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Home className="w-4 h-4 mr-2 text-teal-600" />
                    Street Address
                  </label>
                  <input
                    type="text"
                    {...register('address.street')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    {...register('address.city')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    placeholder="Delhi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    {...register('address.state')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    placeholder="Delhi"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    {...register('address.pincode', {
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'Please enter a valid 6-digit pincode',
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    placeholder="110001"
                    maxLength="6"
                  />
                  {errors.address?.pincode && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.pincode.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4"
            >
              <motion.button
                type="button"
                onClick={() => navigate('/ngo-dashboard')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-4 border-2 border-purple-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#783be8] transition"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#783be8] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : isEdit ? 'Update Profile' : 'Complete Profile'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default NgoProfileSetup;
