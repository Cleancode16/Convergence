import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Trash2, Plus, Minus, Search, Filter, ShoppingBag, X } from 'lucide-react';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../services/cartService';

const Cart = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtForm, setSelectedArtForm] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const artForms = [
    'Pottery', 'Weaving', 'Tanjore Paintings', 'Puppetry', 'Dokra Jewellery',
    'Meenakari', 'Kondapalli Bommalu', 'Ikkat', 'Mandala Art', 'Madhubani Painting',
    'Warli Art', 'Pattachitra', 'Kalamkari', 'Bidriware', 'Blue Pottery', 'Other'
  ].sort();

  useEffect(() => {
    if (userInfo) {
      fetchCart();
    }
  }, [userInfo]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart(userInfo.token);
      setCart(data.data || { items: [], totalAmount: 0 });
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const data = await updateCartItem(itemId, newQuantity, userInfo.token);
      setCart(data.data);
    } catch (error) {
      alert(error.message);
      fetchCart();
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!confirm('Remove this item from cart?')) return;

    try {
      const data = await removeFromCart(itemId, userInfo.token);
      setCart(data.data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Clear all items from cart?')) return;

    try {
      await clearCart(userInfo.token);
      setCart({ items: [], totalAmount: 0 });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems: cart.items, totalAmount: cart.totalAmount } });
  };

  const filteredItems = cart.items.filter(item => {
    const product = item.product;
    if (!product) return false;

    const matchesSearch = 
      (product.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesArtForm = selectedArtForm === 'all' || product.category === selectedArtForm;

    return matchesSearch && matchesArtForm;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 transition">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-7 h-7 text-white" />
                <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
              </div>
            </div>
            {cart.items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some products to get started!</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Search & Filters */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Search Bar */}
                <div className="sm:col-span-8 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search cart items..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>

                {/* Art Form Filter */}
                <div className="sm:col-span-3">
                  <select
                    value={selectedArtForm}
                    onChange={(e) => setSelectedArtForm(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="all">All Art Forms</option>
                    {artForms.map((form) => (
                      <option key={form} value={form}>{form}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {(searchTerm || selectedArtForm !== 'all') && (
                  <div className="sm:col-span-1">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedArtForm('all');
                      }}
                      className="w-full px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-700">
                <span className="font-bold text-indigo-600">{filteredItems.length}</span> item(s) in cart
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                Total: ₹{cart.totalAmount.toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <div
                        className="sm:w-48 h-48 sm:h-auto bg-gray-100 cursor-pointer overflow-hidden"
                        onClick={() => navigate(`/product/${item.product._id}`)}
                      >
                        {item.product.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : item.product.media && item.product.media.length > 0 ? (
                          <img
                            src={item.product.media[0].url}
                            alt={item.product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                              {item.product.category}
                            </span>
                            <h3
                              className="text-xl font-bold text-gray-900 mt-2 cursor-pointer hover:text-indigo-600 transition"
                              onClick={() => navigate(`/product/${item.product._id}`)}
                            >
                              {item.product.name || item.product.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {item.product.description}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              By {item.product.artisan?.name}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-lg font-semibold w-12 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-2xl font-bold text-indigo-600">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cart.items.length} items)</span>
                      <span className="font-semibold">₹{cart.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-indigo-600">₹{cart.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-bold shadow-lg text-lg"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate('/marketplace')}
                    className="w-full py-3 mt-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;
