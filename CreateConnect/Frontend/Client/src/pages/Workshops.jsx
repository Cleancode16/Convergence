import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Search, Sparkles, Filter, X } from 'lucide-react';
import { getAllWorkshops, getWorkshopRecommendations, enrollWorkshop } from '../services/workshopService';

const Workshops = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [workshops, setWorkshops] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtForm, setSelectedArtForm] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('upcoming');
  const [showFilters, setShowFilters] = useState(false);

  // All available art forms (comprehensive list)
  const allArtForms = [
    'Pottery',
    'Weaving',
    'Tanjore Paintings',
    'Puppetry',
    'Dokra Jewellery',
    'Meenakari',
    'Kondapalli Bommalu',
    'Ikkat',
    'Mandala Art',
    'Madhubani Painting',
    'Warli Art',
    'Pattachitra',
    'Kalamkari',
    'Bidriware',
    'Blue Pottery',
    'General',
    'Other'
  ].sort();

  useEffect(() => {
    fetchWorkshops();
    if (userInfo) {
      fetchRecommendations();
    }
  }, [userInfo]);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedArtForm !== 'all') filters.artForm = selectedArtForm;
      if (selectedStatus !== 'all') filters.status = selectedStatus;

      const data = await getAllWorkshops(filters);
      setWorkshops(data.data || []);
    } catch (error) {
      console.error('Error fetching workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const data = await getWorkshopRecommendations(userInfo.token);
      setRecommendations(data.data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Silently fail - recommendations are optional
    }
  };

  const handleEnroll = async (workshopId) => {
    if (!userInfo) {
      alert('Please login to enroll');
      navigate('/signin');
      return;
    }

    try {
      await enrollWorkshop(workshopId, userInfo.token);
      alert('Successfully enrolled!');
      fetchWorkshops();
    } catch (error) {
      alert(error.message);
    }
  };

  const isRecommended = (workshopId) => {
    return recommendations.some(rec => rec._id === workshopId);
  };

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.artForm.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArtForm = selectedArtForm === 'all' || workshop.artForm === selectedArtForm;
    const matchesStatus = selectedStatus === 'all' || workshop.status === selectedStatus;
    
    return matchesSearch && matchesArtForm && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 transition">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Workshops</h1>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Bar */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search workshops..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>

            {/* Art Form Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedArtForm}
                onChange={(e) => setSelectedArtForm(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                <option value="all">All Art Forms</option>
                {allArtForms.map((form) => (
                  <option key={form} value={form}>{form}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Clear Button */}
            {(selectedArtForm !== 'all' || selectedStatus !== 'all' || searchTerm) && (
              <div className="sm:col-span-1">
                <button
                  onClick={() => {
                    setSelectedArtForm('all');
                    setSelectedStatus('all');
                    setSearchTerm('');
                  }}
                  className="w-full px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm">
            <span className="font-bold text-purple-600">{filteredWorkshops.length}</span> workshops found
          </p>
        </div>

        {/* Workshops Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading workshops...</p>
          </div>
        ) : filteredWorkshops.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No workshops found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => {
              const isEnrolled = workshop.enrolledUsers?.some(e => e.user === userInfo?._id);
              const isFull = workshop.availableSlots === 0;
              const recommended = isRecommended(workshop._id);

              return (
                <div
                  key={workshop._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col relative"
                >
                  {/* Recommended Badge - More prominent */}
                  {recommended && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Recommended</span>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-3 py-1 rounded-full shadow">
                          Based on your interests
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Workshop Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100">
                    {workshop.images && workshop.images.length > 0 ? (
                      <img
                        src={workshop.images[0].url}
                        alt={workshop.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-purple-400" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-semibold text-purple-600">{workshop.artForm}</span>
                    </div>
                  </div>

                  {/* Workshop Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{workshop.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{workshop.description}</p>

                    {/* Workshop Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>{new Date(workshop.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span>{workshop.startTime} - {workshop.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span>{workshop.location?.city || 'Location TBA'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span>{workshop.availableSlots} / {workshop.totalSlots} slots available</span>
                      </div>
                    </div>

                    {/* Artisan Info */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Conducted by</p>
                      <p className="font-semibold text-gray-900">{workshop.artisan?.name}</p>
                    </div>

                    {/* Price */}
                    {workshop.price > 0 && (
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-purple-600">₹{workshop.price}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-auto space-y-2">
                      <button
                        onClick={() => navigate(`/workshop/${workshop._id}`)}
                        className="w-full py-2.5 px-4 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition font-semibold"
                      >
                        View Details
                      </button>
                      {isEnrolled ? (
                        <div className="w-full py-2.5 px-4 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
                          ✓ Enrolled
                        </div>
                      ) : isFull ? (
                        <div className="w-full py-2.5 px-4 bg-gray-200 text-gray-500 rounded-lg text-center font-semibold cursor-not-allowed">
                          Fully Booked
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEnroll(workshop._id)}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-semibold"
                        >
                          Enroll Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Workshops;
