import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';
import { ShoppingBag, Heart, Package, CreditCard, User, LogOut, Users, BookOpen, Calendar, HandHeart, UserCircle, Menu, ChevronDown, X, ArrowRight, Sparkles, FileText, Award } from 'lucide-react';
import { getMyDonations } from '../services/donationService';
import { useEffect, useState } from 'react';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [donationStats, setDonationStats] = useState({ count: 0, total: 0 });
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

  const dashboardSections = [
    {
      id: 'explore-artists',
      title: 'Explore Artists',
      description: 'Discover talented artisans and their unique crafts. Connect with creative minds, explore diverse art forms, and support local talent.',
      icon: Users,
      gradient: 'from-purple-600 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
      route: '/explore-artists',
      imagePosition: 'left'
    },
    {
      id: 'marketplace',
      title: 'Browse Products',
      description: 'Explore a curated collection of handcrafted products. From traditional art to contemporary designs, find unique pieces that tell a story.',
      icon: ShoppingBag,
      gradient: 'from-teal-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      route: '/marketplace',
      imagePosition: 'right'
    },
    {
      id: 'arts-stories',
      title: 'Arts & Stories',
      description: 'Dive into the rich history and stories behind traditional crafts. Learn about cultural heritage and artistic journeys that inspire.',
      icon: BookOpen,
      gradient: 'from-indigo-600 to-purple-600',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
      route: '/arts-and-stories',
      imagePosition: 'left'
    },
    {
      id: 'workshops',
      title: 'Join Workshops',
      description: 'Participate in hands-on art workshops. Learn traditional techniques, develop new skills, and create your own masterpieces.',
      icon: Calendar,
      gradient: 'from-purple-600 to-pink-600',
      image: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800',
      route: '/workshops',
      imagePosition: 'right'
    },
    {
      id: 'my-orders',
      title: 'My Orders',
      description: 'Track your purchases and order history. Stay updated on delivery status and manage your artisan product collection.',
      icon: Package,
      gradient: 'from-blue-600 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      route: '/my-orders',
      imagePosition: 'left'
    },
    {
      id: 'ngos',
      title: 'Support NGOs',
      description: 'Make a difference by supporting NGOs dedicated to preserving traditional crafts. Your contributions help artisans thrive.',
      icon: HandHeart,
      gradient: 'from-green-600 to-teal-600',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      route: '/ngos',
      imagePosition: 'right'
    },
    {
      id: 'my-donations',
      title: 'My Donations',
      description: 'View your donation history and track the impact you\'ve made. See how your support is helping preserve traditional arts.',
      icon: Heart,
      gradient: 'from-pink-600 to-rose-600',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
      route: '/my-donations',
      imagePosition: 'left'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/user-dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Package className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                CraftConnect
              </h1>
            </motion.div>
            <div className="flex items-center gap-3">
              {/* Desktop Quick Nav Dropdown */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setShowQuickNav(!showQuickNav)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition font-semibold border border-white/30"
                >
                  <Menu className="w-5 h-5" />
                  <span>Quick Access</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showQuickNav ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
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
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${section.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
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
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition border border-white/30"
              >
                <Menu className="w-5 h-5" />
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/user-profile')}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center gap-2"
              >
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">My Profile</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Quick Nav Dropdown */}
          {showQuickNav && (
            <div className="lg:hidden bg-white/95 backdrop-blur-sm border-t border-white/20">
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
                        className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-lg transition text-left shadow-sm"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${section.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
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
      <div className="pt-16">
        {/* Welcome Section - First */}
        <section className="w-full bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              {/* Welcome Card */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 mb-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Welcome, {userInfo?.name}!</h2>
                <p className="text-gray-600 text-base md:text-lg">Explore the world of traditional crafts and support artisan communities</p>
              </motion.div>

              {/* Quick Stats Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div 
                  variants={fadeInUp}
                  className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-5 text-white shadow-lg"
                >
                  <Users className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-sm opacity-90 mb-1">Artisans Connected</p>
                  <p className="text-3xl font-bold">150+</p>
                </motion.div>
                <motion.div 
                  variants={fadeInUp}
                  className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl p-5 text-white shadow-lg"
                >
                  <ShoppingBag className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-sm opacity-90 mb-1">Products Available</p>
                  <p className="text-3xl font-bold">500+</p>
                </motion.div>
                <motion.div 
                  variants={fadeInUp}
                  className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-5 text-white shadow-lg"
                >
                  <Heart className="w-8 h-8 mb-2 opacity-80" fill="currentColor" />
                  <p className="text-sm opacity-90 mb-1">Your Donations</p>
                  <p className="text-3xl font-bold">₹{donationStats.total || 0}</p>
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

      {/* Chatbot */}
      <Chatbot />

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

export default UserDashboard;