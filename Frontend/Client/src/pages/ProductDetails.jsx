import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Heart, ShoppingCart, MapPin, Package, Edit2, Trash2, Send, Star, Sparkles } from 'lucide-react';
import { getProduct, toggleLike } from '../services/productService';
import { getComments, addComment, updateComment, deleteComment } from '../services/commentService';
import { createOrder } from '../services/orderService';
import { getRecommendations, trackProductView } from '../services/recommendationService';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchComments();
    if (userInfo) {
      trackView();
      fetchRecommendations();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(id);
      setProduct(data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getComments(id);
      setComments(data.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!userInfo) {
      alert('Please login to like products');
      return;
    }

    try {
      const data = await toggleLike(id, userInfo.token);
      setProduct(prev => ({
        ...prev,
        likesCount: data.likesCount,
        likes: data.liked ? [...(prev.likes || []), userInfo._id] : (prev.likes || []).filter(uid => uid !== userInfo._id)
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      alert('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const data = await addComment(id, newComment.trim(), userInfo.token);
      setComments(prev => [data.data, ...prev]);
      setNewComment('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const data = await updateComment(commentId, editContent.trim(), userInfo.token);
      setComments(prev => prev.map(c => c._id === commentId ? data.data : c));
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment(commentId, userInfo.token);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleBuy = async () => {
    if (!userInfo) {
      alert('Please login to buy products');
      navigate('/signin');
      return;
    }

    setShowBuyModal(true);
  };

  const confirmPurchase = async () => {
    try {
      const orderData = {
        productId: id,
        quantity,
        shippingAddress
      };

      await createOrder(orderData, userInfo.token);
      alert('Order placed successfully!');
      setShowBuyModal(false);
      navigate('/user-dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  const trackView = async () => {
    try {
      await trackProductView(id, userInfo.token);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const data = await getRecommendations(userInfo.token);
      setRecommendations(data.data?.filter(p => p._id !== id) || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          className="text-center"
        >
          <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl font-semibold">Product not found</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-teal-600 to-blue-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-200 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-7 h-7 text-white" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">Product Details</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Media Gallery */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInLeft}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {product.media && product.media.length > 0 && (
                product.media[selectedMedia].type === 'image' ? (
                  <img
                    src={product.media[selectedMedia].url}
                    alt={product.title}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <video
                    src={product.media[selectedMedia].url}
                    controls
                    className="w-full h-96 object-cover"
                  />
                )
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.media && product.media.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.media.map((media, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMedia(index)}
                    className={`rounded-xl overflow-hidden border-3 transition shadow-md ${
                      selectedMedia === index ? 'border-teal-600 ring-2 ring-teal-300' : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-16 object-cover"
                      />
                    ) : (
                      <div className="w-full h-16 bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                        <span className="text-xs text-teal-600 font-semibold">Video</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInRight}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <motion.h1 
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {product.title}
              </motion.h1>

              <motion.div 
                className="flex items-center gap-4 mb-6 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-sm bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 px-4 py-2 rounded-full font-semibold shadow-sm">
                  {formatCategory(product.category)}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium">{product.likesCount || 0} likes</span>
                </div>
              </motion.div>

              <motion.div 
                className="mb-6 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-gray-600 text-sm font-medium">By {product.artisan?.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package className="w-4 h-4 text-teal-600" />
                  <span className="font-medium">{product.stock} in stock</span>
                </div>
              </motion.div>

              <motion.div 
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </span>
              </motion.div>

              <motion.div
                className="mb-6 bg-gradient-to-br from-gray-50 to-teal-50 p-4 rounded-xl border-2 border-teal-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{product.description}</p>
              </motion.div>

              {/* Quantity Selector */}
              {product.artisan?._id !== userInfo?._id && (
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 border-2 border-gray-300 rounded-xl hover:bg-teal-50 hover:border-teal-500 transition font-bold text-lg"
                    >
                      -
                    </motion.button>
                    <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-12 h-12 border-2 border-gray-300 rounded-xl hover:bg-teal-50 hover:border-teal-500 transition font-bold text-lg"
                    >
                      +
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div 
                className="flex gap-3 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {product.artisan?._id !== userInfo?._id && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                    className={`px-6 py-3 rounded-xl border-2 transition flex items-center gap-2 font-semibold shadow-md ${
                      product.likes?.includes(userInfo?._id)
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500 bg-white'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={product.likes?.includes(userInfo?._id) ? 'currentColor' : 'none'} />
                    Like
                  </motion.button>
                )}

                {product.artisan?._id !== userInfo?._id && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBuy}
                    disabled={product.stock === 0}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                  </motion.button>
                )}
                
                {product.artisan?._id === userInfo?._id && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition flex items-center justify-center gap-2 font-semibold shadow-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                    Edit Product
                  </motion.button>
                )}
              </motion.div>

              {product.artisan?._id !== userInfo?._id && (
                <motion.p 
                  className="text-lg font-semibold text-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Total: <span className="text-teal-600">{formatPrice(product.price * quantity)}</span>
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>

        {/* AI Recommendations Section */}
        {userInfo && recommendations.length > 0 && (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">You Might Also Like</h2>
                <p className="text-sm text-gray-600">AI-powered recommendations based on your preferences</p>
              </div>
            </div>

            {loadingRecommendations ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {recommendations.slice(0, 6).map((product) => (
                  <motion.div
                    key={product._id}
                    variants={scaleIn}
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group relative"
                  >
                    {/* Recommended Badge */}
                    <div className="absolute top-1 left-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center gap-1 shadow-lg">
                      <Star className="w-2.5 h-2.5" fill="currentColor" />
                      Top Pick
                    </div>

                    <div className="relative h-32 bg-gray-200">
                      {product.media && product.media.length > 0 && product.media[0].type === 'image' ? (
                        <img
                          src={product.media[0].url}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <Sparkles className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h3 className="text-xs font-semibold text-gray-900 line-clamp-1 mb-1">
                        {product.title}
                      </h3>
                      <p className="text-sm font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Comments Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          {userInfo && (
            <motion.form 
              onSubmit={handleAddComment} 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none"
                  maxLength="500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Post
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Comments List */}
          <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {comments.map((comment, index) => (
              <motion.div 
                key={comment._id} 
                className="border-b border-gray-200 pb-4 last:border-0"
                variants={fadeInUp}
              >
                {editingComment === comment._id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditComment(comment._id)}
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold"
                    >
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingComment(null);
                        setEditContent('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 font-semibold"
                    >
                      Cancel
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{comment.user?.name}</p>
                        <p className="text-gray-700 mt-2 leading-relaxed">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                          {comment.isEdited && <span className="ml-2 italic">(edited)</span>}
                        </p>
                      </div>
                      {userInfo && comment.user?._id === userInfo._id && (
                        <div className="flex gap-2 ml-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingComment(comment._id);
                              setEditContent(comment.content);
                            }}
                            className="p-2 text-gray-600 hover:text-teal-600 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteComment(comment._id)}
                            className="p-2 text-gray-600 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Buy Modal */}
      {showBuyModal && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-teal-600" />
              Shipping Address
            </h3>
            
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Street Address"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
              <input
                type="text"
                placeholder="State"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={shippingAddress.pincode}
                onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                maxLength="6"
              />
            </div>

            <div className="mb-6 p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border-2 border-teal-100">
              <p className="text-sm text-gray-600 font-semibold mb-2">Order Summary</p>
              <p className="text-xl font-bold text-gray-900 mb-1">{product.title}</p>
              <p className="text-sm text-gray-600 mb-3">Quantity: {quantity}</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Total: {formatPrice(product.price * quantity)}
              </p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBuyModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmPurchase}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 font-semibold shadow-lg"
              >
                Confirm Purchase
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetails;
