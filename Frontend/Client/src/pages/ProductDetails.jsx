import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Heart, ShoppingCart, MapPin, Package, Edit2, Trash2, Send } from 'lucide-react';
import { getProduct, toggleLike } from '../services/productService';
import { getComments, addComment, updateComment, deleteComment } from '../services/commentService';
import { createOrder } from '../services/orderService';
import { getRecommendations, trackProductView } from '../services/recommendationService';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-200 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Product Details</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media Gallery */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
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
            </div>

            {/* Thumbnails */}
            {product.media && product.media.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.media.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMedia(index)}
                    className={`rounded-lg overflow-hidden border-2 ${
                      selectedMedia === index ? 'border-teal-600' : 'border-gray-200'
                    }`}
                  >
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-16 object-cover"
                      />
                    ) : (
                      <div className="w-full h-16 bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">Video</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                  {formatCategory(product.category)}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{product.likesCount || 0} likes</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">By {product.artisan?.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package className="w-4 h-4" />
                  <span>{product.stock} in stock</span>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-teal-600">
                  {formatPrice(product.price)}
                </span>
              </div>

              <p className="text-gray-700 mb-6 whitespace-pre-wrap">{product.description}</p>

              {/* Quantity Selector - Only show if not the product owner */}
              {product.artisan?._id !== userInfo?._id && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {/* Only show like button if not the product owner */}
                {product.artisan?._id !== userInfo?._id && (
                  <button
                    onClick={handleLike}
                    className={`px-6 py-3 rounded-lg border-2 transition flex items-center gap-2 ${
                      product.likes?.includes(userInfo?._id)
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={product.likes?.includes(userInfo?._id) ? 'currentColor' : 'none'} />
                    Like
                  </button>
                )}

                {/* Only show buy button if not the product owner */}
                {product.artisan?._id !== userInfo?._id && (
                  <button
                    onClick={handleBuy}
                    disabled={product.stock === 0}
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                  </button>
                )}
                
                {/* Show edit button if owner */}
                {product.artisan?._id === userInfo?._id && (
                  <button
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-5 h-5" />
                    Edit Product
                  </button>
                )}
              </div>

              {product.artisan?._id !== userInfo?._id && (
                <p className="text-sm text-gray-500 mt-4">
                  Total: {formatPrice(product.price * quantity)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* AI Recommendations Section */}
        {userInfo && recommendations.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
                <p className="text-sm text-gray-600">AI-powered recommendations based on your preferences</p>
              </div>
            </div>

            {loadingRecommendations ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {recommendations.slice(0, 6).map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer group relative"
                  >
                    {/* Strongly Recommended Badge */}
                    <div className="absolute top-1 left-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center gap-1">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Recommended
                    </div>

                    <div className="relative h-32 bg-gray-200">
                      {product.media && product.media.length > 0 && product.media[0].type === 'image' ? (
                        <img
                          src={product.media[0].url}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h3 className="text-xs font-semibold text-gray-900 line-clamp-1 mb-1">
                        {product.title}
                      </h3>
                      <p className="text-sm font-bold text-teal-600">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>

          {/* Add Comment */}
          {userInfo && (
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  maxLength="500"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="border-b border-gray-200 pb-4">
                {editingComment === comment._id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      autoFocus
                    />
                    <button
                      onClick={() => handleEditComment(comment._id)}
                      className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingComment(null);
                        setEditContent('');
                      }}
                      className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{comment.user?.name}</p>
                        <p className="text-gray-700 mt-1">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.createdAt).toLocaleDateString()}
                          {comment.isEdited && ' (edited)'}
                        </p>
                      </div>
                      {userInfo && comment.user?._id === userInfo._id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingComment(comment._id);
                              setEditContent(comment.content);
                            }}
                            className="text-gray-600 hover:text-teal-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h3>
            
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Street Address"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="State"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={shippingAddress.pincode}
                onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                maxLength="6"
              />
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Order Summary</p>
              <p className="text-lg font-semibold">{product.title}</p>
              <p className="text-sm">Quantity: {quantity}</p>
              <p className="text-xl font-bold text-teal-600 mt-2">
                Total: {formatPrice(product.price * quantity)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBuyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
