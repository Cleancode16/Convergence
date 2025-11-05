import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, TrendingUp, ShoppingCart, Package, DollarSign, Calendar, Download, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSalesAnalytics, getProductAnalytics } from '../services/analyticsService';
import { getProducts } from '../services/productService';

const Analytics = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [period, setPeriod] = useState('daily');
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productAnalytics, setProductAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productError, setProductError] = useState(null);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      navigate('/login');
      return;
    }
    fetchAnalytics();
  }, [period, userInfo, navigate]);

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      return;
    }
    fetchProducts();
  }, [userInfo]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSalesAnalytics(period, userInfo.token);
      
      if (!data || !data.data) {
        setError('No analytics data available');
        setAnalytics(null);
        return;
      }
      
      setAnalytics(data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.response?.data?.message || 'Failed to load analytics data. Please try again.');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts({ artisan: userInfo._id });
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchProductAnalytics = async (productId) => {
    try {
      setProductLoading(true);
      setProductError(null);
      const data = await getProductAnalytics(productId, userInfo.token);
      
      if (!data || !data.data) {
        setProductError('No analytics data available for this product');
        setProductAnalytics(null);
        return;
      }
      
      setProductAnalytics(data.data);
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      setProductError(error.response?.data?.message || 'Failed to load product analytics');
      setProductAnalytics(null);
    } finally {
      setProductLoading(false);
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
    setProductError(null);
    if (productId) {
      fetchProductAnalytics(productId);
    } else {
      setProductAnalytics(null);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => {
            const name = entry.name || '';
            const isRevenue = typeof name === 'string' && name.includes('Revenue');
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {name}: {isRevenue ? formatCurrency(entry.value) : entry.value}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const ErrorState = ({ message, onRetry }) => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Analytics</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-4 justify-center">
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl font-semibold"
          >
            Retry
          </motion.button>
          <motion.button
            onClick={() => navigate('/artisan-dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="rounded-full h-16 w-16 border-4 border-[#783be8] border-t-transparent mx-auto mb-4"
          />
          <p className="text-lg text-gray-700 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAnalytics} />;
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analytics Data</h2>
          <p className="text-gray-600 mb-6">
            You don't have any sales data yet. Start selling to see your analytics here!
          </p>
          <motion.button
            onClick={() => navigate('/artisan-dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl font-semibold"
          >
            Go to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <nav className="bg-white shadow-lg border-b-4 border-[#783be8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate('/artisan-dashboard')}
                className="text-[#783be8] hover:text-purple-700 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
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
                  <Sparkles className="w-8 h-8 text-[#783be8]" />
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
            <motion.button
              onClick={() => window.print()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:shadow-lg transition font-semibold"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-purple-100"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#783be8]" />
              <h2 className="text-lg font-bold text-gray-900">Time Period</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['daily', 'weekly', 'monthly'].map((p) => (
                <motion.button
                  key={p}
                  onClick={() => setPeriod(p)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl font-semibold transition ${
                    period === p
                      ? 'bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-[#783be8]'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {analytics?.summary && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-gradient-to-br from-indigo-500 via-[#783be8] to-purple-600 rounded-2xl shadow-xl p-6 text-white border-2 border-purple-200"
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 opacity-90" />
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Total Revenue</h3>
              <p className="text-3xl font-extrabold">{formatCurrency(analytics.summary.totalRevenue)}</p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white border-2 border-green-200"
            >
              <div className="flex items-center justify-between mb-2">
                <ShoppingCart className="w-8 h-8 opacity-90" />
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Total Orders</h3>
              <p className="text-3xl font-extrabold">{analytics.summary.totalOrders}</p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-xl p-6 text-white border-2 border-pink-200"
            >
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 opacity-90" />
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Items Sold</h3>
              <p className="text-3xl font-extrabold">{analytics.summary.totalQuantity}</p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-xl p-6 text-white border-2 border-orange-200"
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 opacity-90" />
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Avg Order Value</h3>
              <p className="text-3xl font-extrabold">{formatCurrency(analytics.summary.averageOrderValue)}</p>
            </motion.div>
          </motion.div>
        )}

        {analytics?.timeSeriesData && analytics.timeSeriesData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-purple-100"
          >
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent mb-6">
              Revenue Trend
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analytics.timeSeriesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#783be8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#783be8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#783be8" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  name="Revenue (₹)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {analytics?.timeSeriesData && analytics.timeSeriesData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-purple-100"
          >
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent mb-6">
              Orders & Quantity Sold
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analytics.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 5 }}
                  name="Orders"
                />
                <Line 
                  type="monotone" 
                  dataKey="quantity" 
                  stroke="#783be8" 
                  strokeWidth={3}
                  dot={{ fill: '#783be8', r: 5 }}
                  name="Quantity"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {analytics?.topProducts && analytics.topProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products by Revenue</h2>
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={analytics.topProducts.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ product, percent }) => `${product?.title?.substring(0, 20) || 'Product'}... (${(percent * 100).toFixed(1)}%)`}
                  outerRadius={180}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {analytics.topProducts.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => `${entry.payload.product?.title || 'Product'}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Product-Specific Analysis</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Product
            </label>
            <select
              value={selectedProduct || ''}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={products.length === 0}
            >
              <option value="">-- Choose a product --</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title}
                </option>
              ))}
            </select>
            {products.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No products available</p>
            )}
          </div>

          {productLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          )}

          {productError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{productError}</p>
            </div>
          )}

          {productAnalytics && !productLoading && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(productAnalytics.summary?.totalRevenue)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-green-600">
                    {productAnalytics.summary?.totalOrders || 0}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Units Sold</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {productAnalytics.summary?.totalQuantity || 0}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(productAnalytics.summary?.averageOrderValue)}
                  </p>
                </div>
              </div>

              {productAnalytics.dailySales && productAnalytics.dailySales.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">30-Day Sales Trend</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={productAnalytics.dailySales}>
                      <defs>
                        <linearGradient id="productRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10B981" 
                        fillOpacity={1} 
                        fill="url(#productRevenue)" 
                        name="Revenue (₹)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="quantity" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        dot={{ fill: '#8B5CF6', r: 3 }}
                        name="Quantity"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          )}

          {!selectedProduct && !productLoading && !productError && (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a product to view detailed analytics</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;