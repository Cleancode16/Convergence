import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Filter, Heart, ShoppingCart, ArrowLeft, Sparkles, Star } from 'lucide-react';
import { getProducts, toggleLike } from '../services/productService';
import { getRecommendations } from '../services/recommendationService';
import { motion } from 'framer-motion';

const Marketplace = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [recommendations, setRecommendations] = useState([]);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInDown = {
    hidden: { opacity: 0, y: -60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
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
    fetchProducts();
    if (userInfo) {
      fetchRecommendations();
    }
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (selectedCategory !== 'all') filters.category = selectedCategory;
      if (searchTerm) filters.search = searchTerm;

      const data = await getProducts(filters);
      let productsData = data.data || [];

      // Sort products
      if (sortBy === 'price_low') {
        productsData.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_high') {
        productsData.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'popular') {
        productsData.sort((a, b) => b.likesCount - a.likesCount);
      }

      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const data = await getRecommendations(userInfo.token);
      setRecommendations(data.data?.map(p => p._id) || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleLike = async (productId) => {
    if (!userInfo) {
      alert('Please login to like products');
      return;
    }

    try {
      const data = await toggleLike(productId, userInfo.token);
      setProducts(prev => prev.map(p => 
        p._id === productId 
          ? { ...p, likesCount: data.likesCount, likes: data.liked ? [...(p.likes || []), userInfo._id] : (p.likes || []).filter(id => id !== userInfo._id) }
          : p
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const isRecommended = (productId) => {
    return recommendations.includes(productId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Animated Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="text-[#783be8] hover:text-purple-700 transition p-2 rounded-lg hover:bg-purple-50"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ShoppingCart className="w-8 h-8 text-[#783be8]" />
                </motion.div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-pink-600 bg-clip-text text-transparent">
                  Marketplace
                </h1>
              </div>
            </div>
            <motion.div 
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-5 h-5 text-[#783be8]" />
              <span className="text-sm font-semibold text-gray-700">Handcrafted Treasures</span>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-100"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition-all outline-none text-sm sm:text-base"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition-all bg-white outline-none appearance-none cursor-pointer text-sm sm:text-base font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition-all bg-white outline-none appearance-none cursor-pointer text-sm sm:text-base font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </form>

          <motion.div 
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-700 text-sm font-medium">
              <span className="font-extrabold text-[#783be8] text-xl">{products.length}</span>
              <span className="ml-2">products available</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-16 h-16 border-4 border-[#783be8] border-t-transparent rounded-full"></div>
              </motion.div>
            </motion.div>
            <motion.p 
              className="mt-6 text-gray-600 text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Loading products...
            </motion.p>
          </div>
        ) : products.length === 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-12 sm:p-16 text-center border border-gray-100"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ShoppingCart className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">No products found</h3>
            <p className="text-gray-600 text-base sm:text-lg">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                variants={scaleIn}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:border-[#783be8] transition-all"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-200 overflow-hidden group">
                  {/* Strongly Recommended Badge */}
                  {isRecommended(product._id) && (
                    <motion.div 
                      className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 flex items-center gap-1 shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                    >
                      <Star className="w-3 h-3" fill="currentColor" />
                      Recommended
                    </motion.div>
                  )}

                  {product.media && product.media.length > 0 ? (
                    product.media[0].type === 'image' ? (
                      <img
                        src={product.media[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onClick={() => navigate(`/product/${product._id}`)}
                      />
                    ) : (
                      <video
                        src={product.media[0].url}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onClick={() => navigate(`/product/${product._id}`)}
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <Sparkles className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {/* Like Button */}
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(product._id)}
                    className={`absolute top-2 right-2 p-2.5 rounded-full shadow-lg transition-all ${
                      product.likes?.includes(userInfo?._id)
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-pink-600 hover:text-white'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={product.likes?.includes(userInfo?._id) ? 'currentColor' : 'none'} />
                  </motion.button>

                  {/* Stock Badge */}
                  {product.stock === 0 && (
                    <motion.div 
                      className="absolute bottom-2 left-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Out of Stock
                    </motion.div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-5" onClick={() => navigate(`/product/${product._id}`)}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 line-clamp-1 flex-1">
                      {product.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <motion.span 
                      className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-[#783be8] px-3 py-1.5 rounded-full font-bold shadow-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      {formatCategory(product.category)}
                    </motion.span>
                    <span className="text-xs text-gray-500 font-semibold">
                      By {product.artisan?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-[#783be8] bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{product.stock} in stock</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="font-bold">{product.likesCount || 0}</span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product._id}`);
                    }}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {product.stock === 0 ? 'Out of Stock' : 'View Details'}
                    {product.stock > 0 && (
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;
