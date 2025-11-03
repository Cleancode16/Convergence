import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Target, TrendingUp } from 'lucide-react';
import { getAllNGOs } from '../services/donationService';

const NGOsList = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      setLoading(true);
      const data = await getAllNGOs();
      setNgos(data.data || []);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNGOs = ngos.filter(ngo =>
    ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.profile?.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.profile?.mission?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-green-600 to-teal-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 transition">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="ml-4 text-2xl font-bold text-white">Support NGOs</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-10 h-10" fill="currentColor" />
            <h2 className="text-3xl md:text-4xl font-bold">Make a Difference</h2>
          </div>
          <p className="text-lg text-green-100 mb-6">
            Support NGOs working to preserve traditional arts and empower artisan communities
          </p>
          
          {/* Search */}
          <div className="max-w-2xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search NGOs..."
              className="w-full px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <p className="text-gray-700 text-lg">
            <span className="font-bold text-green-600">{filteredNGOs.length}</span> NGOs available
          </p>
        </div>

        {/* NGOs Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading NGOs...</p>
          </div>
        ) : filteredNGOs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <Users className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No NGOs found</h3>
            <p className="text-gray-500">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNGOs.map((ngo) => (
              <div
                key={ngo._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* NGO Header */}
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">{ngo.profile?.organizationName || ngo.name}</h3>
                  </div>
                </div>

                {/* NGO Content */}
                <div className="p-6">
                  {ngo.profile?.mission && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Mission</p>
                      <p className="text-gray-600 text-sm line-clamp-3">{ngo.profile.mission}</p>
                    </div>
                  )}

                  {ngo.profile?.focusAreas && ngo.profile.focusAreas.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Focus Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {ngo.profile.focusAreas.slice(0, 3).map((area, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <Target className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Funds Raised</p>
                      <p className="font-bold text-green-600">₹{ngo.profile?.totalFundsRaised?.toLocaleString() || 0}</p>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Donors</p>
                      <p className="font-bold text-teal-600">{ngo.profile?.donorsCount || 0}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/ngo/${ngo._id}`)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition font-semibold shadow-lg"
                  >
                    View Details & Donate
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

export default NGOsList;
