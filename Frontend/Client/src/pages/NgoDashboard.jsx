import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, Wallet, FileText, BookOpen, Calendar, TrendingUp, Settings, LogOut, Building2, IndianRupee, Menu, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { logout } from '../redux/actions/authActions';
import { getProfileStatus } from '../services/ngoService';
import { getNGODonations } from '../services/donationService';

const NgoDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileComplete, setProfileComplete] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null); // Add this line
  const [donations, setDonations] = useState([]);
  const [donationStats, setDonationStats] = useState({
    totalAmount: 0,
    uniqueDonors: 0,
    averageDonation: 0,
  });
  const [showQuickNav, setShowQuickNav] = useState(false);

  const ngoDashboardSections = [
    {
      id: 'overview',
      title: 'NGO Impact Dashboard',
      description: 'Monitor your organization\'s impact, track donations, and view comprehensive analytics at a glance.',
      icon: TrendingUp,
      gradient: 'from-teal-600 to-green-600',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200',
      imagePosition: 'left',
      isStats: true
    },
    {
      id: 'artisans',
      title: 'Connect with Artisans',
      description: 'Browse and connect with skilled artisans. Build meaningful partnerships to support traditional crafts and empower communities.',
      icon: Users,
      gradient: 'from-blue-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200',
      route: '/browse-artisans',
      imagePosition: 'right'
    },
    {
      id: 'sponsors',
      title: 'Corporate Sponsorships',
      description: 'Discover CSR funding opportunities. Connect with corporate partners who share your vision of preserving traditional arts.',
      icon: Building2,
      gradient: 'from-purple-600 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200',
      route: '/ngo-sponsors',
      imagePosition: 'left',
      badge: 'AI Powered'
    },
    {
      id: 'reports',
      title: 'AI Impact Reports',
      description: 'Generate comprehensive impact reports powered by AI. Showcase your achievements and transparency to donors.',
      icon: FileText,
      gradient: 'from-indigo-600 to-purple-600',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
      route: '/ngo-reports',
      imagePosition: 'right',
      badge: 'AI Powered'
    },
    {
      id: 'donations',
      title: 'Donation Management',
      description: 'Track all donations, manage donor relationships, and view detailed financial analytics to drive your mission forward.',
      icon: Wallet,
      gradient: 'from-green-600 to-teal-600',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200',
      route: '/ngo-donations',
      imagePosition: 'left'
    }
  ];

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const data = await getProfileStatus(userInfo.token);
        if (data.success) {
          if (!data.data.profileComplete) {
            navigate('/ngo-profile-setup');
          } else {
            setProfileComplete(true);
            setProfile(data.data); // Add this line to store profile data
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
        
        // Update profile with latest stats
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profileComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Fixed Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
              Welcome, {userInfo?.name}!
            </h1>

            <div className="flex items-center gap-3">
              {/* Desktop Quick Nav */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setShowQuickNav(!showQuickNav)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-100 to-green-100 text-teal-700 rounded-lg hover:from-teal-200 hover:to-green-200 transition font-semibold border border-teal-200"
                >
                  <Menu className="w-5 h-5" />
                  <span>Quick Access</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showQuickNav ? 'rotate-180' : ''}`} />
                </button>

                {showQuickNav && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="p-3 bg-gradient-to-r from-teal-50 to-green-50 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">Navigate to:</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {ngoDashboardSections.filter(s => s.route).map((section) => {
                        const Icon = section.icon;
                        return (
                          <button
                            key={section.id}
                            onClick={() => {
                              navigate(section.route);
                              setShowQuickNav(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-green-50 transition text-left border-b border-gray-100 last:border-b-0"
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

              <button
                onClick={handleProfileEdit}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-lg hover:from-teal-700 hover:to-green-700 transition shadow-lg"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-Width Scrolling Sections */}
      <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
        {ngoDashboardSections.map((section, index) => {
          const Icon = section.icon;
          
          return (
            <section
              key={section.id}
              id={section.id}
              className="snap-start min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-white pt-24"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-5`}></div>

              <div className="relative w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-y-auto">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${section.imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Text Content */}
                  <div className={`flex flex-col justify-center ${section.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'} space-y-6`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {section.badge && (
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-100 px-4 py-2 rounded-full w-fit">
                        <Sparkles className="w-4 h-4" />
                        {section.badge}
                      </span>
                    )}
                    
                    <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                      {section.title}
                    </h2>
                    
                    <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                      {section.description}
                    </p>

                    {/* Stats Grid for Overview Section */}
                    {section.isStats && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition">
                          <Wallet className="w-8 h-8 mb-2 opacity-80" />
                          <p className="text-sm opacity-90 mb-1">Total Raised</p>
                          <p className="text-3xl font-bold">₹{donationStats.totalAmount?.toLocaleString() || 0}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition">
                          <Users className="w-8 h-8 mb-2 opacity-80" />
                          <p className="text-sm opacity-90 mb-1">Total Donors</p>
                          <p className="text-3xl font-bold">{donationStats.uniqueDonors || 0}</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition">
                          <IndianRupee className="w-8 h-8 mb-2 opacity-80" />
                          <p className="text-sm opacity-90 mb-1">Avg Donation</p>
                          <p className="text-3xl font-bold">₹{Math.round(donationStats.averageDonation || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition">
                          <Calendar className="w-8 h-8 mb-2 opacity-80" />
                          <p className="text-sm opacity-90 mb-1">Donations</p>
                          <p className="text-3xl font-bold">{donations.length}</p>
                        </div>
                      </div>
                    )}

                    {/* CTA Button for non-stats sections */}
                    {section.route && (
                      <button
                        onClick={() => navigate(section.route)}
                        className={`group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${section.gradient} text-white rounded-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold w-fit`}
                      >
                        <span>Explore Now</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>

                  {/* Image */}
                  <div className={`relative ${section.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'} group`}>
                    <div className="relative h-[350px] rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                    </div>
                    
                    <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-2xl p-4 transform group-hover:scale-105 transition-transform">
                      <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                        {index + 1}/{ngoDashboardSections.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Donations Table - Full Width Below Content */}
                {section.isStats && donations.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mt-12">
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                      <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Recent Donations
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Donor</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {donations.slice(0, 5).map((donation) => (
                            <tr key={donation._id} className="hover:bg-green-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-green-600" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{donation.donor?.name || 'Anonymous'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {donation.donor?.email || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-lg font-bold text-green-600">₹{donation.amount.toLocaleString()}</span>
                              </td>
                              <td className="px-6 py-4 max-w-xs">
                                <p className="text-sm text-gray-600 truncate">{donation.message || '-'}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{new Date(donation.createdAt).toLocaleDateString()}</div>
                                <div className="text-xs text-gray-500">{new Date(donation.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {donations.length > 5 && (
                      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <button
                          onClick={() => navigate('/ngo-donations')}
                          className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-2"
                        >
                          View all {donations.length} donations
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Scroll Indicator (first section only) */}
              {index === 0 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <div className="w-6 h-10 border-2 border-teal-400 rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-teal-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .snap-y {
          scroll-snap-type: y mandatory;
          scrollbar-width: thin;
          scrollbar-color: rgba(20, 184, 166, 0.3) rgba(249, 250, 251, 1);
        }
        .snap-y::-webkit-scrollbar {
          width: 8px;
        }
        .snap-y::-webkit-scrollbar-track {
          background: rgba(249, 250, 251, 1);
        }
        .snap-y::-webkit-scrollbar-thumb {
          background: rgba(20, 184, 166, 0.3);
          border-radius: 4px;
        }
        .snap-y::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 184, 166, 0.5);
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

export default NgoDashboard;
