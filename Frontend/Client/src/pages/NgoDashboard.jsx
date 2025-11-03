import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, DollarSign, FileText, BookOpen, Calendar, TrendingUp, Settings, LogOut } from 'lucide-react';
import { logout } from '../redux/actions/authActions';
import { getProfileStatus } from '../services/ngoService';

const NgoDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileComplete, setProfileComplete] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const data = await getProfileStatus(userInfo.token);
        if (data.success) {
          if (!data.data.profileComplete) {
            navigate('/ngo-profile-setup');
          } else {
            setProfileComplete(true);
          }
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
        navigate('/ngo-profile-setup');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) {
      checkProfileStatus();
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-white">NGO Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={handleProfileEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white text-teal-600 rounded-lg hover:bg-gray-100 transition"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white text-teal-600 rounded-lg hover:bg-gray-100 transition"
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome, {userInfo?.name}!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Active Programs</p>
              <p className="text-3xl font-bold text-teal-600">12</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Artisans Supported</p>
              <p className="text-3xl font-bold text-blue-600">156</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Funds Raised</p>
              <p className="text-3xl font-bold text-green-600">₹2.4L</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg mb-4">
              <FileText className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">New Program</h3>
            <p className="text-gray-600 text-sm">Create support program</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Artisans</h3>
            <p className="text-gray-600 text-sm">Manage beneficiaries</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fundraising</h3>
            <p className="text-gray-600 text-sm">Manage campaigns</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
            <p className="text-gray-600 text-sm">Impact assessments</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
              <BookOpen className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Training</h3>
            <p className="text-gray-600 text-sm">Skill development programs</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg mb-4">
              <Calendar className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Events</h3>
            <p className="text-gray-600 text-sm">Organize workshops</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NgoDashboard;
