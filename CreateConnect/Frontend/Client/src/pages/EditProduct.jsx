import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Image as ImageIcon, Video, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProduct, updateProduct, uploadToCloudinary } from '../services/productService';

const EditProduct = () => {
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);

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

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setFetchLoading(true);
      const data = await getProduct(id);
      const productData = data.data;
      
      if (productData.artisan._id !== userInfo._id) {
        alert('You are not authorized to edit this product');
        navigate('/my-products');
        return;
      }

      setProduct(productData);
      setExistingMedia(productData.media || []);
      
      // Set form values
      setValue('title', productData.title);
      setValue('description', productData.description);
      setValue('price', productData.price);
      setValue('category', productData.category);
      setValue('stock', productData.stock);
    } catch (error) {
      setError(error.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (existingMedia.length + mediaFiles.length + files.length > 5) {
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

  const removeNewMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = (index) => {
    setExistingMedia(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (existingMedia.length + mediaFiles.length === 0) {
      setError('Please keep at least one image or video');
      return;
    }

    setLoading(true);
    setUploading(mediaFiles.length > 0);
    setError(null);

    try {
      let allMedia = [...existingMedia];

      // Upload new media if any
      if (mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
          const file = mediaFiles[i];
          console.log(`Uploading file ${i + 1}/${mediaFiles.length}:`, file.name);
          
          try {
            const mediaData = await uploadToCloudinary(
              file,
              CLOUDINARY_CLOUD_NAME,
              CLOUDINARY_UPLOAD_PRESET
            );
            allMedia.push(mediaData);
          } catch (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
          }
        }
      }

      setUploading(false);

      // Update product
      const productData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        stock: parseInt(data.stock),
        media: allMedia,
      };

      await updateProduct(id, productData, userInfo.token);
      alert('Product updated successfully!');
      navigate('/my-products');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-4 border-[#783be8] border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <nav className="bg-white shadow-lg border-b-4 border-[#783be8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <motion.button
              onClick={() => navigate('/my-products')}
              className="text-[#783be8] hover:text-purple-700 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/artisan-dashboard')}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-6 h-6 text-[#783be8]" />
              </motion.div>
              <motion.h1 
                className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent"
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
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
            >
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Title too long' } })}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition"
                placeholder="Enter product title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description', { required: 'Description is required', maxLength: { value: 2000, message: 'Description too long' } })}
                rows="5"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] resize-none transition"
                placeholder="Describe your product..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition"
                  placeholder="0"
                  step="0.01"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] bg-white transition"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Stock must be positive' } })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition"
                  placeholder="0"
                />
                {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
              </div>
            </motion.div>

            {/* Media Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images/Videos (Max 5 files, 50MB each)
              </label>

              {/* Existing Media */}
              {existingMedia.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Media:</p>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {existingMedia.map((media, index) => (
                      <motion.div
                        key={index}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          visible: { opacity: 1, scale: 1 }
                        }}
                        className="relative group"
                      >
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl border-2 border-purple-200"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center border-2 border-purple-200">
                            <Video className="w-8 h-8 text-[#783be8]" />
                          </div>
                        )}
                        <motion.button
                          type="button"
                          onClick={() => removeExistingMedia(index)}
                          whileHover={{ rotate: 90, scale: 1.1 }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
              
              {/* Upload New Media */}
              {(existingMedia.length + mediaFiles.length) < 5 && (
                <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 hover:border-[#783be8] transition">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Upload className="w-12 h-12 text-[#783be8] mx-auto mb-2" />
                    </motion.div>
                    <p className="text-sm text-gray-600 font-medium">Click to upload new images or videos</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {existingMedia.length + mediaFiles.length}/5 files
                    </p>
                  </label>
                </div>
              )}

              {/* New Media Preview */}
              {mediaPreviews.length > 0 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4"
                >
                  {mediaPreviews.map((preview, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 }
                      }}
                      className="relative group"
                    >
                      {preview.type === 'image' ? (
                        <img
                          src={preview.url}
                          alt={preview.name}
                          className="w-full h-32 object-cover rounded-xl border-2 border-purple-200"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center border-2 border-purple-200">
                          <Video className="w-8 h-8 text-[#783be8]" />
                        </div>
                      )}
                      <motion.button
                        type="button"
                        onClick={() => removeNewMedia(index)}
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                      <div className="absolute bottom-2 left-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        New
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Submit Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4"
            >
              <motion.button
                type="button"
                onClick={() => navigate('/my-products')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-4 border-2 border-purple-200 rounded-xl text-gray-700 font-semibold hover:bg-purple-50 transition"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading || uploading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading media...' : loading ? 'Updating...' : 'Update Product'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default EditProduct;
