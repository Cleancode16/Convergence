import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Search, Filter, Package, MapPin, ShoppingCart, Calendar, X } from 'lucide-react';
import { getMyOrders } from '../services/orderService';
import { motion } from 'framer-motion';

const MyOrders = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders(userInfo.token);
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.product?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === 'week' && daysDiff > 7) matchesDate = false;
      if (dateFilter === 'month' && daysDiff > 30) matchesDate = false;
      if (dateFilter === 'year' && daysDiff > 365) matchesDate = false;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'shipped': return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'delivered': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'cancelled': return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setDateFilter('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/user-dashboard')}
              className="text-gray-700 hover:text-[#783be8] transition p-2 rounded-lg hover:bg-purple-50"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShoppingCart className="w-8 h-8 text-[#783be8]" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                My Orders
              </h1>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-purple-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition outline-none"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition bg-white outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition bg-white outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterStatus !== 'all' || dateFilter !== 'all') && (
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-purple-100">
              <span className="text-sm font-semibold text-gray-700">Active Filters:</span>
              {searchTerm && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-[#783be8] rounded-full text-sm font-semibold border border-purple-200"
                >
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-purple-900">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.span>
              )}
              {filterStatus !== 'all' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-semibold border border-purple-200"
                >
                  Status: {filterStatus}
                  <button onClick={() => setFilterStatus('all')} className="hover:text-purple-900">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.span>
              )}
              {dateFilter !== 'all' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-semibold border border-purple-200"
                >
                  Date: {dateFilter}
                  <button onClick={() => setDateFilter('all')} className="hover:text-indigo-900">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.span>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="ml-auto px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition text-sm font-semibold"
              >
                Clear All
              </motion.button>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600 font-medium">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </motion.div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <div className="w-16 h-16 border-4 border-[#783be8] border-t-transparent rounded-full"></div>
            </motion.div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="bg-white rounded-2xl shadow-xl p-16 text-center border border-purple-100"
          >
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-semibold mb-2">No orders found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or make your first purchase!</p>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                variants={fadeInUp}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.15)" }}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-purple-200 transition cursor-pointer"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Product Image & Info */}
                  <div className="lg:col-span-5 flex items-center gap-4">
                    {order.product?.media?.[0] && (
                      <motion.div 
                        className="h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden shadow-md"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img
                          className="h-24 w-24 object-cover"
                          src={order.product.media[0].url}
                          alt={order.product.title}
                        />
                      </motion.div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                        {order.product?.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        By {order.artisan?.name}
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-600">Qty: <span className="font-semibold text-gray-900">{order.quantity}</span></span>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                          {formatPrice(order.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="lg:col-span-4 flex flex-col justify-center space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-[#783be8]" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {order.shippingAddress?.street && (
                          <div className="line-clamp-1">{order.shippingAddress.street}</div>
                        )}
                        {order.shippingAddress?.city && order.shippingAddress?.state && (
                          <div className="line-clamp-1">{order.shippingAddress.city}, {order.shippingAddress.state}</div>
                        )}
                        {order.shippingAddress?.pincode && (
                          <div>{order.shippingAddress.pincode}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="lg:col-span-3 flex items-center justify-center lg:justify-end">
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className={`px-5 py-2.5 inline-flex items-center text-sm font-bold rounded-xl border-2 shadow-md ${getStatusColor(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
