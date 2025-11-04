import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, Wallet, FileText, BookOpen, Calendar, TrendingUp, Settings, LogOut, Building2, IndianRupee, Heart, ArrowRight, Menu, ChevronDown, Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { logout } from '../redux/actions/authActions';
import { getProfileStatus } from '../services/ngoService';
import { getNGODonations } from '../services/donationService';

const NgoDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileComplete, setProfileComplete] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [donationStats, setDonationStats] = useState({
    totalAmount: 0,
    uniqueDonors: 0,
    averageDonation: 0,
  });
  const [showQuickNav, setShowQuickNav] = useState(false);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
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
    const checkProfileStatus = async () => {
      try {
        const data = await getProfileStatus(userInfo.token);
        if (data.success) {
          if (!data.data.profileComplete) {
            navigate('/ngo-profile-setup');
          } else {
            setProfileComplete(true);
            setProfile(data.data);
          }
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
        navigate('/ngo-profile-setup');
      } finally {
        setLoading(false);
      }
    };

    const fetchDonations = async () => {
      try {
        const data = await getNGODonations(userInfo.token);
        setDonations(data.data || []);
        setDonationStats(data.stats || {
          totalAmount: 0,
          uniqueDonors: 0,
          averageDonation: 0,
        });
        
        if (profile) {
          setProfile(prev => ({
            ...prev,
            totalFundsRaised: data.stats.totalAmount || 0,
            donorsCount: data.stats.uniqueDonors || 0,
          }));
        }
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
    };

    if (userInfo?.token) {
      checkProfileStatus();
      fetchDonations();
    }
  }, [userInfo, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  const handleProfileEdit = () => {
    navigate('/ngo-profile-setup');
  };

  const dashboardSections = [
    {
      id: 'browse-artisans',
      title: 'Connect with Artisans',
      description: 'Discover talented artisans across India. Build meaningful partnerships and support traditional crafts by connecting with skilled craftspeople.',
      icon: Users,
      gradient: 'from-purple-600 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
      route: '/browse-artisans',
      imagePosition: 'left'
    },
    {
      id: 'sponsors',
      title: 'Corporate Partnerships',
      description: 'Connect with corporate sponsors for CSR funding. Find companies aligned with your mission and secure funding for artisan welfare programs.',
      icon: Building2,
      gradient: 'from-blue-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800',
      route: '/ngo-sponsors',
      imagePosition: 'right'
    },
    {
      id: 'reports',
      title: 'AI-Powered Reports',
      description: 'Generate comprehensive impact reports with AI. Track your organization\'s progress, showcase achievements, and demonstrate transparency.',
      icon: FileText,
      gradient: 'from-indigo-600 to-purple-600',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      route: '/ngo-reports',
      imagePosition: 'left',
      badge: 'AI Powered'
    },
    {
      id: 'donations',
      title: 'Donation Management',
      description: 'Track and manage all donations efficiently. View donor information, donation history, and generate financial reports seamlessly.',
      icon: Wallet,
      gradient: 'from-green-600 to-teal-600',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
      route: '/ngo-donations',
      imagePosition: 'right'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <div className="w-16 h-16 border-4 border-[#783be8] border-t-transparent rounded-full"></div>
          </motion.div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profileComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/ngo-dashboard')}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-8 h-8 text-[#783be8]" fill="#783be8" />
              </motion.div>
              <motion.h1 
                className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CraftConnect
              </motion.h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Desktop Quick Nav Dropdown */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setShowQuickNav(!showQuickNav)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg hover:from-indigo-200 hover:to-purple-200 transition font-semibold border border-indigo-200"
                >
                  <Menu className="w-5 h-5" />
                  <span>Quick Access</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showQuickNav ? 'rotate-180' : ''}`} />
                </button>

                {showQuickNav && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">Navigate to:</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {dashboardSections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <button
                            key={section.id}
                            onClick={() => {
                              navigate(section.route);
                              setShowQuickNav(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition text-left border-b border-gray-100 last:border-b-0"
                          >
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${section.gradient} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900 text-sm">{section.title}</p>
                                {section.badge && (
                                  <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full">
                                    {section.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 truncate">{section.description.substring(0, 50)}...</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Quick Nav Button */}
              <button
                onClick={() => setShowQuickNav(!showQuickNav)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg hover:from-indigo-200 hover:to-purple-200 transition border border-indigo-200"
              >
                <Menu className="w-5 h-5" />
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProfileEdit}
                className="flex items-center gap-2 px-4 py-2 border-2 border-purple-300 text-[#783be8] rounded-xl hover:bg-purple-50 transition font-semibold shadow-sm"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-semibold shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Quick Nav Dropdown */}
          {showQuickNav && (
            <div className="lg:hidden bg-white border-t border-gray-200">
              <div className="max-w-7xl mx-auto px-4 py-3 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {dashboardSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          navigate(section.route);
                          setShowQuickNav(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-indigo-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition text-left"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${section.gradient} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 text-sm">{section.title}</p>
                            {section.badge && (
                              <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full">
                                {section.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{section.description.substring(0, 40)}...</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20">
        {/* Stats Overview Section - First */}
        <section className="w-full bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              {/* Welcome Section */}
              <motion.div 
                className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 mb-6 border border-purple-100"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent mb-4">
                  Welcome, {userInfo?.name}!
                </h2>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.div 
                    variants={scaleIn}
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.2)" }}
                    className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-100 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-gray-600 mb-1">Active Programs</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">12</p>
                  </motion.div>
                  <motion.div 
                    variants={scaleIn}
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.2)" }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-100 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-gray-600 mb-1">Artisans Supported</p>
                    <p className="text-3xl font-bold text-blue-600">156</p>
                  </motion.div>
                  <motion.div 
                    variants={scaleIn}
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(34, 197, 94, 0.2)" }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-100 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-gray-600 mb-1">Funds Raised</p>
                    <p className="text-3xl font-bold text-green-600">₹2.4L</p>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Donation Statistics */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(120, 59, 232, 0.3)" }}
                  className="bg-gradient-to-br from-indigo-500 via-[#783be8] to-purple-600 rounded-xl shadow-lg p-5 text-white border border-purple-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <IndianRupee className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <p className="text-white/80 text-sm font-medium mb-1">Total Funds Received</p>
                  <p className="text-2xl md:text-3xl font-bold">₹{donationStats?.totalAmount?.toLocaleString() || 0}</p>
                </motion.div>

                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(34, 197, 94, 0.3)" }}
                  className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-5 text-white border border-green-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 opacity-80" />
                    <Heart className="w-5 h-5" />
                  </div>
                  <p className="text-white/80 text-sm font-medium mb-1">Total Donors</p>
                  <p className="text-2xl md:text-3xl font-bold">{donationStats?.totalDonors || 0}</p>
                </motion.div>

                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.3)" }}
                  className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-5 text-white border border-blue-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 opacity-80" />
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <p className="text-white/80 text-sm font-medium mb-1">Average Donation</p>
                  <p className="text-2xl md:text-3xl font-bold">₹{donationStats?.averageDonation?.toFixed(0) || 0}</p>
                </motion.div>

                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(236, 72, 153, 0.3)" }}
                  className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg p-5 text-white border border-pink-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-8 h-8 opacity-80" />
                    <Heart className="w-5 h-5" />
                  </div>
                  <p className="text-white/80 text-sm font-medium mb-1">Total Donations</p>
                  <p className="text-2xl md:text-3xl font-bold">{donationStats?.totalDonations || 0}</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Sections */}
        {dashboardSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <section
              key={section.id}
              className="w-full bg-white py-8 border-t border-gray-100"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center ${section.imagePosition === 'right' ? 'lg:grid-flow-dense' : ''}`}>
                  
                  {/* Text Content */}
                  <div className={`flex flex-col justify-center space-y-4 ${section.imagePosition === 'right' ? 'lg:col-start-1' : ''}`}>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    {section.badge && (
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-100 px-3 py-1.5 rounded-full w-fit">
                        <Sparkles className="w-4 h-4" />
                        {section.badge}
                      </span>
                    )}

                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                      {section.title}
                    </h2>
                    
                    <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                      {section.description}
                    </p>

                    <button
                      onClick={() => navigate(section.route)}
                      className={`group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${section.gradient} text-white rounded-xl hover:shadow-xl transition-all duration-300 text-base font-semibold w-fit`}
                    >
                      <span>Explore Now</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Image */}
                  <div className={`relative group ${section.imagePosition === 'right' ? 'lg:col-start-2' : ''}`}>
                    <div className="relative h-[280px] lg:h-[340px] rounded-2xl overflow-hidden shadow-xl">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Click outside to close dropdown */}
      {showQuickNav && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowQuickNav(false)}
        />
      )}
    </div>
  );
};

export default NgoDashboard;