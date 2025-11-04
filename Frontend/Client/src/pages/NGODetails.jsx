import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Target, TrendingUp, Users, Mail, Phone, Globe, Calendar, X, Sparkles, HandHeart, Zap, Activity, Eye } from 'lucide-react';
import { getNGODetails, createDonation } from '../services/donationService';
import generateNGOInsights from '../utils/ngoAIDescriptions';

const NGODetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [ngo, setNgo] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [donating, setDonating] = useState(false);

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
    fetchNGODetails();
  }, [id]);

  const fetchNGODetails = async () => {
    try {
      setLoading(true);
      const data = await getNGODetails(id);
      console.log('NGO Details:', data); // Debug log
      setNgo(data.data);
      
      // Generate AI insights
      if (data.data) {
        const insights = generateNGOInsights(data.data);
        setAiInsights(insights);
      }
    } catch (error) {
      console.error('Error fetching NGO details:', error);
      alert('Failed to load NGO details: ' + error.message);
      navigate('/ngos'); // Redirect back to NGOs list
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!userInfo) {
      alert('Please login to donate');
      navigate('/signin');
      return;
    }

    if (!donationAmount || donationAmount < 1) {
      alert('Please enter a valid donation amount (minimum ₹1)');
      return;
    }

    try {
      setDonating(true);
      await createDonation(
        {
          ngoId: id,
          amount: Number(donationAmount),
          message: donationMessage,
        },
        userInfo.token
      );
      alert('Thank you for your donation! 🙏');
      setShowDonateModal(false);
      setDonationAmount('');
      setDonationMessage('');
      fetchNGODetails();
    } catch (error) {
      alert(error.message);
    } finally {
      setDonating(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

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
          <p className="mt-4 text-gray-600 font-medium">Loading NGO details...</p>
        </motion.div>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4 font-semibold">NGO not found</p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/ngos')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-bold shadow-lg"
          >
            Back to NGOs
          </motion.button>
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
                  <HandHeart className="w-8 h-8 text-[#783be8]" fill="currentColor" />
                </motion.div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-pink-600 bg-clip-text text-transparent">
                  NGO Details
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
              <span className="text-sm font-semibold text-gray-700">Support a Cause</span>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {/* NGO Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">
            <motion.div 
              className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6 relative z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Users className="w-10 h-10 sm:w-12 sm:h-12" />
              </motion.div>
              <div className="flex-1">
                <motion.h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {ngo.profile?.organizationName || ngo.name}
                </motion.h1>
                <motion.p 
                  className="text-indigo-100 text-base sm:text-lg font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Registered NGO • Making a Difference
                </motion.p>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 relative z-10"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg"
                variants={scaleIn}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <Target className="w-6 h-6 sm:w-7 sm:h-7 mb-3 text-white" />
                <p className="text-sm text-indigo-100 mb-1 font-medium">Total Funds Raised</p>
                <p className="text-2xl sm:text-3xl font-extrabold">₹{ngo.profile?.totalFundsRaised?.toLocaleString() || 0}</p>
              </motion.div>
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg"
                variants={scaleIn}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 mb-3 text-white" />
                <p className="text-sm text-indigo-100 mb-1 font-medium">Total Donors</p>
                <p className="text-2xl sm:text-3xl font-extrabold">{ngo.profile?.donorsCount || 0}</p>
              </motion.div>
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg"
                variants={scaleIn}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 mb-3 text-white" />
                <p className="text-sm text-indigo-100 mb-1 font-medium">Established</p>
                <p className="text-2xl sm:text-3xl font-extrabold">{ngo.profile?.yearEstablished || 'N/A'}</p>
              </motion.div>
            </motion.div>
          </div>

          {/* NGO Details */}
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Mission */}
            {ngo.profile?.mission && (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-[#783be8]" />
                  <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                    Our Mission
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">{ngo.profile.mission}</p>
              </motion.div>
            )}

            {/* Description */}
            {ngo.profile?.description && (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">About Us</h2>
                <p className="text-gray-700 leading-relaxed text-base">{ngo.profile.description}</p>
              </motion.div>
            )}

            {/* AI-Powered NGO Insights */}
            {aiInsights && (
              <>
                {/* AI Description */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                      AI-Powered Insights
                    </h2>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5 text-[#783be8]" />
                    </motion.div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                      {aiInsights.description}
                    </p>
                  </div>
                </motion.div>

                {/* Key Activities */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-6 h-6 text-[#783be8]" />
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      Key Activities & Programs
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiInsights.activities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-start gap-3 p-4 bg-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-600 to-[#783be8] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700 text-sm sm:text-base">{activity}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Impact Metrics */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-[#783be8]" />
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      Impact & Reach
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {aiInsights.impact.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.55 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-5 border-2 border-purple-100 shadow-sm hover:shadow-lg transition text-center"
                      >
                        <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent mb-2">
                          {item.value}
                        </p>
                        <p className="text-sm font-bold text-gray-900 mb-1">{item.metric}</p>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Organizational Strengths */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-[#783be8]" />
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      Organizational Strengths
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {aiInsights.strengths.map((strength, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        className="flex items-start gap-4 p-5 bg-gradient-to-br from-white to-indigo-50 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition"
                      >
                        <div className="text-3xl flex-shrink-0">{strength.icon}</div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{strength.title}</h3>
                          <p className="text-sm text-gray-600">{strength.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Future Vision */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-6 h-6 text-[#783be8]" />
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      Future Vision
                    </h2>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                    <p className="text-base sm:text-lg leading-relaxed">
                      {aiInsights.vision}
                    </p>
                  </div>
                </motion.div>
              </>
            )}

            {/* Focus Areas */}
            {ngo.profile?.focusAreas && ngo.profile.focusAreas.length > 0 && (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">Focus Areas</h2>
                <div className="flex flex-wrap gap-3">
                  {ngo.profile.focusAreas.map((area, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-[#783be8] rounded-full font-bold text-sm shadow-sm"
                    >
                      {area}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contact Information */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div 
                  className="flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-purple-100 shadow-sm"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(120, 59, 232, 0.2)" }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-[#783be8] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                    <p className="font-bold text-gray-900 truncate">{ngo.email}</p>
                  </div>
                </motion.div>
                {ngo.profile?.phoneNumber && (
                  <motion.div 
                    className="flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-pink-100 shadow-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(120, 59, 232, 0.2)" }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-semibold mb-1">Phone</p>
                      <p className="font-bold text-gray-900">{ngo.profile.phoneNumber}</p>
                    </div>
                  </motion.div>
                )}
                {ngo.profile?.website && (
                  <motion.div 
                    className="flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(120, 59, 232, 0.2)" }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 font-semibold mb-1">Website</p>
                      <a
                        href={ngo.profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#783be8] hover:text-purple-700 truncate block"
                      >
                        Visit Website →
                      </a>
                    </div>
                  </motion.div>
                )}
                {ngo.profile?.registrationNumber && (
                  <motion.div 
                    className="flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100 shadow-sm"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(120, 59, 232, 0.2)" }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 font-semibold mb-1">Registration Number</p>
                      <p className="font-bold text-gray-900 truncate">{ngo.profile.registrationNumber}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Recent Donations */}
            {ngo.recentDonations && ngo.recentDonations.length > 0 && (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">Recent Supporters</h2>
                <motion.div 
                  className="space-y-3"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  {ngo.recentDonations.map((donation, index) => (
                    <motion.div 
                      key={donation._id} 
                      className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm"
                      variants={scaleIn}
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Heart className="w-6 h-6 text-white" fill="currentColor" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{donation.donor?.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="font-extrabold text-[#783be8] text-lg sm:text-xl flex-shrink-0">₹{donation.amount.toLocaleString()}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Donate Button */}
            <motion.div 
              className="sticky bottom-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(120, 59, 232, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDonateModal(true)}
                className="w-full py-4 sm:py-5 px-6 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-bold text-lg shadow-2xl flex items-center justify-center gap-3"
              >
                <Heart className="w-6 h-6" fill="currentColor" />
                Donate Now
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Donation Modal */}
      {showDonateModal && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                <Heart className="w-7 h-7 text-[#783be8]" fill="currentColor" />
                Make a Donation
              </h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDonateModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-6 text-base">
                Support <span className="font-extrabold text-[#783be8]">{ngo.profile?.organizationName || ngo.name}</span> in their mission
              </p>

              {/* Quick Amounts */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {quickAmounts.map((amount) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDonationAmount(amount.toString())}
                    className={`py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-bold transition shadow-sm ${
                      donationAmount === amount.toString()
                        ? 'bg-gradient-to-r from-indigo-600 to-[#783be8] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ₹{amount}
                  </motion.button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Custom Amount (₹)
                </label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] text-lg font-bold transition-all"
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={donationMessage}
                  onChange={(e) => setDonationMessage(e.target.value)}
                  placeholder="Leave a message of support..."
                  rows="3"
                  maxLength="500"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition-all resize-none"
                />
              </div>
            </div>

            {/* Summary */}
            {donationAmount && (
              <motion.div 
                className="mb-6 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-purple-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" }}
              >
                <p className="text-sm text-gray-700 mb-2 font-semibold">You are donating</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-[#783be8] bg-clip-text text-transparent">
                  ₹{Number(donationAmount).toLocaleString()}
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDonateModal(false)}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDonate}
                disabled={!donationAmount || donating}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {donating ? 'Processing...' : 'Donate'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default NGODetails;
