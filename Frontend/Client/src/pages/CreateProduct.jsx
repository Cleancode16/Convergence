import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { ArrowLeft, Upload, X, Image as ImageIcon, Video, Sparkles } from 'lucide-react';
import { createProduct, uploadToCloudinary } from '../services/productService';
import { motion } from 'framer-motion';

const CreateProduct = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  // Get from environment variables
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const categories = [
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (mediaFiles.length + files.length > 5) {
      alert('You can upload maximum 5 files');
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('Only images and videos are allowed');
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }

      setMediaFiles(prev => [...prev, file]);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviews(prev => [...prev, {
          url: reader.result,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (mediaFiles.length === 0) {
      setError('Please upload at least one image or video');
      return;
    }

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setError('Cloudinary configuration is missing. Please add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env file');
      return;
    }

    setLoading(true);
    setUploading(true);
    setError(null);

    try {
      // Upload all media to Cloudinary
      const uploadedMedia = [];
      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        console.log(`Uploading file ${i + 1}/${mediaFiles.length}:`, file.name);
        
        try {
          const mediaData = await uploadToCloudinary(
            file,
            CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_UPLOAD_PRESET
          );
          uploadedMedia.push(mediaData);
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }
      }

      setUploading(false);

      // Create product
      const productData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        stock: parseInt(data.stock),
        media: uploadedMedia,
      };

      console.log('Creating product with data:', productData);
      await createProduct(productData, userInfo.token);
      alert('Product created successfully!');
      navigate('/artisan-dashboard');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-white shadow-xl border-b-4 border-[#783be8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-20">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/artisan-dashboard')}
              className="text-[#783be8] hover:text-purple-700 transition"
            >
              <ArrowLeft className="w-7 h-7" />
            </motion.button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/artisan-dashboard')}>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-purple-100"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl"
            >
              <p className="text-sm text-red-700 font-semibold">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Title too long' } })}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                placeholder="Enter product title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.title.message}</p>}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description', { required: 'Description is required', maxLength: { value: 2000, message: 'Description too long' } })}
                rows="5"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] resize-none transition font-medium"
                placeholder="Describe your product..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.description.message}</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                  placeholder="0"
                  step="0.01"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.price.message}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] bg-white transition font-medium"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.category.message}</p>}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Stock must be positive' } })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
                  placeholder="0"
                  defaultValue="1"
                />
                {errors.stock && <p className="mt-1 text-sm text-red-600 font-semibold">{errors.stock.message}</p>}
              </div>
            </motion.div>

            {/* Media Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Images/Videos <span className="text-red-500">*</span> (Max 5 files, 50MB each)
              </label>
              
              <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center bg-gradient-to-br from-purple-50 to-pink-50 hover:border-[#783be8] transition">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="media-upload"
                  disabled={mediaFiles.length >= 5}
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Upload className="w-16 h-16 text-[#783be8] mx-auto mb-3" />
                  </motion.div>
                  <p className="text-sm text-gray-700 font-semibold">Click to upload images or videos</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{mediaFiles.length}/5 files uploaded</p>
                </label>
              </div>

              {/* Preview */}
              {mediaPreviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4"
                >
                  {mediaPreviews.map((preview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative group"
                    >
                      {preview.type === 'image' ? (
                        <img
                          src={preview.url}
                          alt={preview.name}
                          className="w-full h-32 object-cover rounded-2xl border-2 border-purple-200"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center border-2 border-purple-200">
                          <Video className="w-10 h-10 text-[#783be8]" />
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Submit Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/artisan-dashboard')}
                className="flex-1 py-4 px-4 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition shadow-md"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || uploading}
                className="flex-1 py-4 px-4 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                {uploading ? 'Uploading media...' : loading ? 'Creating...' : '✨ Create Product'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateProduct;
