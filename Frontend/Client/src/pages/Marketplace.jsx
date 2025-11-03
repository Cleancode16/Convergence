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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-teal-600 to-blue-600 shadow-lg sticky top-0 z-50">
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
                <ShoppingCart className="w-7 h-7 text-white" />
                <h1 className="text-xl sm:text-2xl font-bold text-white">Marketplace</h1>
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
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-white outline-none appearance-none cursor-pointer"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-white outline-none appearance-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </form>

          <div className="mt-4 text-sm text-gray-600 font-medium">
            Showing {products.length} products
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full"></div>
            </motion.div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="bg-white rounded-2xl shadow-xl p-16 text-center"
          >
            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-semibold">No products found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                variants={scaleIn}
                whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition cursor-pointer border-2 border-transparent hover:border-teal-200"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  {/* Strongly Recommended Badge */}
                  {isRecommended(product._id) && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3" fill="currentColor" />
                      Recommended
                    </div>
                  )}

                  {product.media && product.media.length > 0 ? (
                    product.media[0].type === 'image' ? (
                      <img
                        src={product.media[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        onClick={() => navigate(`/product/${product._id}`)}
                      />
                    ) : (
                      <video
                        src={product.media[0].url}
                        className="w-full h-full object-cover"
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
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(product._id)}
                    className={`absolute top-2 right-2 p-2.5 rounded-full shadow-lg transition ${
                      product.likes?.includes(userInfo?._id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={product.likes?.includes(userInfo?._id) ? 'currentColor' : 'none'} />
                  </motion.button>

                  {/* Stock Badge */}
                  {product.stock === 0 && (
                    <div className="absolute bottom-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-5" onClick={() => navigate(`/product/${product._id}`)}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 flex-1">
                      {product.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 px-3 py-1 rounded-full font-semibold">
                      {formatCategory(product.category)}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      By {product.artisan?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{product.stock} in stock</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="font-medium">{product.likesCount || 0}</span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product._id}`);
                    }}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock === 0 ? 'Out of Stock' : 'View Details'}
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
