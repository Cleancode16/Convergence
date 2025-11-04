import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, Calendar, Search, HandHeart, Heart, TrendingUp, Sparkles } from 'lucide-react';
import { getMyDonations } from '../services/donationService';

const MyDonations = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalDonated, setTotalDonated] = useState(0);

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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
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
    fetchDonations();
  }, []);

  useEffect(() => {
    filterDonations();
  }, [searchTerm, donations]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await getMyDonations(userInfo.token);
      setDonations(data.data || []);
      setFilteredDonations(data.data || []);
      setTotalDonated(data.totalDonated || 0);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDonations = () => {
    if (!searchTerm.trim()) {
      setFilteredDonations(donations);
      return;
    }

    const search = searchTerm.toLowerCase();
    const filtered = donations.filter(donation => 
      donation.ngo?.name?.toLowerCase().includes(search) ||
      donation.message?.toLowerCase().includes(search) ||
      donation.amount.toString().includes(search)
    );
    setFilteredDonations(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#783be8] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your donations...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Animated Header */}
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
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className="w-8 h-8 text-[#783be8]" fill="currentColor" />
                </motion.div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-pink-600 bg-clip-text text-transparent">
                  My Donations
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
              <span className="text-sm font-semibold text-gray-700">Impact Tracker</span>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div 
            variants={scaleIn}
            whileHover={{ 
              scale: 1.05,
              rotate: [0, -2, 2, 0],
              transition: { duration: 0.3 }
            }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 cursor-pointer border border-gray-100 hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base text-gray-600 mb-2 font-medium">Total Donated</p>
                <motion.p 
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-[#783be8] bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  ₹{totalDonated.toLocaleString()}
                </motion.p>
              </div>
              <motion.div
                className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-[#783be8] rounded-2xl flex items-center justify-center shadow-lg"
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Wallet className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            variants={scaleIn}
            whileHover={{ 
              scale: 1.05,
              rotate: [0, 2, -2, 0],
              transition: { duration: 0.3 }
            }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 cursor-pointer border border-gray-100 hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base text-gray-600 mb-2 font-medium">Total Donations</p>
                <motion.p 
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {donations.length}
                </motion.p>
              </div>
              <motion.div
                className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by NGO name, message, or amount..."
              className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition-all text-sm sm:text-base"
            />
          </div>
          {searchTerm && (
            <motion.p 
              className="text-sm text-gray-500 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Found <span className="font-bold text-[#783be8]">{filteredDonations.length}</span> donation(s)
            </motion.p>
          )}
        </motion.div>

        {/* Donations List */}
        {filteredDonations.length === 0 ? (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-12 sm:p-16 text-center border border-gray-100"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
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
              <HandHeart className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              {searchTerm ? 'No matching donations' : 'No donations yet'}
            </h3>
            <p className="text-gray-600 mb-8 text-base sm:text-lg">
              {searchTerm ? 'Try adjusting your search terms' : 'Start supporting NGOs making a difference!'}
            </p>
            {!searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/ngos')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-bold text-lg shadow-lg"
              >
                Explore NGOs
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {filteredDonations.map((donation, index) => (
              <motion.div 
                key={donation._id} 
                variants={fadeInUp}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-all border border-gray-100 cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <HandHeart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        {donation.ngo?.name}
                      </h3>
                      <p className="text-sm text-gray-500">{donation.ngo?.email}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <motion.p 
                      className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-[#783be8] bg-clip-text text-transparent mb-1"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      ₹{donation.amount.toLocaleString()}
                    </motion.p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(donation.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                
                {donation.message && (
                  <motion.div 
                    className="mt-4 p-4 sm:p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-purple-100"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed">
                      <span className="text-[#783be8] font-bold">"</span>
                      {donation.message}
                      <span className="text-[#783be8] font-bold">"</span>
                    </p>
                  </motion.div>
                )}
                
                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <motion.span 
                    className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md ${
                      donation.status === 'completed'
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
                        : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    ✓ {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/ngo/${donation.ngo._id}`)}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-[#783be8] text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold text-sm shadow-lg flex items-center gap-2"
                  >
                    View NGO 
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
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

export default MyDonations;
