import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Video, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createOrUpdatePost, getMyPost } from '../services/artistPostService';
import { uploadToCloudinary } from '../services/productService';

const CreateArtistPost = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [existingPost, setExistingPost] = useState(null);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
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
    fetchExistingPost();
  }, []);

  const fetchExistingPost = async () => {
    try {
      const data = await getMyPost(userInfo.token);
      if (data.data) {
        setExistingPost(data.data);
        setValue('title', data.data.title);
        setValue('description', data.data.description);
        setValue('specialization', data.data.specialization);
        setValue('experience', data.data.experience);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (mediaFiles.length + files.length > 10) {
      alert('You can upload maximum 10 files');
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
    setLoading(true);
    setUploading(mediaFiles.length > 0);
    setError(null);

    try {
      let media = existingPost?.media || [];

      // Upload new media if any
      if (mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
          const file = mediaFiles[i];
          console.log(`Uploading file ${i + 1}/${mediaFiles.length}:`, file.name);
          
          const mediaData = await uploadToCloudinary(
            file,
            CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_UPLOAD_PRESET
          );
          media.push(mediaData);
        }
      }

      setUploading(false);

      const postData = {
        title: data.title,
        description: data.description,
        specialization: data.specialization,
        experience: data.experience || '',
        media,
      };

      await createOrUpdatePost(postData, userInfo.token);
      alert(existingPost ? 'Post updated successfully!' : 'Post created successfully!');
      navigate('/my-artist-post');
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
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl border-b-4 border-[#783be8] sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-20">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/my-artist-post')}
              className="text-[#783be8] hover:text-purple-700 transition"
            >
              <ArrowLeft className="w-7 h-7" />
            </motion.button>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-[#783be8]" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-transparent bg-clip-text">
                {existingPost ? 'Edit Artist Post' : 'Create Artist Post'}
              </h1>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-purple-100"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
            >
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </motion.div>
          )}

          <motion.form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Title */}
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Title too long' } })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition"
                placeholder="e.g., Master Potter from Rajasthan"
              />
              {errors.title && <p className="mt-2 text-sm text-red-600 font-medium">{errors.title.message}</p>}
            </motion.div>

            {/* Specialization */}
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Specialization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('specialization', { required: 'Specialization is required' })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition"
                placeholder="e.g., Pottery, Weaving, Painting"
              />
              {errors.specialization && <p className="mt-2 text-sm text-red-600 font-medium">{errors.specialization.message}</p>}
            </motion.div>

            {/* Experience */}
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Experience (Optional)
              </label>
              <input
                type="text"
                {...register('experience')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition"
                placeholder="e.g., 15 years of traditional pottery"
              />
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                About You & Your Arts <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description', { required: 'Description is required', maxLength: { value: 2000, message: 'Description too long' } })}
                rows="8"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] resize-none transition"
                placeholder="Tell your story, describe your art, your journey, and what makes your work unique..."
              />
              {errors.description && <p className="mt-2 text-sm text-red-600 font-medium">{errors.description.message}</p>}
            </motion.div>

            {/* Media Upload */}
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Gallery (Optional - Max 10 files, 50MB each)
              </label>
              
              <motion.div 
                whileHover={{ borderColor: '#783be8', scale: 1.01 }}
                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition"
              >
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="media-upload"
                  disabled={mediaFiles.length >= 10}
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Upload className="w-16 h-16 text-[#783be8] mx-auto mb-3" />
                  </motion.div>
                  <p className="text-base font-semibold text-gray-700">Click to upload images or videos</p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="text-[#783be8] font-bold">{mediaFiles.length}/10</span> files uploaded
                  </p>
                </label>
              </motion.div>

              {/* Preview */}
              <AnimatePresence>
                {mediaPreviews.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6"
                  >
                    {mediaPreviews.map((preview, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                      >
                        {preview.type === 'image' ? (
                          <div className="relative overflow-hidden rounded-xl border-2 border-purple-100 shadow-md">
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs">
                                <ImageIcon className="w-3 h-3" />
                                <span className="truncate max-w-[100px]">{preview.name}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex flex-col items-center justify-center border-2 border-purple-200 shadow-md">
                            <Video className="w-10 h-10 text-[#783be8] mb-2" />
                            <p className="text-xs text-gray-600 truncate max-w-[100px]">{preview.name}</p>
                          </div>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
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
              </AnimatePresence>
            </motion.div>

            {/* Submit Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/my-artist-post')}
                className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition shadow-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(120, 59, 232, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || uploading}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Uploading media...
                  </span>
                ) : loading ? (
                  'Saving...'
                ) : existingPost ? (
                  'Update Post'
                ) : (
                  'Create Post'
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateArtistPost;
