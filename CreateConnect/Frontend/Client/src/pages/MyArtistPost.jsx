import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Trash2, Upload, X, Video, Plus, FileText } from 'lucide-react';
import { getMyPost, deletePost } from '../services/artistPostService';
import { uploadToCloudinary } from '../services/productService';

const MyArtistPost = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
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
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await getMyPost(userInfo.token);
      setPost(data.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your artist post?')) return;

    try {
      await deletePost(post._id, userInfo.token);
      alert('Post deleted successfully');
      setPost(null);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-[#783be8] border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-[#783be8]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/artisan-dashboard')}
                className="text-[#783be8] hover:text-purple-700 transition"
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
                  <FileText className="w-7 h-7 text-[#783be8]" />
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
            {!post && (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px -10px rgba(120, 59, 232, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/create-artist-post')}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-[#783be8] text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-bold shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Post
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!post ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-12 text-center border-2 border-purple-200"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FileText className="w-24 h-24 text-[#783be8] mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent mb-4">
              No Artist Post Yet
            </h2>
            <p className="text-gray-600 mb-8 text-lg">Create your artist post to showcase your work and tell your story!</p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create-artist-post')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-[#783be8] text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-bold text-lg shadow-xl"
            >
              Create My Post
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-200"
          >
            {/* Post Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-extrabold text-white mb-3">{post.title}</h2>
                  <p className="text-purple-100 text-lg font-medium">{post.specialization}</p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/create-artist-post')}
                    className="p-4 bg-white text-[#783be8] rounded-xl hover:bg-purple-50 transition shadow-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    className="p-4 bg-white text-red-600 rounded-xl hover:bg-red-50 transition shadow-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Experience */}
              {post.experience && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <h3 className="text-sm font-bold text-[#783be8] uppercase mb-3 tracking-wide">Experience</h3>
                  <p className="text-gray-700 text-lg font-medium">{post.experience}</p>
                </motion.div>
              )}

              {/* Description */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-sm font-bold text-[#783be8] uppercase mb-3 tracking-wide">About Me & My Arts</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{post.description}</p>
              </motion.div>

              {/* Media Gallery */}
              {post.media && post.media.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-sm font-bold text-[#783be8] uppercase mb-6 tracking-wide">Gallery</h3>
                  <motion.div 
                    className="grid grid-cols-2 md:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                  >
                    {post.media.map((media, index) => (
                      <motion.div 
                        key={index} 
                        variants={scaleIn}
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.3)" }}
                        className="relative group rounded-2xl overflow-hidden border-2 border-purple-200 shadow-lg"
                      >
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <video
                            src={media.url}
                            controls
                            className="w-full h-48 object-cover"
                          />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 pt-8 border-t-2 border-purple-200"
              >
                <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">❤️</span>
                    <span className="text-lg font-semibold text-[#783be8]">{post.likesCount || 0} likes</span>
                  </span>
                  <span className="text-gray-500">Posted on {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MyArtistPost;
