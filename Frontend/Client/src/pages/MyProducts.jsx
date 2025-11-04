import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Edit2, Trash2, Eye, Plus, Search, Filter, Sparkles, Package } from 'lucide-react';
import { getProducts, deleteProduct } from '../services/productService';
import { motion } from 'framer-motion';

const MyProducts = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ artisan: userInfo._id });
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id, userInfo.token);
      setProducts(prev => prev.filter(p => p._id !== id));
      alert('Product deleted successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.isActive) ||
                         (filterStatus === 'inactive' && !product.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-white shadow-xl border-b-4 border-[#783be8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
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
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(120, 59, 232, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create-product')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-[#783be8] text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-bold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </motion.button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-purple-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#783be8] w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition font-medium"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#783be8] w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] bg-white appearance-none transition font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] bg-white appearance-none transition font-medium"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 font-semibold">
            Showing <span className="text-[#783be8]">{filteredProducts.length}</span> of <span className="text-[#783be8]">{products.length}</span> products
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
            <p className="mt-4 text-gray-700 font-semibold">Loading products...</p>
          </motion.div>
        ) : filteredProducts.length === 0 ? (
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
            <p className="text-gray-500 text-xl font-bold">No products found</p>
            <p className="text-gray-400 mt-2">Create your first product to get started!</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Sold
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Likes
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-100">
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(243, 232, 255, 0.3)" }}
                      className="hover:shadow-md transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {product.media?.[0] && (
                              <img
                                className="h-12 w-12 rounded-xl object-cover border-2 border-purple-200 shadow-md"
                                src={product.media[0].url}
                                alt={product.title}
                              />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900 line-clamp-1">
                              {product.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1 font-medium">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 font-semibold">{formatCategory(product.category)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-extrabold text-[#783be8]">{formatPrice(product.price)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-bold ${product.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 font-semibold">{product.sold || 0}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 font-semibold">{product.likesCount || 0}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.isActive ? (
                          <span className="px-3 py-1.5 inline-flex text-xs leading-5 font-extrabold rounded-full bg-green-100 text-green-800 border-2 border-green-200">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 inline-flex text-xs leading-5 font-extrabold rounded-full bg-gray-100 text-gray-800 border-2 border-gray-200">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/product/${product._id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/edit-product/${product._id}`)}
                            className="text-[#783be8] hover:text-purple-900"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
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

export default MyProducts;
