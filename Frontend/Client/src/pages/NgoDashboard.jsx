import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, Wallet, FileText, BookOpen, Calendar, TrendingUp, Settings, LogOut, Building2, IndianRupee } from 'lucide-react';
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => navigate('/browse-artisans')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg mb-4">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Artisans</h3>
            <p className="text-gray-600 text-sm">Find and connect with artisans</p>
          </div>

          <div
            onClick={() => navigate('/ngo-sponsors')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Corporate Sponsors</h3>
            <p className="text-gray-600 text-sm">Find CSR funding opportunities</p>
          </div>

          <div
            onClick={() => navigate('/ngo-reports')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Reports</h3>
            <p className="text-gray-600 text-sm">Generate impact reports</p>
          </div>
        </div>

        {/* Donation Stats Cards - MOVE HERE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-8 h-8" />
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <p className="text-green-100 text-sm font-medium">Total Funds Raised</p>
            <p className="text-3xl font-bold mt-2">₹{donationStats.totalAmount?.toLocaleString() || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8" />
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <p className="text-blue-100 text-sm font-medium">Total Donors</p>
            <p className="text-3xl font-bold mt-2">{donationStats.uniqueDonors || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <IndianRupee className="w-8 h-8" />
            </div>
            <p className="text-purple-100 text-sm font-medium">Average Donation</p>
            <p className="text-3xl font-bold mt-2">₹{Math.round(donationStats.averageDonation || 0).toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8" />
            </div>
            <p className="text-teal-100 text-sm font-medium">Total Donations</p>
            <p className="text-3xl font-bold mt-2">{donations.length}</p>
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Wallet className="w-6 h-6" />
              Recent Donations
            </h2>
            <button
              onClick={() => navigate('/ngo-donations')}
              className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold text-sm"
            >
              View All
            </button>
          </div>

          {donations.length === 0 ? (
            <div className="text-center py-16">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No donations received yet</p>
              <p className="text-gray-400 text-sm mt-2">Share your NGO profile to start receiving donations</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.slice(0, 5).map((donation) => (
                      <tr key={donation._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {donation.donor?.name || 'Anonymous'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{donation.donor?.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-600">
                            ₹{donation.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(donation.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(donation.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {donation.message || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            donation.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : donation.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              {donations.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(5, donations.length)}</span> of{' '}
                      <span className="font-medium">{donations.length}</span> donations
                    </div>
                    <div className="text-sm text-gray-500">
                      Total Raised: <span className="font-bold text-green-600">₹{donationStats.totalAmount?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default NgoDashboard;
