import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Wallet, Calendar, Search, HandHeart } from 'lucide-react';
import { getMyDonations } from '../services/donationService';

const MyDonations = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalDonated, setTotalDonated] = useState(0);

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    filterDonations();
  }, [searchTerm, donations]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await getMyDonations(userInfo.token);
      setDonations(data.data || []);
      setFilteredDonations(data.data || []);
      setTotalDonated(data.totalDonated || 0);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDonations = () => {
    if (!searchTerm.trim()) {
      setFilteredDonations(donations);
      return;
    }

    const search = searchTerm.toLowerCase();
    const filtered = donations.filter(donation => 
      donation.ngo?.name?.toLowerCase().includes(search) ||
      donation.message?.toLowerCase().includes(search) ||
      donation.amount.toString().includes(search)
    );
    setFilteredDonations(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-green-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 transition">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="ml-4 text-2xl font-bold text-white">My Donations</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Donated</p>
                <p className="text-4xl font-bold text-green-600">₹{totalDonated.toLocaleString()}</p>
              </div>
              <Wallet className="w-16 h-16 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Donations</p>
                <p className="text-4xl font-bold text-blue-600">{donations.length}</p>
              </div>
              <Calendar className="w-16 h-16 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by NGO name, message, or amount..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Donations List */}
        {filteredDonations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center">
            <HandHeart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No donations yet</h3>
            <p className="text-gray-500 mb-6">Start supporting NGOs making a difference!</p>
            <button
              onClick={() => navigate('/ngos')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Explore NGOs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDonations.map((donation) => (
              <div key={donation._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                      <HandHeart className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{donation.ngo?.name}</h3>
                      <p className="text-sm text-gray-500">{donation.ngo?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">₹{donation.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(donation.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                {donation.message && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 italic">"{donation.message}"</p>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    donation.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </span>
                  <button
                    onClick={() => navigate(`/ngo/${donation.ngo._id}`)}
                    className="text-green-600 hover:text-green-700 font-semibold text-sm"
                  >
                    View NGO →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyDonations;
