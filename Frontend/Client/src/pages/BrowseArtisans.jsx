import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, Filter, BadgeCheck, MapPin, Briefcase, Phone, ArrowLeft, Send, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { getMatchingArtisans, sendConnectionRequest, getProfile, getNgoConnections } from '../services/ngoService';
import ChatModal from '../components/ChatModal';

const BrowseArtisans = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArtType, setFilterArtType] = useState('all');
  const [filterVerification, setFilterVerification] = useState('verified');
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [connectionPurpose, setConnectionPurpose] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [ngoProfile, setNgoProfile] = useState(null);
  const [activeView, setActiveView] = useState('browse'); // 'browse' or 'connections'
  const [myConnections, setMyConnections] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const artTypes = [
    { value: 'all', label: 'All Art Forms' },
    { value: 'pottery', label: 'Pottery' },
    { value: 'weavery', label: 'Weavery' },
    { value: 'paintings', label: 'Paintings' },
    { value: 'tanjore_paintings', label: 'Tanjore Paintings' },
    { value: 'puppetry', label: 'Puppetry' },
    { value: 'dokra_jewellery', label: 'Dokra Jewellery' },
    { value: 'meenakari', label: 'Meenakari' },
    { value: 'kondapalli_bommalu', label: 'Kondapalli Bommalu' },
    { value: 'ikkat', label: 'Ikkat' },
    { value: 'mandala', label: 'Mandala' },
    { value: 'stationary', label: 'Stationary' },
  ];

  useEffect(() => {
    fetchNgoProfile();
  }, []);

  useEffect(() => {
    if (ngoProfile) {
      fetchArtisans();
      setCurrentPage(1);
    }
  }, [filterArtType, searchTerm, filterVerification, ngoProfile]);

  useEffect(() => {
    if (activeView === 'connections') {
      fetchMyConnections();
    }
  }, [activeView]);

  const fetchNgoProfile = async () => {
    try {
      const data = await getProfile(userInfo.token);
      if (data.success) {
        setNgoProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching NGO profile:', error);
    }
  };

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const data = await getMatchingArtisans(userInfo.token, filterArtType, searchTerm);
      setArtisans(data.data || []);
    } catch (error) {
      console.error('Error fetching artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyConnections = async () => {
    try {
      setLoading(true);
      const data = await getNgoConnections(userInfo.token, 'accepted');
      setMyConnections(data.data || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtisans = artisans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(artisans.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openConnectionModal = (artisan) => {
    setSelectedArtisan(artisan);
    setConnectionMessage('');
    setConnectionPurpose('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArtisan(null);
    setConnectionMessage('');
    setConnectionPurpose('');
  };

  const handleSendConnection = async () => {
    if (!selectedArtisan) return;

    try {
      setSendingRequest(true);
      await sendConnectionRequest(
        selectedArtisan.user._id,
        connectionMessage,
        connectionPurpose,
        userInfo.token
      );
      alert('Connection request sent successfully!');
      closeModal();
    } catch (error) {
      alert(error.message);
    } finally {
      setSendingRequest(false);
    }
  };

  const formatArtType = (artType, otherArtType) => {
    if (artType === 'others') return otherArtType;
    return artType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const openChat = (connection) => {
    setSelectedConnection(connection);
    setShowChatModal(true);
  };

  const closeChat = () => {
    setShowChatModal(false);
    setSelectedConnection(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate('/ngo-dashboard')}
              className="text-white hover:text-gray-200 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Browse Artisans</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveView('browse')}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeView === 'browse'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse Artisans
            </button>
            <button
              onClick={() => setActiveView('connections')}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeView === 'connections'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Connections
            </button>
          </div>
        </div>

        {activeView === 'browse' ? (
          <>
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={filterArtType}
                    onChange={(e) => setFilterArtType(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white appearance-none"
                  >
                    <option value="all">All Interested Arts</option>
                    {ngoProfile?.interestedArtDomains.includes('all') ? (
                      artTypes.filter(t => t.value !== 'all').map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))
                    ) : (
                      ngoProfile?.interestedArtDomains.map((domain) => {
                        const artType = artTypes.find(t => t.value === domain);
                        return artType ? (
                          <option key={artType.value} value={artType.value}>
                            {artType.label}
                          </option>
                        ) : null;
                      })
                    )}
                  </select>
                </div>

                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={filterVerification}
                    onChange={(e) => setFilterVerification(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white appearance-none"
                  >
                    <option value="verified">Verified Only</option>
                    <option value="all">All Artisans</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Showing {currentArtisans.length} of {artisans.length} artisans
                {ngoProfile && !ngoProfile.interestedArtDomains.includes('all') && (
                  <span className="ml-2">
                    (Filtered by your interested domains: {ngoProfile.interestedArtDomains.map(d => 
                      artTypes.find(t => t.value === d)?.label
                    ).join(', ')})
                  </span>
                )}
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading artisans...</p>
              </div>
            ) : artisans.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No artisans found matching your criteria</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-teal-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Artisan
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Art Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Experience
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentArtisans.map((artisan) => {
                          // Add null check for artisan.user
                          if (!artisan.user) {
                            return null;
                          }

                          return (
                            <tr key={artisan._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <div className="text-sm font-medium text-gray-900">
                                        {artisan.user?.name || 'Unknown'}
                                      </div>
                                      {artisan.isExpertVerified && (
                                        <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-100" />
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-500">{artisan.user?.email || 'N/A'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {formatArtType(artisan.artType, artisan.otherArtType)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {artisan.experience ? `${artisan.experience} years` : 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {artisan.address?.city && artisan.address?.state
                                    ? `${artisan.address.city}, ${artisan.address.state}`
                                    : 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{artisan.phoneNumber || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {artisan.verificationStatus === 'verified' ? (
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Verified
                                  </span>
                                ) : artisan.verificationStatus === 'pending' ? (
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Pending
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                    {artisan.verificationStatus}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => openConnectionModal(artisan)}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                                >
                                  <Send className="w-3 h-3" />
                                  Connect
                                </button>
                              </td>
                            </tr>
                          );
                        }).filter(Boolean)}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-lg shadow-md px-6 py-4 mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, artisans.length)} of {artisans.length} artisans
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>

                      <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          // Show first page, last page, current page, and pages around current
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => goToPage(pageNumber)}
                                className={`px-3 py-2 border rounded-md text-sm font-medium ${
                                  currentPage === pageNumber
                                    ? 'bg-teal-600 text-white border-teal-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return <span key={pageNumber} className="px-2 py-2">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          /* My Connections View */
          loading ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading connections...</p>
            </div>
          ) : myConnections.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No connected artisans yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myConnections.map((connection) => {
                const artisan = connection.artisanProfile;
                return (
                  <div key={connection._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{connection.artisan.name}</h3>
                          {artisan?.isExpertVerified && (
                            <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-100" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{connection.artisan.email}</p>
                      </div>
                    </div>

                    {artisan && (
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 text-teal-600" />
                          <span className="capitalize">
                            {artisan.artType === 'others' ? artisan.otherArtType : artisan.artType.replace(/_/g, ' ')}
                          </span>
                        </div>
                        {artisan.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-teal-600" />
                            <span>{artisan.phoneNumber}</span>
                          </div>
                        )}
                        {artisan.address?.city && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-teal-600" />
                            <span>{artisan.address.city}, {artisan.address.state}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => openChat(connection)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Open Chat
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>

      {/* Chat Modal */}
      {showChatModal && selectedConnection && (
        <ChatModal connection={selectedConnection} onClose={closeChat} />
      )}

      {/* Connection Modal */}
      {showModal && selectedArtisan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Connect with {selectedArtisan.user?.name || 'Artisan'}
            </h3>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Art Type:</strong> {formatArtType(selectedArtisan.artType, selectedArtisan.otherArtType)}</p>
                <p><strong>Experience:</strong> {selectedArtisan.experience ? `${selectedArtisan.experience} years` : 'N/A'}</p>
                <p><strong>Location:</strong> {selectedArtisan.address?.city || 'N/A'}, {selectedArtisan.address?.state || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                  rows="3"
                  maxLength="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                  placeholder="Introduce yourself and why you'd like to connect..."
                />
                <p className="text-xs text-gray-500 mt-1">{connectionMessage.length}/500</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  value={connectionPurpose}
                  onChange={(e) => setConnectionPurpose(e.target.value)}
                  rows="2"
                  maxLength="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                  placeholder="What program or opportunity are you reaching out about?"
                />
                <p className="text-xs text-gray-500 mt-1">{connectionPurpose.length}/500</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                disabled={sendingRequest}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendConnection}
                disabled={sendingRequest}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {sendingRequest ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseArtisans;
