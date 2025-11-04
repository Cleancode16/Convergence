import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Search, Filter, Heart, Star, Eye, Sparkles } from 'lucide-react';
import { getAllPosts, toggleLike, toggleFavorite } from '../services/artistPostService';
import { motion } from 'framer-motion';

const ExploreArtists = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [favorites, setFavorites] = useState([]);

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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const specializations = [
    { value: 'all', label: 'All Arts' },
    { value: 'pottery', label: 'Pottery' },
    { value: 'weavery', label: 'Weavery' },
    { value: 'paintings', label: 'Paintings' },
    { value: 'tanjore paintings', label: 'Tanjore Paintings' },
    { value: 'puppetry', label: 'Puppetry' },
    { value: 'dokra jewellery', label: 'Dokra Jewellery' },
    { value: 'meenakari', label: 'Meenakari' },
    { value: 'kondapalli bommalu', label: 'Kondapalli Bommalu' },
    { value: 'ikkat', label: 'Ikkat' },
    { value: 'mandala', label: 'Mandala' },
    { value: 'stationary', label: 'Stationary' },
    { value: 'embroidery', label: 'Embroidery' },
    { value: 'wood carving', label: 'Wood Carving' },
    { value: 'metal work', label: 'Metal Work' },
    { value: 'textile', label: 'Textile' },
    { value: 'others', label: 'Others' },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (filterSpecialization && filterSpecialization !== 'all') {
        filters.specialization = filterSpecialization;
      }
      
      const data = await getAllPosts(filters);
      setPosts(data.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleLike = async (postId) => {
    if (!userInfo) {
      alert('Please login to like posts');
      return;
    }

    try {
      const data = await toggleLike(postId, userInfo.token);
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, likesCount: data.likesCount, likes: data.liked ? [...(post.likes || []), userInfo._id] : (post.likes || []).filter(id => id !== userInfo._id) }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFavorite = async (artistId) => {
    if (!userInfo) {
      alert('Please login to favorite artists');
      return;
    }

    if (!artistId) {
      alert('Artist information not available');
      return;
    }

    try {
      const data = await toggleFavorite(artistId, userInfo.token);
      if (data.isFavorite) {
        setFavorites(prev => [...prev, artistId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== artistId));
      }
      alert(data.message);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="text-white hover:text-gray-200 transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-white" />
                <h1 className="text-xl sm:text-2xl font-bold text-white">Explore Artists</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by artist name, specialization, description..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition outline-none"
              />
            </div>

            {/* Specialization Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white outline-none appearance-none cursor-pointer"
              >
                {specializations.map((spec) => (
                  <option key={spec.value} value={spec.value}>
                    {spec.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchPosts}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition font-semibold shadow-lg"
            >
              Search
            </motion.button>

            <div className="text-sm text-gray-600 font-medium">
              Showing {posts.length} artist{posts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>

        {/* Category Quick Filters */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-lg p-4 mb-8 overflow-x-auto"
        >
          <div className="flex gap-3 min-w-max">
            {specializations.map((spec) => (
              <motion.button
                key={spec.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFilterSpecialization(spec.value);
                  setTimeout(fetchPosts, 100);
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition whitespace-nowrap ${
                  filterSpecialization === spec.value
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {spec.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Artists Grid */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"></div>
            </motion.div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Loading artists...</p>
          </div>
        ) : posts.length === 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="bg-white rounded-2xl shadow-xl p-16 text-center"
          >
            <Sparkles className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-semibold">No artists found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {posts.map((post) => {
              if (!post.artisan) return null;

              return (
                <motion.div
                  key={post._id}
                  variants={scaleIn}
                  whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition cursor-pointer border-2 border-transparent hover:border-purple-200"
                >
                  {/* Cover Image */}
                  <div className="relative h-56 bg-gradient-to-r from-purple-400 to-indigo-500">
                    {post.media && post.media.length > 0 && post.media[0].type === 'image' ? (
                      <img
                        src={post.media[0].url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-5xl font-bold drop-shadow-lg">
                          {post.artisan?.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleFavorite(post.artisan?._id)}
                      disabled={!post.artisan?._id}
                      className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition ${
                        favorites.includes(post.artisan?._id)
                          ? 'bg-yellow-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-yellow-500 hover:text-white'
                      } ${!post.artisan?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Star className="w-5 h-5" fill={favorites.includes(post.artisan?._id) ? 'currentColor' : 'none'} />
                    </motion.button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                      {post.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-4 py-1.5 rounded-full font-semibold">
                        {post.specialization}
                      </span>
                    </div>

                    {post.experience && (
                      <p className="text-sm text-gray-600 mb-3">
                        <strong className="text-gray-900">Experience:</strong> {post.experience}
                      </p>
                    )}

                    <p className="text-gray-700 text-sm mb-5 line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-5 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Heart className="w-4 h-4 text-red-500" />
                          {post.likesCount || 0}
                        </span>
                        {post.media && post.media.length > 0 && (
                          <span className="font-medium">{post.media.length} photos</span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-gray-600">By {post.artisan?.name || 'Unknown'}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLike(post._id)}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition flex items-center justify-center gap-2 font-semibold ${
                          post.likes?.includes(userInfo?._id)
                            ? 'border-red-500 bg-red-500 text-white shadow-md'
                            : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                        }`}
                      >
                        <Heart className="w-5 h-5" fill={post.likes?.includes(userInfo?._id) ? 'currentColor' : 'none'} />
                        Like
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/artist-post/${post._id}`)}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 font-semibold shadow-lg"
                      >
                        <Eye className="w-5 h-5" />
                        View
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            }).filter(Boolean)}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ExploreArtists;
