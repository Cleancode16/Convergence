import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';
import { ShoppingBag, Heart, Package, CreditCard, User, LogOut, Users, BookOpen, Calendar, HandHeart, UserCircle } from 'lucide-react';
import { getMyDonations } from '../services/donationService';
import { useEffect, useState } from 'react';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [donationStats, setDonationStats] = useState({ count: 0, total: 0 });

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

  useEffect(() => {
    if (userInfo) {
      fetchDonationStats();
    }
  }, [userInfo]);

  const fetchDonationStats = async () => {
    try {
      const data = await getMyDonations(userInfo.token);
      setDonationStats({
        count: data.count || 0,
        total: data.totalDonated || 0,
      });
    } catch (error) {
      console.error('Error fetching donation stats:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-white">User Dashboard</h1>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/user-profile')}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center gap-2"
              >
                <UserCircle className="w-4 h-4" />
                My Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900">Welcome, {userInfo?.name}!</h2>
        </motion.div>

        {/* Dashboard Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            onClick={() => navigate('/explore-artists')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-purple-200"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Explore Artists</h3>
            <p className="text-gray-600 text-sm">Discover talented artisans</p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            onClick={() => navigate('/marketplace')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-teal-200"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Products</h3>
            <p className="text-gray-600 text-sm">Explore artisan crafts</p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            onClick={() => navigate('/arts-and-stories')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-indigo-200"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Arts & Stories</h3>
            <p className="text-gray-600 text-sm">Discover art history</p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            onClick={() => navigate('/workshops')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-purple-200"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Workshops</h3>
            <p className="text-gray-600 text-sm">Join hands-on art workshops</p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            onClick={() => navigate('/my-orders')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-blue-200"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">My Orders</h3>
            <p className="text-gray-600 text-sm">Track your purchases</p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            onClick={() => navigate('/ngos')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-green-200"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 shadow-lg">
              <HandHeart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Support NGOs</h3>
            <p className="text-gray-600 text-sm">Donate to causes you care about</p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            onClick={() => navigate('/my-donations')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-pink-200"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">My Donations</h3>
            <p className="text-gray-600 text-sm">View your donation history</p>
          </motion.div>
        </motion.div>
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default UserDashboard;
