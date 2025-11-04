import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, Filter, BadgeCheck, MapPin, Briefcase, Phone, ArrowLeft, Send, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg border-b border-purple-100 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-20">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/ngo-dashboard')}
              className="text-[#783be8] hover:text-purple-700 transition p-2 rounded-lg hover:bg-purple-50"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Briefcase className="w-8 h-8 text-[#783be8]" />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                Browse Artisans
              </h1>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl mb-8 border-2 border-purple-100 overflow-hidden"
        >
          <div className="flex">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView('browse')}
              className={`flex-1 px-6 py-5 text-sm font-bold border-b-4 transition-all ${
                activeView === 'browse'
                  ? 'border-[#783be8] text-[#783be8] bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Browse Artisans
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView('connections')}
              className={`flex-1 px-6 py-5 text-sm font-bold border-b-4 transition-all ${
                activeView === 'connections'
                  ? 'border-[#783be8] text-[#783be8] bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              My Connections
            </motion.button>
          </div>
        </motion.div>

        {activeView === 'browse' ? (
          <>
            {/* Search and Filter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-purple-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#783be8] w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition-all font-medium"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#783be8] w-5 h-5" />
                  <select
                    value={filterArtType}
                    onChange={(e) => setFilterArtType(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] bg-white appearance-none font-medium cursor-pointer"
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
                  <BadgeCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#783be8] w-5 h-5" />
                  <select
                    value={filterVerification}
                    onChange={(e) => setFilterVerification(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] bg-white appearance-none font-medium cursor-pointer"
                  >
                    <option value="verified">Verified Only</option>
                    <option value="all">All Artisans</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600 font-medium">
                Showing <span className="font-bold text-[#783be8] text-base">{currentArtisans.length}</span> of <span className="font-bold text-[#783be8] text-base">{artisans.length}</span> artisans
                {ngoProfile && !ngoProfile.interestedArtDomains.includes('all') && (
                  <span className="ml-2">
                    (Filtered by your interested domains: {ngoProfile.interestedArtDomains.map(d => 
                      artTypes.find(t => t.value === d)?.label
                    ).join(', ')})
                  </span>
                )}
              </div>
            </motion.div>

            {/* Table */}
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-2xl shadow-xl border-2 border-purple-100"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <div className="w-16 h-16 border-4 border-[#783be8] border-t-transparent rounded-full"></div>
                </motion.div>
                <p className="mt-6 text-gray-700 font-semibold text-lg">Loading artisans...</p>
              </motion.div>
            ) : artisans.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl p-16 text-center border-2 border-purple-100"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Briefcase className="w-20 h-20 text-purple-300 mx-auto mb-6" />
                </motion.div>
                <p className="text-gray-700 text-xl font-semibold mb-2">No artisans found matching your criteria</p>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-100"
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-purple-100">
                      <thead className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
                        <tr>
                          <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                            Artisan
                          </th>
                          <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                            Art Type
                          </th>
                          <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                            Experience
                          </th>
                          <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-purple-50">
                        {currentArtisans.map((artisan, index) => {
                          // Add null check for artisan.user
                          if (!artisan.user) {
                            return null;
                          }

                          return (
                            <motion.tr 
                              key={artisan._id} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ backgroundColor: "#faf5ff" }}
                              className="transition-all"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <div className="text-sm font-bold text-gray-900">
                                        {artisan.user?.name || 'Unknown'}
                                      </div>
                                      {artisan.isExpertVerified && (
                                        <BadgeCheck className="w-5 h-5 text-[#783be8] fill-purple-100" />
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">{artisan.user?.email || 'N/A'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-medium">
                                  {formatArtType(artisan.artType, artisan.otherArtType)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-medium">
                                  {artisan.experience ? `${artisan.experience} years` : 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-medium">
                                  {artisan.address?.city && artisan.address?.state
                                    ? `${artisan.address.city}, ${artisan.address.state}`
                                    : 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-medium">{artisan.phoneNumber || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {artisan.verificationStatus === 'verified' ? (
                                  <motion.span 
                                    whileHover={{ scale: 1.05 }}
                                    className="px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200 shadow-sm"
                                  >
                                    Verified
                                  </motion.span>
                                ) : artisan.verificationStatus === 'pending' ? (
                                  <motion.span 
                                    whileHover={{ scale: 1.05 }}
                                    className="px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200 shadow-sm"
                                  >
                                    Pending
                                  </motion.span>
                                ) : (
                                  <motion.span 
                                    whileHover={{ scale: 1.05 }}
                                    className="px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 shadow-sm"
                                  >
                                    {artisan.verificationStatus}
                                  </motion.span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <motion.button
                                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px -10px rgba(120, 59, 232, 0.4)" }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => openConnectionModal(artisan)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-bold shadow-lg"
                                >
                                  <Send className="w-4 h-4" />
                                  Connect
                                </motion.button>
                              </td>
                            </motion.tr>
                          );
                        }).filter(Boolean)}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-xl px-6 py-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-purple-100"
                  >
                    <div className="text-sm text-gray-700 font-medium">
                      Showing <span className="font-bold text-[#783be8]">{indexOfFirstItem + 1}</span> to <span className="font-bold text-[#783be8]">{Math.min(indexOfLastItem, artisans.length)}</span> of <span className="font-bold text-[#783be8]">{artisans.length}</span> artisans
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-1 px-4 py-2 border-2 border-purple-200 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </motion.button>

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
                              <motion.button
                                key={pageNumber}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => goToPage(pageNumber)}
                                className={`px-4 py-2 border-2 rounded-xl text-sm font-bold transition-all ${
                                  currentPage === pageNumber
                                    ? 'bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white border-[#783be8] shadow-lg'
                                    : 'bg-white text-gray-700 border-purple-200 hover:bg-purple-50'
                                }`}
                              >
                                {pageNumber}
                              </motion.button>
                            );
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return <span key={pageNumber} className="px-2 py-2 text-gray-500 font-bold">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-1 px-4 py-2 border-2 border-purple-200 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </>
        ) : (
          /* My Connections View */
          loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-2xl shadow-xl border-2 border-purple-100"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <div className="w-16 h-16 border-4 border-[#783be8] border-t-transparent rounded-full"></div>
              </motion.div>
              <p className="mt-6 text-gray-700 font-semibold text-lg">Loading connections...</p>
            </motion.div>
          ) : myConnections.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-16 text-center border-2 border-purple-100"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MessageCircle className="w-20 h-20 text-purple-300 mx-auto mb-6" />
              </motion.div>
              <p className="text-gray-700 text-xl font-semibold mb-2">No connected artisans yet</p>
              <p className="text-gray-500">Start connecting with artisans to build your network</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {myConnections.map((connection, index) => {
                const artisan = connection.artisanProfile;
                return (
                  <motion.div 
                    key={connection._id} 
                    variants={scaleIn}
                    whileHover={{ y: -8, boxShadow: "0 20px 40px -12px rgba(120, 59, 232, 0.3)" }}
                    className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all border-2 border-purple-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-extrabold text-gray-900">{connection.artisan.name}</h3>
                          {artisan?.isExpertVerified && (
                            <BadgeCheck className="w-5 h-5 text-[#783be8] fill-purple-100" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{connection.artisan.email}</p>
                      </div>
                    </div>

                    {artisan && (
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-700 bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
                          <Briefcase className="w-5 h-5 text-[#783be8]" />
                          <span className="capitalize font-semibold">
                            {artisan.artType === 'others' ? artisan.otherArtType : artisan.artType.replace(/_/g, ' ')}
                          </span>
                        </div>
                        {artisan.phoneNumber && (
                          <div className="flex items-center gap-3 text-sm text-gray-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">{artisan.phoneNumber}</span>
                          </div>
                        )}
                        {artisan.address?.city && (
                          <div className="flex items-center gap-3 text-sm text-gray-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                            <MapPin className="w-5 h-5 text-green-600" />
                            <span className="font-semibold">{artisan.address.city}, {artisan.address.state}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px -10px rgba(120, 59, 232, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openChat(connection)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-bold shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Open Chat
                    </motion.button>
                  </motion.div>
                );
              })}
            </motion.div>
          )
        )}
      </main>

      {/* Chat Modal */}
      {showChatModal && selectedConnection && (
        <ChatModal connection={selectedConnection} onClose={closeChat} />
      )}

      {/* Connection Modal */}
      {showModal && selectedArtisan && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 border-2 border-purple-200"
          >
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent mb-6">
              Connect with {selectedArtisan.user?.name || 'Artisan'}
            </h3>

            <div className="mb-6 p-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
              <div className="text-sm text-gray-700 space-y-2 font-medium">
                <p><strong className="text-[#783be8]">Art Type:</strong> {formatArtType(selectedArtisan.artType, selectedArtisan.otherArtType)}</p>
                <p><strong className="text-[#783be8]">Experience:</strong> {selectedArtisan.experience ? `${selectedArtisan.experience} years` : 'N/A'}</p>
                <p><strong className="text-[#783be8]">Location:</strong> {selectedArtisan.address?.city || 'N/A'}, {selectedArtisan.address?.state || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Message <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                  rows="3"
                  maxLength="500"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] resize-none font-medium transition-all"
                  placeholder="Introduce yourself and why you'd like to connect..."
                />
                <p className="text-xs text-gray-500 mt-2 font-medium">{connectionMessage.length}/500</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Purpose <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={connectionPurpose}
                  onChange={(e) => setConnectionPurpose(e.target.value)}
                  rows="2"
                  maxLength="500"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] resize-none font-medium transition-all"
                  placeholder="What program or opportunity are you reaching out about?"
                />
                <p className="text-xs text-gray-500 mt-2 font-medium">{connectionPurpose.length}/500</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeModal}
                disabled={sendingRequest}
                className="px-6 py-3 border-2 border-purple-200 rounded-xl text-gray-700 hover:bg-purple-50 transition font-bold disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px -10px rgba(120, 59, 232, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendConnection}
                disabled={sendingRequest}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-bold shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {sendingRequest ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Request
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BrowseArtisans;
