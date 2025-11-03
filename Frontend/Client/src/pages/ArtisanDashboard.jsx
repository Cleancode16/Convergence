import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Package, ShoppingCart, MessageSquare, Star, BarChart3, Settings, LogOut, BadgeCheck, Clock, XCircle, AlertCircle, Users } from 'lucide-react';
import { logout } from '../redux/actions/authActions';
import { getProfileStatus, getProfile } from '../services/artisanService';
import confetti from 'canvas-confetti';

const ArtisanDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileComplete, setProfileComplete] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const confettiTriggered = useRef(false);

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const statusData = await getProfileStatus(userInfo.token);
        if (statusData.success) {
          if (!statusData.data.profileComplete) {
            navigate('/artisan-profile-setup');
          } else {
            setProfileComplete(true);
            // Fetch full profile to get verification status
            const profileResponse = await getProfile(userInfo.token);
            if (profileResponse.success) {
              setProfileData(profileResponse.data);
              
              // Trigger confetti only once when verified
              if (profileResponse.data.verificationStatus === 'verified' && !confettiTriggered.current) {
                const hasSeenConfetti = localStorage.getItem(`confetti_${userInfo._id}`);
                
                if (!hasSeenConfetti) {
                  triggerConfetti();
                  localStorage.setItem(`confetti_${userInfo._id}`, 'true');
                  confettiTriggered.current = true;
                }
              }
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

    if (userInfo?.token) {
      checkProfileStatus();
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

      // Confetti from left side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
      });

      // Confetti from right side
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profileComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-amber-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Artisan Dashboard</h1>
              {profileData?.isExpertVerified && (
                <div className="flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  <BadgeCheck className="w-5 h-5 fill-white" />
                  <span className="hidden sm:inline">Expert Verified</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleProfileEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back, {userInfo?.name}!
              </h2>
              {profileData?.isExpertVerified && (
                <div className="relative group">
                  <BadgeCheck className="w-7 h-7 text-blue-500 fill-blue-100 cursor-pointer" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Verified Expert Artisan
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {profileData?.verificationStatus && (
              <div className="flex items-center gap-2">
                {profileData.verificationStatus === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 border-2 border-yellow-300">
                    <Clock className="w-4 h-4" />
                    Verification Pending
                  </span>
                )}
                {profileData.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                    <BadgeCheck className="w-5 h-5 fill-white" />
                    Expert Verified Artisan
                    <span className="ml-1 px-2 py-0.5 bg-white text-blue-600 text-xs rounded-full">✓ Genuine</span>
                  </span>
                )}
                {profileData.verificationStatus === 'rejected' && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800 border-2 border-red-300">
                    <XCircle className="w-4 h-4" />
                    Verification Rejected
                  </span>
                )}
                {profileData.verificationStatus === 'fraud' && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800 border-2 border-red-300">
                    <AlertCircle className="w-4 h-4" />
                    Account Flagged
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Verification Success Banner */}
          {profileData?.verificationStatus === 'verified' && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 rounded-lg shadow-sm">
              <div className="flex items-start gap-3">
                <BadgeCheck className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">
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

          {/* Verification Message */}
          {profileData?.verificationStatus === 'pending' && (
            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-blue-700">
                <strong>Profile Under Review:</strong> Your profile is being reviewed by our admin team. You'll be notified once verified.
              </p>
            </div>
          )}

          {profileData?.verificationStatus === 'rejected' && profileData?.verificationNotes && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-sm text-red-700">
                <strong>Verification Rejected:</strong> {profileData.verificationNotes}
              </p>
            </div>
          )}

          {profileData?.verificationStatus === 'fraud' && profileData?.verificationNotes && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-sm text-red-700">
                <strong>Account Flagged:</strong> {profileData.verificationNotes}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-amber-600">24</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-3xl font-bold text-green-600">₹45,230</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-3xl font-bold text-blue-600">7</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg mb-4">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Product</h3>
            <p className="text-gray-600 text-sm">Create new product listing</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Products</h3>
            <p className="text-gray-600 text-sm">Manage your inventory</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
            <p className="text-gray-600 text-sm">View and manage orders</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-600 text-sm">Customer inquiries</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg mb-4">
              <Star className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reviews</h3>
            <p className="text-gray-600 text-sm">Customer feedback</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">Sales insights</p>
          </div>

          <div 
            onClick={() => navigate('/artisan-connections')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg mb-4">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">NGO Connections</h3>
            <p className="text-gray-600 text-sm">View requests & connected NGOs</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtisanDashboard;
