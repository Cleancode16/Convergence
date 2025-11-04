import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Target, TrendingUp, Search, Sparkles, HandHeart, Calendar } from 'lucide-react';
import { getAllNGOs } from '../services/donationService';
import { motion } from 'framer-motion';

const NGOsList = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      setLoading(true);
      const data = await getAllNGOs();
      setNgos(data.data || []);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNGOs = ngos.filter(ngo =>
    ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.profile?.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.profile?.mission?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <HandHeart className="w-8 h-8 text-[#783be8]" fill="currentColor" />
                </motion.div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-pink-600 bg-clip-text text-transparent">
                  Support NGOs
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
              <span className="text-sm font-semibold text-gray-700">Make an Impact</span>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 sm:p-8 mb-12 border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <motion.div 
              className="p-4 bg-gradient-to-r from-indigo-500 to-[#783be8] rounded-2xl shadow-lg w-fit"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" />
            </motion.div>
            <div className="flex-1">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Make a <span className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-pink-600 bg-clip-text text-transparent">Difference</span>
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-base sm:text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Support NGOs preserving traditional arts and empowering artisans across India
              </motion.p>
            </div>
          </div>
          
          {/* Search */}
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search NGOs by name or mission..."
                className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition-all outline-none shadow-sm text-sm sm:text-base"
              />
            </div>
          </motion.div>

          <motion.div 
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-700 text-sm font-medium">
              <span className="font-extrabold text-[#783be8] text-xl">{filteredNGOs.length}</span> 
              <span className="ml-2">NGOs ready to receive your support</span>
            </p>
          </motion.div>
        </motion.div>

        {/* NGOs Grid */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-16 h-16 border-4 border-[#783be8] border-t-transparent rounded-full"></div>
              </motion.div>
            </motion.div>
            <motion.p 
              className="mt-6 text-gray-600 text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Loading NGOs...
            </motion.p>
          </div>
        ) : filteredNGOs.length === 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-12 sm:p-16 text-center border border-gray-100"
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
              <Users className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              {searchTerm ? 'No NGOs found' : 'No NGOs available'}
            </h3>
            <p className="text-gray-600 text-base sm:text-lg">
              {searchTerm ? 'Try adjusting your search terms' : 'Check back later for NGO listings'}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {filteredNGOs.map((ngo, index) => (
              <motion.div
                key={ngo._id}
                variants={scaleIn}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:border-[#783be8] transition-all"
              >
                {/* NGO Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 p-6 sm:p-8 text-white relative overflow-hidden">
                  <motion.div 
                    className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div 
                    className="flex items-center gap-4 mb-3 relative z-10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div 
                      className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Users className="w-7 h-7 sm:w-8 sm:h-8" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
                      {ngo.profile?.organizationName || ngo.name}
                    </h3>
                  </motion.div>
                </div>

                {/* NGO Content */}
                <div className="p-6 sm:p-8">
                  {ngo.profile?.mission && (
                    <div className="mb-6">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#783be8]" />
                        Mission
                      </p>
                      <p className="text-gray-700 text-sm sm:text-base line-clamp-3 leading-relaxed">
                        {ngo.profile.mission}
                      </p>
                    </div>
                  )}

                  {ngo.profile?.focusAreas && ngo.profile.focusAreas.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-3">Focus Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {ngo.profile.focusAreas.slice(0, 3).map((area, idx) => (
                          <motion.span 
                            key={idx} 
                            className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-[#783be8] rounded-full text-xs font-bold shadow-sm"
                            whileHover={{ scale: 1.05 }}
                          >
                            {area}
                          </motion.span>
                        ))}
                        {ngo.profile.focusAreas.length > 3 && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-xs font-bold">
                            +{ngo.profile.focusAreas.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-gray-200">
                    <motion.div 
                      className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-purple-100"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#783be8] mx-auto mb-2" />
                      <p className="text-xs text-gray-600 font-semibold mb-1">Funds Raised</p>
                      <motion.p 
                        className="font-extrabold text-[#783be8] text-base sm:text-lg"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        ₹{ngo.profile?.totalFundsRaised?.toLocaleString() || 0}
                      </motion.p>
                    </motion.div>
                    <motion.div 
                      className="text-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 font-semibold mb-1">Donors</p>
                      <motion.p 
                        className="font-extrabold text-pink-600 text-base sm:text-lg"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        {ngo.profile?.donorsCount || 0}
                      </motion.p>
                    </motion.div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/ngo/${ngo._id}`)}
                    className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-bold text-base shadow-lg flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5" fill="currentColor" />
                    View Details & Donate
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

export default NGOsList;
