import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Upload, X, Image as ImageIcon, AlertCircle, Sparkles } from 'lucide-react';
import { createWorkshop } from '../services/workshopService';
import { uploadImageToCloudinary } from '../config/cloudinary';
import { motion } from 'framer-motion';

const CreateWorkshop = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    artForm: '',
    date: '',
    startTime: '',
    endTime: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
    totalSlots: 10,
    price: 0,
  });

  const artForms = [
    'Pottery', 'Weaving', 'Tanjore Paintings', 'Puppetry', 'Dokra Jewellery',
    'Meenakari', 'Kondapalli Bommalu', 'Ikkat', 'Mandala Art', 'Madhubani Painting',
    'Warli Art', 'Pattachitra', 'Kalamkari', 'Bidriware', 'Blue Pottery', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    // Validate file size (max 10MB per file)
    const invalidFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      alert('Each image must be less than 10MB');
      return;
    }

    setImageFiles(prev => [...prev, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file) => {
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dq5fzwwua/image/upload';
    const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'workshops');

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        public_id: data.public_id,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.description || !formData.date || !formData.startTime || !formData.endTime || !formData.location.address) {
      alert('Please fill all required fields: Description, Date, Time, and Address');
      return;
    }

    try {
      setLoading(true);
      
      // Upload images to Cloudinary
      let uploadedImages = [];
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        
        for (let i = 0; i < imageFiles.length; i++) {
          try {
            const uploaded = await uploadImageToCloudinary(imageFiles[i], (progress) => {
              // Calculate overall progress
              const overallProgress = Math.round(((i * 100) + progress) / imageFiles.length);
              setUploadProgress(overallProgress);
            });
            uploadedImages.push(uploaded);
          } catch (uploadError) {
            console.error(`Failed to upload image ${i + 1}:`, uploadError);
            alert(`Failed to upload image ${i + 1}. Continuing with other images...`);
          }
        }
        
        setUploadingImages(false);
        setUploadProgress(0);
      }

      const workshopData = {
        ...formData,
        name: formData.name || `${formData.artForm || 'Workshop'} - ${new Date(formData.date).toLocaleDateString()}`,
        artForm: formData.artForm || 'General',
        images: uploadedImages,
      };

      await createWorkshop(workshopData, userInfo.token);
      alert('Workshop created successfully!');
      navigate('/artisan-dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Failed to create workshop');
    } finally {
      setLoading(false);
      setUploadingImages(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <nav className="bg-white shadow-xl border-b-4 border-[#783be8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="text-[#783be8] hover:text-purple-700 transition"
            >
              <ArrowLeft className="w-7 h-7" />
            </motion.button>
            <div className="flex items-center gap-3 ml-4 cursor-pointer" onClick={() => navigate('/artisan-dashboard')}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-8 h-8 text-[#783be8]" />
              </motion.div>
              <motion.h1 
                className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-transparent bg-clip-text"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CraftConnect
              </motion.h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-100"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 p-8">
            <h2 className="text-3xl font-extrabold text-white mb-2">Workshop Information</h2>
            <p className="text-purple-100 text-sm font-medium">Fields marked with * are required</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-extrabold text-gray-900 border-b-2 border-purple-200 pb-2">Basic Details</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Workshop Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                  placeholder="e.g., Traditional Pottery Making Workshop (Auto-generated if left empty)"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Art Form
                </label>
                <select
                  name="artForm"
                  value={formData.artForm}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                >
                  <option value="">Select Art Form (Optional)</option>
                  {artForms.map(form => (
                    <option key={form} value={form}>{form}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                  placeholder="Describe what participants will learn in this workshop..."
                  required
                />
              </div>
            </motion.div>

            {/* Date & Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-extrabold text-gray-900 border-b-2 border-purple-200 pb-2 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#783be8]" />
                Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-extrabold text-gray-900 border-b-2 border-purple-200 pb-2 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#783be8]" />
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.location.address}
                    onChange={handleLocationChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                    placeholder="Complete address where workshop will be held"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.location.city}
                    onChange={handleLocationChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                    placeholder="City (Optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.location.state}
                    onChange={handleLocationChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                    placeholder="State (Optional)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-800 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.location.pincode}
                    onChange={handleLocationChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                    placeholder="Pincode (Optional)"
                  />
                </div>
              </div>
            </motion.div>

            {/* Capacity & Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-extrabold text-gray-900 border-b-2 border-purple-200 pb-2 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#783be8]" />
                Capacity & Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Total Slots
                  </label>
                  <input
                    type="number"
                    name="totalSlots"
                    value={formData.totalSlots}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                    placeholder="Maximum participants (Default: 10)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                    placeholder="Enter 0 for free workshop"
                  />
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-extrabold text-gray-900 border-b-2 border-purple-200 pb-2 mb-6 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-[#783be8]" />
                Workshop Images (Optional, Max 5)
              </h3>
              
              <div className="border-2 border-dashed border-purple-300 rounded-2xl p-10 text-center bg-gradient-to-br from-purple-50 to-pink-50 hover:border-[#783be8] transition">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={imageFiles.length >= 5}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer inline-flex flex-col items-center ${imageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Upload className="w-20 h-20 text-[#783be8] mb-4" />
                  </motion.div>
                  <span className="text-base font-extrabold text-gray-800">Click to upload images</span>
                  <span className="text-sm text-gray-500 mt-2 font-medium">PNG, JPG up to 10MB each</span>
                  <span className="text-xs text-[#783be8] mt-1 font-bold">{imageFiles.length}/5 images selected</span>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6"
                >
                  {imagePreviews.map((preview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative group"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-2xl border-2 border-purple-200 shadow-md"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Upload Progress */}
              {uploadingImages && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <AlertCircle className="w-6 h-6 text-[#783be8]" />
                    </motion.div>
                    <span className="text-sm font-bold text-purple-900">Uploading images...</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 h-3 rounded-full transition-all duration-300 shadow-lg"
                    ></motion.div>
                  </div>
                  <p className="text-xs text-[#783be8] mt-2 text-right font-bold">{uploadProgress}%</p>
                </motion.div>
              )}
            </motion.div>

            {/* Submit Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-purple-200"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold text-lg shadow-md"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || uploadingImages}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-extrabold disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl text-lg"
              >
                {uploadingImages ? `Uploading Images (${uploadProgress}%)...` : loading ? 'Creating Workshop...' : '✨ Create Workshop'}
              </motion.button>
            </motion.div>
          </div>
        </motion.form>
      </main>
    </div>
  );
};

export default CreateWorkshop;
