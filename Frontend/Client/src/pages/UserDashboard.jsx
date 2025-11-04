import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';
import { ShoppingBag, Heart, Package, Users, BookOpen, Calendar, HandHeart, UserCircle, LogOut, ArrowRight, Menu, ChevronDown } from 'lucide-react';
import { getMyDonations } from '../services/donationService';
import { useEffect, useState } from 'react';
import Chatbot from '../components/Chatbot';

const UserDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [donationStats, setDonationStats] = useState({ count: 0, total: 0 });
  const [showQuickNav, setShowQuickNav] = useState(false);

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

  const sections = [
    {
      id: 'explore-artists',
      title: 'Discover Talented Artisans',
      description: 'Connect with skilled craftspeople preserving India\'s rich cultural heritage. Explore their stories, artworks, and support their journey.',
      icon: Users,
      gradient: 'from-purple-600 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800',
      route: '/explore-artists',
      imagePosition: 'left'
    },
    {
      id: 'marketplace',
      title: 'Authentic Marketplace',
      description: 'Browse unique handcrafted products made with love and tradition. Every purchase supports an artisan and preserves ancient crafts.',
      icon: ShoppingBag,
      gradient: 'from-teal-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      route: '/marketplace',
      imagePosition: 'right'
    },
    {
      id: 'arts-stories',
      title: 'Arts & Cultural Stories',
      description: 'Dive into captivating stories about traditional Indian art forms. Learn the history, techniques, and cultural significance through interactive narratives.',
      icon: BookOpen,
      gradient: 'from-indigo-600 to-purple-600',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
      route: '/arts-and-stories',
      imagePosition: 'left'
    },
    {
      id: 'workshops',
      title: 'Hands-On Workshops',
      description: 'Join live workshops led by master artisans. Learn traditional techniques, create your own masterpiece, and become part of the craft community.',
      icon: Calendar,
      gradient: 'from-orange-600 to-pink-600',
      image: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800',
      route: '/workshops',
      imagePosition: 'right'
    },
    {
      id: 'my-orders',
      title: 'Your Orders & Collection',
      description: 'Track your purchases, view order history, and manage your growing collection of authentic handcrafted treasures.',
      icon: Package,
      gradient: 'from-blue-600 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800',
      route: '/my-orders',
      imagePosition: 'left'
    },
    {
      id: 'support-ngos',
      title: 'Support Noble Causes',
      description: 'Donate to NGOs working tirelessly to empower artisans and preserve traditional crafts. Your contribution makes a real difference.',
      icon: HandHeart,
      gradient: 'from-green-600 to-teal-600',
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
      route: '/ngos',
      imagePosition: 'right'
    },
    {
      id: 'my-donations',
      title: 'Your Impact',
      description: 'View your donation history and see the positive impact you\'ve made in supporting artisan communities across India.',
      icon: Heart,
      gradient: 'from-pink-600 to-rose-600',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
      route: '/my-donations',
      imagePosition: 'left'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Fixed Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome, {userInfo?.name}!
              </h1>
            </div>

            {/* Quick Navigation Menu */}
            <div className="flex items-center gap-3">
              {/* Desktop Quick Nav Dropdown */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setShowQuickNav(!showQuickNav)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg hover:from-indigo-200 hover:to-purple-200 transition font-semibold border border-indigo-200"
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
                      {sections.map((section) => {
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
                              <p className="font-semibold text-gray-900 text-sm">{section.title}</p>
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

              <button
                onClick={() => navigate('/user-profile')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
              >
                <UserCircle className="w-5 h-5" />
                <span className="hidden sm:inline">My Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Quick Nav Dropdown */}
        {showQuickNav && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-3 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 gap-2">
                {sections.map((section) => {
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
                        <p className="font-semibold text-gray-900 text-sm">{section.title}</p>
                        <p className="text-xs text-gray-500 truncate">{section.description.substring(0, 40)}...</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Full-Width Scrolling Sections */}
      <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <section
              key={section.id}
              className="snap-start min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-white pt-24"
            >
              {/* Background Gradient - Light */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-5`}></div>

              {/* Content Container */}
              <div className="relative w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 w-full ${section.imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Text Content */}
                  <div className={`flex flex-col justify-center ${section.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'} space-y-6`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                      {section.title}
                    </h2>
                    
                    <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                      {section.description}
                    </p>

                    <button
                      onClick={() => navigate(section.route)}
                      className={`group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${section.gradient} text-white rounded-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold w-fit`}
                    >
                      <span>Explore Now</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Image */}
                  <div className={`relative ${section.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'} group`}>
                    <div className="relative h-[350px] rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                    </div>
                    
                    {/* Floating Badge */}
                    <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-2xl p-4 transform group-hover:scale-105 transition-transform">
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {index + 1}/{sections.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Indicator (only on first section) */}
              {index === 0 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <div className="w-6 h-10 border-2 border-indigo-400 rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Chatbot */}
      <Chatbot />

      {/* Custom Scrollbar Styles - Light */}
      <style jsx>{`
        .snap-y {
          scroll-snap-type: y mandatory;
          scrollbar-width: thin;
          scrollbar-color: rgba(124, 58, 237, 0.3) rgba(249, 250, 251, 1);
        }
        .snap-y::-webkit-scrollbar {
          width: 8px;
        }
        .snap-y::-webkit-scrollbar-track {
          background: rgba(249, 250, 251, 1);
        }
        .snap-y::-webkit-scrollbar-thumb {
          background: rgba(124, 58, 237, 0.3);
          border-radius: 4px;
        }
        .snap-y::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 58, 237, 0.5);
        }
      `}</style>

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
