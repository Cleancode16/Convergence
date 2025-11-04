import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, ExternalLink, Sparkles, Building2, TrendingUp, FileText, CheckCircle, Clock, Target, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllSponsors, getSponsorApproach } from '../services/sponsorService';

const NGOSponsors = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [aiGuidance, setAiGuidance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);

  // Animation variants
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
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const data = await getAllSponsors();
      setSponsors(data.data || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSponsor = (sponsor) => {
    setSelectedSponsor(sponsor);
    setAiGuidance(null);
    setShowGuidanceModal(true);
  };

  const handleGetGuidance = async () => {
    if (!selectedSponsor) return;
    
    setGuidanceLoading(true);
    
    try {
      const data = await getSponsorApproach(
        {
          sponsorName: selectedSponsor.name,
          ngoFocus: 'Artisan support and traditional crafts preservation',
          projectBudget: '5-20 Lakhs'
        },
        userInfo.token
      );
      setAiGuidance(data.data);
    } catch (error) {
      console.error('Error getting guidance:', error);
      alert('Failed to generate AI guidance. Please try again.');
    } finally {
      setGuidanceLoading(false);
    }
  };

  const closeModal = () => {
    setShowGuidanceModal(false);
    setSelectedSponsor(null);
    setAiGuidance(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg sticky top-0 z-50 border-b border-purple-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="text-[#783be8] hover:text-purple-700 transition p-2 rounded-lg hover:bg-purple-50"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Building2 className="w-8 h-8 text-[#783be8]" />
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                  Corporate Sponsors
                </h1>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 rounded-2xl shadow-2xl p-8 md:p-12 mb-8 text-white border border-purple-200 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-10 h-10 md:w-12 md:h-12" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">Top Corporate CSR Sponsors</h2>
            </div>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Discover leading Indian corporates supporting NGOs and get AI-powered guidance on how to approach them for funding
            </p>
          </div>
        </motion.div>

        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <div className="w-16 h-16 border-4 border-[#783be8] border-t-transparent rounded-full mx-auto mb-6"></div>
            </motion.div>
            <p className="text-gray-700 text-lg font-semibold">Loading sponsors...</p>
          </motion.div>
        ) : (
          <>
            {/* Sponsors Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {sponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  variants={scaleIn}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(120, 59, 232, 0.25)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100"
                >
                  {/* Sponsor Header */}
                  <div className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-5"></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-extrabold mb-2">{sponsor.name}</h3>
                      <p className="text-sm text-white/90 font-medium">{sponsor.fundingRange}</p>
                    </div>
                  </div>

                  {/* Sponsor Content */}
                  <div className="p-6">
                    <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                      {sponsor.description}
                    </p>

                    {/* Focus Areas */}
                    <div className="mb-6">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Focus Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {sponsor.focus.map((area, index) => (
                          <motion.span
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-[#783be8] rounded-full text-xs font-semibold border border-purple-200"
                          >
                            {area}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Application Period */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-purple-100">
                      <Clock className="w-4 h-4 text-[#783be8]" />
                      <span className="font-medium">Applications: {sponsor.applicationPeriod}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleViewSponsor(sponsor)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center gap-2 font-bold"
                      >
                        <Target className="w-5 h-5" />
                        View Details & AI Guide
                      </motion.button>
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-white border-2 border-[#783be8] text-[#783be8] rounded-xl hover:bg-purple-50 transition flex items-center justify-center gap-2 font-bold shadow-md"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Visit Website
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Sponsor Details & AI Guidance Modal */}
            {showGuidanceModal && selectedSponsor && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
                onClick={closeModal}
              >
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-200"
                >
                  <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 p-6 md:p-8 text-white rounded-t-2xl z-10 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Building2 className="w-8 h-8 md:w-10 md:h-10" />
                        </motion.div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-extrabold">{selectedSponsor.name}</h3>
                          <p className="text-white/90 font-medium">{selectedSponsor.fundingRange}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={closeModal}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                      >
                        <X className="w-6 h-6" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    {/* Sponsor Details */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mb-8"
                    >
                      <h4 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent mb-4">
                        About
                      </h4>
                      <p className="text-gray-700 leading-relaxed mb-6 text-base">{selectedSponsor.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200 shadow-md"
                        >
                          <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Focus Areas</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSponsor.focus.map((area, idx) => (
                              <span key={idx} className="px-3 py-1.5 bg-white text-[#783be8] rounded-full text-xs font-bold shadow-sm border border-purple-200">
                                {area}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 shadow-md"
                        >
                          <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Application Period</p>
                          <p className="text-gray-900 font-bold text-lg">{selectedSponsor.applicationPeriod}</p>
                        </motion.div>
                      </div>

                      <motion.a
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        href={selectedSponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#783be8] hover:text-purple-700 font-bold text-lg group"
                      >
                        <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Visit Official Website
                      </motion.a>
                    </motion.div>

                    {/* AI Guidance Section */}
                    {!aiGuidance ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 text-center shadow-xl"
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="inline-block mb-4"
                        >
                          <Sparkles className="w-14 h-14 text-[#783be8] mx-auto" />
                        </motion.div>
                        <h4 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent mb-3">
                          Get AI-Powered Approach Guide
                        </h4>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                          Generate a customized step-by-step strategy to approach {selectedSponsor.name} for funding
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(120, 59, 232, 0.4)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleGetGuidance}
                          disabled={guidanceLoading}
                          className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-bold text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
                        >
                          {guidanceLoading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                              />
                              Generating AI Magic...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6" />
                              Generate AI Guidance
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8 border-t-4 border-purple-200 pt-8"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-8 h-8 text-[#783be8]" />
                          </motion.div>
                          <h4 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                            AI-Powered Approach Strategy
                          </h4>
                        </div>

                        {/* Overview */}
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-l-4 border-[#783be8] shadow-md"
                        >
                          <p className="text-gray-700 leading-relaxed font-medium text-base">{aiGuidance.overview}</p>
                        </motion.div>

                        {/* Steps */}
                        <div>
                          <h5 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <Target className="w-6 h-6 text-[#783be8]" />
                            Step-by-Step Approach
                          </h5>
                          <div className="space-y-4">
                            {aiGuidance.steps.map((step, index) => (
                              <motion.div 
                                key={step.step}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(120, 59, 232, 0.3)" }}
                                className="bg-white border-2 border-purple-100 rounded-xl p-6 hover:border-[#783be8] transition-all shadow-lg"
                              >
                                <div className="flex items-start gap-4">
                                  <motion.div 
                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-full flex items-center justify-center font-extrabold text-lg shadow-lg"
                                  >
                                    {step.step}
                                  </motion.div>
                                  <div className="flex-1">
                                    <h6 className="font-bold text-gray-900 mb-3 text-lg">{step.title}</h6>
                                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">{step.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-purple-50 px-3 py-2 rounded-lg w-fit">
                                      <Clock className="w-4 h-4 text-[#783be8]" />
                                      <span className="font-semibold">{step.timeline}</span>
                                    </div>
                                    <ul className="space-y-2">
                                      {step.keyActions.map((action, idx) => (
                                        <motion.li 
                                          key={idx}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: index * 0.1 + idx * 0.05 }}
                                          className="flex items-start gap-3 text-sm text-gray-600"
                                        >
                                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                          <span>{action}</span>
                                        </motion.li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Tips */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h5 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            Pro Tips for Success
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {aiGuidance.tips.map((tip, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 shadow-md hover:shadow-xl transition-all"
                              >
                                <p className="text-sm text-gray-700 font-medium leading-relaxed">{tip}</p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Required Documents */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <h5 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-[#783be8]" />
                            Required Documents
                          </h5>
                          <ul className="space-y-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-purple-200">
                            {aiGuidance.documents.map((doc, idx) => (
                              <motion.li 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + idx * 0.05 }}
                                className="flex items-center gap-3 text-gray-700 font-medium"
                              >
                                <CheckCircle className="w-6 h-6 text-[#783be8] flex-shrink-0" />
                                <span>{doc}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>

                        {/* Timeline & Success Factors */}
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                          <motion.div 
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200 shadow-lg"
                          >
                            <h6 className="font-extrabold text-gray-900 mb-3 text-lg flex items-center gap-2">
                              <Clock className="w-5 h-5 text-orange-600" />
                              Expected Timeline
                            </h6>
                            <p className="text-sm text-gray-700 font-medium leading-relaxed">{aiGuidance.timeline}</p>
                          </motion.div>
                          <motion.div 
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 shadow-lg"
                          >
                            <h6 className="font-extrabold text-gray-900 mb-3 text-lg flex items-center gap-2">
                              <Target className="w-5 h-5 text-[#783be8]" />
                              Success Factors
                            </h6>
                            <ul className="space-y-2">
                              {aiGuidance.successFactors.map((factor, idx) => (
                                <li key={idx} className="text-sm text-gray-700 font-medium flex items-start gap-2">
                                  <span className="text-[#783be8] font-bold">•</span>
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default NGOSponsors;
