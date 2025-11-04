import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Award, FileText, ExternalLink, Calendar, Phone, Mail, TrendingUp, CheckCircle, AlertCircle, Sparkles, X } from 'lucide-react';
import { getSchemeRecommendations, getSchemeDetails } from '../services/schemeService';

const Schemes = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemeDetails, setSchemeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
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
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await getSchemeRecommendations(userInfo.token);
      setRecommendations(data.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSchemeClick = async (scheme) => {
    setSelectedScheme(scheme);
    setLoadingDetails(true);
    try {
      const data = await getSchemeDetails(scheme.schemeName, userInfo.token);
      setSchemeDetails(data.data);
    } catch (error) {
      console.error('Error fetching details:', error);
      alert(error.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Financial Aid': 'bg-green-100 text-green-800 border-green-300',
      'Skill Development': 'bg-blue-100 text-blue-800 border-blue-300',
      'Marketing Support': 'bg-purple-100 text-purple-800 border-purple-300',
      'Health & Welfare': 'bg-pink-100 text-pink-800 border-pink-300',
      'Education': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-20 w-20 border-4 border-[#783be8] border-t-transparent mx-auto mb-6"
          />
          <p className="text-xl text-gray-700 font-bold">Finding schemes for you...</p>
          <p className="text-sm text-gray-500 mt-3 flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-[#783be8]" />
            </motion.div>
            Analyzing your profile with AI
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-[#783be8]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/artisan-dashboard')}
                className="text-[#783be8] hover:text-purple-700 transition"
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
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Banner */}
        {recommendations && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 rounded-2xl shadow-2xl p-8 mb-10 text-white border-2 border-purple-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-10 h-10" />
              </motion.div>
              <h2 className="text-3xl font-extrabold">AI-Powered Recommendations</h2>
            </div>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div 
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              >
                <p className="text-5xl font-extrabold mb-2">{recommendations.totalSchemes}</p>
                <p className="text-sm text-purple-100 font-medium">Available Schemes</p>
              </motion.div>
              <motion.div 
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              >
                <p className="text-5xl font-extrabold mb-2">{recommendations.highPriorityCount}</p>
                <p className="text-sm text-purple-100 font-medium">High Priority</p>
              </motion.div>
              <motion.div 
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              >
                <p className="text-5xl font-extrabold mb-2">
                  {recommendations.recommendations?.filter(s => s.matchPercentage >= 90).length}
                </p>
                <p className="text-sm text-purple-100 font-medium">Perfect Match</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Schemes Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {recommendations?.recommendations?.map((scheme, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(120, 59, 232, 0.3)" }}
              onClick={() => handleSchemeClick(scheme)}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden border-2 border-purple-100"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-[#783be8] transition">
                      {scheme.schemeName}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-4 py-2 rounded-full border-2 font-bold shadow ${getCategoryColor(scheme.category)}`}>
                        {scheme.category}
                      </span>
                      {scheme.matchPercentage >= 90 && (
                        <span className="text-xs px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white border-2 border-green-300 flex items-center gap-1.5 font-bold shadow">
                          <CheckCircle className="w-4 h-4" />
                          Perfect Match
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-extrabold ${getMatchColor(scheme.matchPercentage)}`}>
                      {scheme.matchPercentage}%
                    </div>
                    <div className="text-xs text-gray-500 font-medium">Match</div>
                  </div>
                </div>

                {/* Benefits */}
                <p className="text-gray-700 text-sm mb-6 line-clamp-2 leading-relaxed">{scheme.benefits}</p>

                {/* Key Points */}
                <div className="space-y-3 mb-6">
                  {scheme.keyPoints?.slice(0, 3).map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 font-medium">{point}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t-2 border-purple-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Calendar className="w-5 h-5 text-[#783be8]" />
                    <span>{scheme.deadline}</span>
                  </div>
                  <button className="text-[#783be8] hover:text-purple-700 font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                    View Details
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Scheme Details Modal */}
      <AnimatePresence>
        {selectedScheme && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => {
              setSelectedScheme(null);
              setSchemeDetails(null);
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-200"
            >
              {loadingDetails ? (
                <div className="p-16 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-16 w-16 border-4 border-[#783be8] border-t-transparent mx-auto mb-6"
                  />
                  <p className="text-gray-600 font-semibold text-lg">Loading detailed information...</p>
                </div>
              ) : schemeDetails ? (
                <div>
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white p-8 rounded-t-2xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-3xl font-extrabold mb-3">{schemeDetails.schemeName}</h2>
                        <p className="text-purple-100 text-sm font-medium">{schemeDetails.implementingAgency}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedScheme(null);
                          setSchemeDetails(null);
                        }}
                        className="text-white hover:text-gray-200 text-3xl font-bold bg-white/20 rounded-full w-10 h-10 flex items-center justify-center"
                      >
                        <X className="w-6 h-6" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-3">
                        <FileText className="w-6 h-6 text-[#783be8]" />
                        About the Scheme
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                        {schemeDetails.fullDescription}
                      </p>
                    </div>

                    {/* Eligibility */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                      <h3 className="text-xl font-extrabold text-gray-900 mb-4">Eligibility Criteria</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(schemeDetails.eligibilityDetails || {}).map(([key, value]) => (
                          <div key={key} className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-gray-900 capitalize">{key}: </span>
                              <span className="text-gray-700 font-medium">
                                {Array.isArray(value) ? value.join(', ') : value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900 mb-4">Benefits</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(schemeDetails.benefitsDetailed || {}).map(([category, benefits]) => (
                          <div key={category} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                            <h4 className="font-bold text-green-900 mb-3 capitalize text-lg">{category}</h4>
                            <ul className="space-y-2">
                              {benefits.map((benefit, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-3 font-medium">
                                  <span className="text-green-600 text-lg">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Documents Required */}
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900 mb-4">Documents Required</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {schemeDetails.documentsRequired?.map((doc, idx) => (
                          <div key={idx} className="flex items-start gap-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-purple-200">
                            <FileText className="w-6 h-6 text-[#783be8] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-gray-900 mb-1">{doc.document}</p>
                              <p className="text-sm text-gray-600">{doc.purpose}</p>
                              {doc.mandatory && (
                                <span className="text-xs text-red-600 font-bold">* Mandatory</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Application Process */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                      <h3 className="text-xl font-extrabold text-gray-900 mb-4">How to Apply</h3>
                      <div className="space-y-6">
                        {schemeDetails.applicationProcess?.onlineSteps && (
                          <div>
                            <h4 className="font-bold text-purple-900 mb-4 text-lg">Online Application:</h4>
                            <ol className="space-y-4">
                              {schemeDetails.applicationProcess.onlineSteps.map((step, idx) => (
                                <li key={idx} className="flex gap-4">
                                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-600 to-[#783be8] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                    {idx + 1}
                                  </span>
                                  <span className="text-gray-700 font-medium pt-1">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                      <h3 className="text-xl font-extrabold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        {schemeDetails.contactDetails?.helpline && (
                          <div className="flex items-center gap-4">
                            <Phone className="w-6 h-6 text-blue-600" />
                            <span className="text-gray-700 font-semibold">{schemeDetails.contactDetails.helpline}</span>
                          </div>
                        )}
                        {schemeDetails.contactDetails?.email && (
                          <div className="flex items-center gap-4">
                            <Mail className="w-6 h-6 text-blue-600" />
                            <span className="text-gray-700 font-semibold">{schemeDetails.contactDetails.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Apply Button */}
                    {selectedScheme.applicationLink && (
                      <motion.a
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        href={selectedScheme.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-5 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white text-center rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-extrabold text-xl shadow-2xl"
                      >
                        Apply Now →
                      </motion.a>
                    )}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Schemes;
