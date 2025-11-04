import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Package, ShoppingCart, BarChart3, Settings, LogOut, BadgeCheck, Clock, XCircle, AlertCircle, Users, Wallet, FileText, Award, Calendar, Menu, ChevronDown, ArrowRight, Sparkles, X } from 'lucide-react';
import { logout } from '../redux/actions/authActions';
import { getProfileStatus, getProfile } from '../services/artisanService';
import { getBalance } from '../services/walletService';
import { getMyWorkshops } from '../services/workshopService';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

const ArtisanDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileComplete, setProfileComplete] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [workshops, setWorkshops] = useState([]);
  const [showQuickNav, setShowQuickNav] = useState(false);
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);
  const confettiTriggered = useRef(false);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
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
        const statusData = await getProfileStatus(userInfo.token);
        if (statusData.success) {
          if (!statusData.data.profileComplete) {
            navigate('/artisan-profile-setup');
          } else {
            setProfileComplete(true);
            const profileResponse = await getProfile(userInfo.token);
            if (profileResponse.success) {
              setProfileData(profileResponse.data);
              
              if (profileResponse.data.verificationStatus === 'verified') {
                const verificationSeenKey = `verification_seen_${userInfo._id}_${profileResponse.data.verifiedAt}`;
                const hasSeenVerification = localStorage.getItem(verificationSeenKey);
                
                if (!hasSeenVerification) {
                  setShowVerificationBanner(true);
                  localStorage.setItem(verificationSeenKey, 'true');
                }

                if (!confettiTriggered.current) {
                  const hasSeenConfetti = localStorage.getItem(`confetti_${userInfo._id}`);
                  
                  if (!hasSeenConfetti) {
                    triggerConfetti();
                    localStorage.setItem(`confetti_${userInfo._id}`, 'true');
                    confettiTriggered.current = true;
                  }
                }
              }
            }

            try {
              const balanceData = await getBalance(userInfo.token);
              setWalletBalance(balanceData.data.balance || 0);
            } catch (error) {
              console.error('Error fetching wallet balance:', error);
              setWalletBalance(0);
            }
          }
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
        navigate('/artisan-profile-setup');
      } finally {
        setLoading(false);
      }
    };

    const fetchWorkshops = async () => {
      try {
        const data = await getMyWorkshops(userInfo.token);
        setWorkshops(data.data || []);
      } catch (error) {
        console.error('Error fetching workshops:', error);
      }
    };

    if (userInfo?.token) {
      checkProfileStatus();
      fetchWorkshops();
    }
  }, [userInfo, navigate]);

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
      });

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
      });
    }, 250);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  const handleProfileEdit = () => {
    navigate('/artisan-profile-setup');
  };

  const dashboardSections = [
    {
      id: 'artist-post',
      title: 'Share Your Story',
      description: 'Create captivating artist posts to showcase your journey, skills, and passion. Connect with art lovers and build your personal brand.',
      icon: FileText,
      gradient: 'from-purple-600 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
      route: '/my-artist-post',
      imagePosition: 'left'
    },
    {
      id: 'schemes',
      title: 'Government Schemes',
      description: 'Discover AI-curated government schemes tailored for artisans. Get funding, training, and support to grow your craft business.',
      icon: Award,
      gradient: 'from-amber-600 to-orange-600',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      route: '/schemes',
      imagePosition: 'right',
      badge: 'AI Powered'
    },
    {
      id: 'products',
      title: 'Manage Your Products',
      description: 'Create stunning product listings, track inventory, and showcase your handcrafted masterpieces to a global audience.',
      icon: Package,
      gradient: 'from-blue-600 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      route: '/my-products',
      imagePosition: 'left'
    },
    {
      id: 'orders',
      title: 'Your Orders Hub',
      description: 'Track orders, manage fulfillment, and provide exceptional customer service. Watch your business thrive with every sale.',
      icon: ShoppingCart,
      gradient: 'from-green-600 to-teal-600',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      route: '/artisan-orders',
      imagePosition: 'right'
    },
    {
      id: 'analytics',
      title: 'Sales Analytics',
      description: 'Dive into comprehensive sales data, track performance metrics, and make data-driven decisions to grow your craft business.',
      icon: BarChart3,
      gradient: 'from-indigo-600 to-purple-600',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      route: '/analytics',
      imagePosition: 'left'
    },
    {
      id: 'connections',
      title: 'NGO Partnerships',
      description: 'Connect with NGOs supporting traditional crafts. Access funding, mentorship, and opportunities to expand your reach.',
      icon: Users,
      gradient: 'from-teal-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      route: '/artisan-connections',
      imagePosition: 'right'
    },
    {
      id: 'workshops',
      title: 'Host Workshops',
      description: 'Share your expertise by hosting interactive workshops. Teach traditional crafts, earn income, and inspire the next generation.',
      icon: Calendar,
      gradient: 'from-purple-600 to-pink-600',
      image: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800',
      route: '/create-workshop',
      imagePosition: 'left'
    }
  ];

  const VerifiedBadge = ({ size = 24 }) => (
    <svg
      viewBox="0 0 22 22"
      width={size}
      height={size}
      aria-label="Verified"
      role="img"
      style={{ display: 'inline-block' }}
    >
      <g>
        <path
          fill="#1D9BF0"
          d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
        />
      </g>
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#783be8] border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-gray-700 font-semibold">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!profileComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-xl border-b-4 border-[#783be8] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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
                className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-transparent bg-clip-text"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CraftConnect
              </motion.h1>
              {profileData?.isExpertVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                >
                  <BadgeCheck className="w-5 h-5 fill-white" />
                  <span className="hidden sm:inline">Expert Verified</span>
                </motion.div>
              )}
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
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(120, 59, 232, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProfileEdit}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-[#783be8] text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-bold shadow-lg"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Edit Profile</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-purple-200 text-gray-700 rounded-xl hover:bg-purple-50 transition font-bold shadow-md"
              >
                <LogOut className="w-5 h-5" />
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
              {/* Verification Banner */}
              {showVerificationBanner && profileData?.verificationStatus === 'verified' && (
                <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 rounded-xl shadow-lg animate-fade-in relative">
                  <button
                    onClick={() => setShowVerificationBanner(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-start gap-4">
                    <VerifiedBadge size={28} />
                    <div>
                      <p className="text-base font-bold text-blue-900">
                        🎉 Congratulations! You are an Expert Verified Artisan
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Your profile has been verified by our admin team. This badge confirms you as a genuine and trusted artisan on our platform.
                      </p>
                      {profileData.verificationNotes && (
                        <p className="text-xs text-blue-600 mt-2 italic">
                          Admin note: {profileData.verificationNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-5 text-white shadow-lg transform hover:scale-105 transition">
                  <Package className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-sm opacity-90 mb-1">Total Products</p>
                  <p className="text-3xl font-bold">24</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-5 text-white shadow-lg transform hover:scale-105 transition">
                  <ShoppingCart className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-sm opacity-90 mb-1">Total Sales</p>
                  <p className="text-3xl font-bold">₹45,230</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-5 text-white shadow-lg transform hover:scale-105 transition">
                  <Package className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-sm opacity-90 mb-1">Pending Orders</p>
                  <p className="text-3xl font-bold">7</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl p-5 text-white shadow-lg transform hover:scale-105 transition">
                  <Wallet className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-sm opacity-90 mb-1">Wallet Balance</p>
                  <p className="text-3xl font-bold">₹{walletBalance ? walletBalance.toLocaleString('en-IN') : '0'}</p>
                </div>
              </div>

              {/* Workshops Section */}
              {workshops.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-900">Your Active Workshops</h2>
                    <button
                      onClick={() => navigate('/create-workshop')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
                    >
                      + Create Workshop
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {workshops.slice(0, 3).map((workshop) => (
                      <div
                        key={workshop._id}
                        onClick={() => navigate(`/workshop/${workshop._id}`)}
                        className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer hover:border-purple-400"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{workshop.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{workshop.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{new Date(workshop.date).toLocaleDateString()}</span>
                          <span className="font-medium text-purple-600">
                            {workshop.enrolledUsers.length}/{workshop.totalSlots} enrolled
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

export default ArtisanDashboard;