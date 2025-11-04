import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Search, Filter, Package, MapPin, Sparkles } from 'lucide-react';
import { getArtisanOrders, updateOrderStatus } from '../services/orderService';
import { motion } from 'framer-motion';

const ArtisanOrders = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getArtisanOrders(userInfo.token);
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, userInfo.token);
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      alert('Order status updated successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-white shadow-xl border-b-4 border-[#783be8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-20">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/artisan-dashboard')}
              className="text-[#783be8] hover:text-purple-700 transition"
            >
              <ArrowLeft className="w-7 h-7" />
            </motion.button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/artisan-dashboard')}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Package className="w-8 h-8 text-[#783be8]" />
              </motion.div>
              <motion.h1 
                className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-transparent bg-clip-text"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CraftConnect
              </motion.h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100"
          >
            <p className="text-sm text-gray-600 mb-1 font-semibold">Total Orders</p>
            <p className="text-4xl font-extrabold text-[#783be8]">{orders.length}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-100"
          >
            <p className="text-sm text-gray-600 mb-1 font-semibold">Pending Orders</p>
            <p className="text-4xl font-extrabold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-100"
          >
            <p className="text-sm text-gray-600 mb-1 font-semibold">Total Revenue</p>
            <p className="text-4xl font-extrabold text-green-600">{formatPrice(totalRevenue)}</p>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-purple-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#783be8] w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#783be8] w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] bg-white appearance-none transition font-medium"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] bg-white appearance-none transition font-medium"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 font-semibold">
            Showing <span className="text-[#783be8]">{filteredOrders.length}</span> of <span className="text-[#783be8]">{orders.length}</span> orders
          </div>
        </motion.div>

        {/* Table */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-xl border-2 border-purple-100"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#783be8] border-t-transparent rounded-full mx-auto"
            />
            <p className="mt-4 text-gray-700 font-semibold">Loading orders...</p>
          </motion.div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-16 text-center border-2 border-purple-100"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            </motion.div>
            <p className="text-gray-500 text-xl font-bold">No orders found</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-100"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-200">
                <thead className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-100">
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(243, 232, 255, 0.3)" }}
                      className="hover:shadow-md transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {order.product?.media?.[0] && (
                            <div className="h-12 w-12 flex-shrink-0">
                              <img
                                className="h-12 w-12 rounded-xl object-cover border-2 border-purple-200 shadow-md"
                                src={order.product.media[0].url}
                                alt={order.product.title}
                              />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">
                              {order.product?.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{order.buyer?.name}</div>
                        <div className="text-sm text-gray-500 font-medium">{order.buyer?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">{order.quantity}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-extrabold text-[#783be8]">
                          {formatPrice(order.totalPrice)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 font-medium">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-1 text-sm text-gray-900">
                          <MapPin className="w-4 h-4 text-[#783be8] mt-0.5 flex-shrink-0" />
                          <div className="max-w-xs font-medium">
                            {order.shippingAddress?.street && (
                              <div>{order.shippingAddress.street}</div>
                            )}
                            {order.shippingAddress?.city && order.shippingAddress?.state && (
                              <div>{order.shippingAddress.city}, {order.shippingAddress.state}</div>
                            )}
                            {order.shippingAddress?.pincode && (
                              <div>{order.shippingAddress.pincode}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-extrabold rounded-full border-2 ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="text-sm border-2 border-purple-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] font-medium transition"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ArtisanOrders;
