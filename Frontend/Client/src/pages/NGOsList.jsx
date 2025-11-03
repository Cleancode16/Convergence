import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Target, TrendingUp, Search, Sparkles } from 'lucide-react';
import { getAllNGOs } from '../services/donationService';
import { motion } from 'framer-motion';

const NGOsList = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-green-600 to-teal-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 transition">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="ml-4 flex items-center gap-3">
              <Heart className="w-7 h-7 text-white" fill="currentColor" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">Support NGOs</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl">
              <Heart className="w-8 h-8 text-green-600" fill="currentColor" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Make a Difference</h2>
              <p className="text-gray-600 mt-1">Support NGOs preserving traditional arts and empowering artisans</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="max-w-2xl mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search NGOs by name or mission..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition outline-none shadow-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-700 text-sm font-medium">
              <span className="font-bold text-green-600 text-lg">{filteredNGOs.length}</span> NGOs ready to receive your support
            </p>
          </div>
        </motion.div>

        {/* NGOs Grid */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full"></div>
            </motion.div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Loading NGOs...</p>
          </div>
        ) : filteredNGOs.length === 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="bg-white rounded-2xl shadow-xl p-16 text-center"
          >
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No NGOs found</h3>
            <p className="text-gray-500">Try adjusting your search</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {filteredNGOs.map((ngo) => (
              <motion.div
                key={ngo._id}
                variants={scaleIn}
                whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition cursor-pointer border-2 border-transparent hover:border-green-200"
              >
                {/* NGO Header */}
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white relative">
                  <motion.div 
                    className="flex items-center gap-4 mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                      <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold leading-tight">{ngo.profile?.organizationName || ngo.name}</h3>
                  </motion.div>
                </div>

                {/* NGO Content */}
                <div className="p-6">
                  {ngo.profile?.mission && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Mission
                      </p>
                      <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">{ngo.profile.mission}</p>
                    </div>
                  )}

                  {ngo.profile?.focusAreas && ngo.profile.focusAreas.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Focus Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {ngo.profile.focusAreas.slice(0, 3).map((area, index) => (
                          <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-teal-100 text-green-800 rounded-full text-xs font-semibold">
                            {area}
                          </span>
                        ))}
                        {ngo.profile.focusAreas.length > 3 && (
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                            +{ngo.profile.focusAreas.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-200">
                    <div className="text-center bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-3">
                      <Target className="w-5 h-5 text-green-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 font-medium mb-1">Funds Raised</p>
                      <p className="font-bold text-green-600 text-lg">₹{ngo.profile?.totalFundsRaised?.toLocaleString() || 0}</p>
                    </div>
                    <div className="text-center bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-3">
                      <TrendingUp className="w-5 h-5 text-teal-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 font-medium mb-1">Donors</p>
                      <p className="font-bold text-teal-600 text-lg">{ngo.profile?.donorsCount || 0}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/ngo/${ngo._id}`)}
                    className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5" fill="currentColor" />
                    View Details & Donate
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
