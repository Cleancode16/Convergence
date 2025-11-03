import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { User, Phone, CreditCard, Briefcase, MapPin, Home, FileText } from 'lucide-react';
import { createOrUpdateProfile, getProfile } from '../services/artisanService';

const ArtisanProfileSetup = () => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const artType = watch('artType');

  const artTypes = [
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
    { value: 'others', label: 'Others' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(userInfo.token);
        if (data.success && data.data) {
          setIsEdit(true);
          // Populate form with existing data
          setValue('artType', data.data.artType);
          setValue('otherArtType', data.data.otherArtType || '');
          setValue('phoneNumber', data.data.phoneNumber);
          setValue('aadharNumber', data.data.aadharNumber);
          setValue('bio', data.data.bio || '');
          setValue('experience', data.data.experience || '');
          setValue('address.street', data.data.address?.street || '');
          setValue('address.city', data.data.address?.city || '');
          setValue('address.state', data.data.address?.state || '');
          setValue('address.pincode', data.data.address?.pincode || '');
        }
      } catch (err) {
        // Profile doesn't exist yet, that's okay
        console.log('No existing profile found');
      }
    };

    if (userInfo?.token) {
      fetchProfile();
    }
  }, [userInfo, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const profileData = {
        artType: data.artType,
        phoneNumber: data.phoneNumber,
        aadharNumber: data.aadharNumber,
        bio: data.bio,
        experience: data.experience ? parseInt(data.experience) : undefined,
        address: {
          street: data.address?.street,
          city: data.address?.city,
          state: data.address?.state,
          pincode: data.address?.pincode,
        },
      };

      if (data.artType === 'others' && data.otherArtType) {
        profileData.otherArtType = data.otherArtType;
      }

      await createOrUpdateProfile(profileData, userInfo.token);
      setSuccess(true);
      setTimeout(() => {
        navigate('/artisan-dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100 p-4 rounded-full">
                <User className="w-12 h-12 text-amber-600" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isEdit ? 'Update Your Profile' : 'Complete Your Artisan Profile'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please fill in all the required information to get started
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-sm text-green-700">
                Profile {isEdit ? 'updated' : 'created'} successfully! Redirecting...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Art Type */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 mr-2 text-amber-600" />
                Art Type <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register('artType', { required: 'Art type is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-white"
              >
                <option value="">Select your art type</option>
                {artTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.artType && (
                <p className="mt-1 text-sm text-red-600">{errors.artType.message}</p>
              )}
            </div>

            {/* Other Art Type (shown only when 'others' is selected) */}
            {artType === 'others' && (
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 mr-2 text-amber-600" />
                  Specify Your Art Type <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...register('otherArtType', {
                    required: artType === 'others' ? 'Please specify your art type' : false,
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  placeholder="Enter your art type"
                />
                {errors.otherArtType && (
                  <p className="mt-1 text-sm text-red-600">{errors.otherArtType.message}</p>
                )}
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 mr-2 text-amber-600" />
                Phone Number <span className="text-red-500 ml-1">*</span>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                placeholder="9876543210"
                maxLength="10"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Aadhar Number */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 mr-2 text-amber-600" />
                Aadhar Number <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register('aadharNumber', {
                  required: 'Aadhar number is required',
                  pattern: {
                    value: /^[0-9]{12}$/,
                    message: 'Please enter a valid 12-digit Aadhar number',
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                placeholder="123456789012"
                maxLength="12"
              />
              {errors.aadharNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.aadharNumber.message}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2 text-amber-600" />
                Bio (Optional)
              </label>
              <textarea
                {...register('bio', {
                  maxLength: { value: 500, message: 'Bio cannot exceed 500 characters' },
                })}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition resize-none"
                placeholder="Tell us about yourself and your craft..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 mr-2 text-amber-600" />
                Years of Experience (Optional)
              </label>
              <input
                type="number"
                {...register('experience', {
                  min: { value: 0, message: 'Experience cannot be negative' },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                placeholder="5"
                min="0"
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
              )}
            </div>

            {/* Address Section */}
            <div className="border-t pt-6">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                Address (Optional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Home className="w-4 h-4 mr-2 text-amber-600" />
                    Street Address
                  </label>
                  <input
                    type="text"
                    {...register('address.street')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    {...register('address.city')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    {...register('address.state')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    placeholder="Maharashtra"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    placeholder="400001"
                    maxLength="6"
                  />
                  {errors.address?.pincode && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.pincode.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/artisan-dashboard')}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : isEdit ? 'Update Profile' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtisanProfileSetup;
