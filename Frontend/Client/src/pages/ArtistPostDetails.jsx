import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Heart, Star, Mail, Sparkles, User, Award } from 'lucide-react';
import { getPost, toggleLike, toggleFavorite } from '../services/artistPostService';
import { motion } from 'framer-motion';

const ArtistPostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await getPost(id);
      setPost(data.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to load artist post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!userInfo) {
      alert('Please login to like posts');
      return;
    }

    try {
      const data = await toggleLike(id, userInfo.token);
      setPost(prev => ({
        ...prev,
        likesCount: data.likesCount,
        likes: data.liked ? [...(prev.likes || []), userInfo._id] : (prev.likes || []).filter(uid => uid !== userInfo._id)
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFavorite = async () => {
    if (!userInfo) {
      alert('Please login to favorite artists');
      return;
    }

    try {
      const data = await toggleFavorite(post.artisan._id, userInfo.token);
      setIsFavorite(data.isFavorite);
      alert(data.message);
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          className="text-center"
        >
          <Sparkles className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl font-semibold">Post not found</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-200 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="ml-4 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-white" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">Artist Profile</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media Gallery */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInLeft}
          >
            {post.media && post.media.length > 0 ? (
              <>
                <motion.div 
                  className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {post.media[selectedMedia].type === 'image' ? (
                    <img
                      src={post.media[selectedMedia].url}
                      alt={post.title}
                      className="w-full h-96 object-cover"
                    />
                  ) : (
                    <video
                      src={post.media[selectedMedia].url}
                      controls
                      className="w-full h-96 object-cover"
                    />
                  )}
                </motion.div>

                {/* Thumbnails */}
                {post.media.length > 1 && (
                  <div className="grid grid-cols-5 gap-3">
                    {post.media.map((media, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMedia(index)}
                        className={`rounded-xl overflow-hidden border-3 transition shadow-md ${
                          selectedMedia === index 
                            ? 'border-purple-600 ring-2 ring-purple-300' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-16 object-cover"
                          />
                        ) : (
                          <div className="w-full h-16 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                            <span className="text-xs text-purple-600 font-semibold">Video</span>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <motion.div 
                className="bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl shadow-2xl h-96 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-white text-6xl font-bold drop-shadow-lg">
                  {post.artisan?.name?.charAt(0).toUpperCase()}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Artist Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInRight}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-3 mb-6 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-sm bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-4 py-2 rounded-full font-semibold shadow-sm">
                  {post.specialization}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium">{post.likesCount || 0} likes</span>
                </div>
              </motion.div>

              <motion.div 
                className="mb-6 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-5 h-5 text-indigo-600" />
                  <p className="font-semibold">
                    Artist: <span className="font-normal">{post.artisan?.name}</span>
                  </p>
                </div>
                {post.experience && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Award className="w-5 h-5 text-purple-600" />
                    <p className="font-semibold">
                      Experience: <span className="font-normal">{post.experience}</span>
                    </p>
                  </div>
                )}
              </motion.div>

              <motion.div 
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  About
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-4 rounded-xl border-2 border-purple-100">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.description}</p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex gap-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className={`flex-1 px-6 py-3 rounded-xl border-2 transition flex items-center justify-center gap-2 font-semibold shadow-md ${
                    post.likes?.includes(userInfo?._id)
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500 bg-white'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={post.likes?.includes(userInfo?._id) ? 'currentColor' : 'none'} />
                  Like
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFavorite}
                  className={`flex-1 px-6 py-3 rounded-xl border-2 transition flex items-center justify-center gap-2 font-semibold shadow-md ${
                    isFavorite
                      ? 'border-yellow-500 bg-yellow-500 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-yellow-500 hover:text-yellow-500 bg-white'
                  }`}
                >
                  <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                  Favorite
                </motion.button>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = `mailto:${post.artisan?.email}`}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 font-semibold shadow-lg text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Mail className="w-5 h-5" />
                Contact Artist
              </motion.button>

              <motion.p 
                className="text-xs text-gray-500 mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Posted on {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ArtistPostDetails;
