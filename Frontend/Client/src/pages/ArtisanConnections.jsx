import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Mail, Phone, Globe, CheckCircle, XCircle, Clock, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConnectionRequests, acceptConnectionRequest, rejectConnectionRequest, getConnectedNgos } from '../services/artisanService';
import ChatModal from '../components/ChatModal';

const ArtisanConnections = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [processingId, setProcessingId] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab, filterStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'requests') {
        const data = await getConnectionRequests(userInfo.token, filterStatus);
        setRequests(data.data || []);
      } else {
        const data = await getConnectedNgos(userInfo.token);
        setConnections(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      setProcessingId(connectionId);
      await acceptConnectionRequest(connectionId, userInfo.token);
      alert('Connection request accepted!');
      fetchData();
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (connectionId) => {
    if (!confirm('Are you sure you want to reject this connection request?')) return;
    
    try {
      setProcessingId(connectionId);
      await rejectConnectionRequest(connectionId, userInfo.token);
      alert('Connection request rejected');
      fetchData();
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <nav className="bg-white shadow-lg border-b-4 border-[#783be8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <motion.button
              onClick={() => navigate('/artisan-dashboard')}
              className="text-[#783be8] hover:text-purple-700 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/artisan-dashboard')}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-6 h-6 text-[#783be8]" />
              </motion.div>
              <motion.h1 
                className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CraftConnect
              </motion.h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl mb-6 border-2 border-purple-100"
        >
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition ${
                  activeTab === 'requests'
                    ? 'border-[#783be8] text-[#783be8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Connection Requests
              </button>
              <button
                onClick={() => setActiveTab('connected')}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition ${
                  activeTab === 'connected'
                    ? 'border-[#783be8] text-[#783be8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Connected NGOs
              </button>
            </div>
          </div>

          {/* Filter for Requests Tab */}
          {activeTab === 'requests' && (
            <div className="p-4 border-b border-gray-200">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] bg-white transition font-medium"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
        </motion.div>

        {/* Content */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-xl border-2 border-purple-100"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="rounded-full h-12 w-12 border-4 border-[#783be8] border-t-transparent mx-auto"
            />
            <p className="mt-4 text-gray-600 font-medium">Loading...</p>
          </motion.div>
        ) : activeTab === 'requests' ? (
          requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-purple-100"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Clock className="w-16 h-16 text-[#783be8] mx-auto mb-4" />
              </motion.div>
              <p className="text-gray-500 text-lg font-medium">No connection requests found</p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 gap-6"
            >
              {requests.map((request, index) => (
                <motion.div
                  key={request._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100 hover:border-[#783be8] transition"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-purple-100 p-3 rounded-full">
                          <Building2 className="w-6 h-6 text-[#783be8]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{request.ngo.name}</h3>
                          <p className="text-sm text-gray-500">{request.ngo.email}</p>
                        </div>
                      </div>

                      {request.ngoProfile && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 className="w-4 h-4 text-[#783be8]" />
                            <span className="capitalize">
                              {request.ngoProfile.ngoType === 'others' 
                                ? request.ngoProfile.otherNgoType 
                                : request.ngoProfile.ngoType.replace(/_/g, ' ')}
                            </span>
                          </div>
                          {request.ngoProfile.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4 text-[#783be8]" />
                              <span>{request.ngoProfile.phoneNumber}</span>
                            </div>
                          )}
                          {request.ngoProfile.address?.city && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-[#783be8]" />
                              <span>{request.ngoProfile.address.city}, {request.ngoProfile.address.state}</span>
                            </div>
                          )}
                          {request.ngoProfile.website && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Globe className="w-4 h-4 text-[#783be8]" />
                              <a 
                                href={request.ngoProfile.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#783be8] hover:underline font-medium"
                              >
                                Visit Website
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {request.message && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl mb-3 border border-purple-100">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Message:</p>
                          <p className="text-sm text-gray-600">{request.message}</p>
                        </div>
                      )}

                      {request.purpose && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl mb-3 border border-blue-100">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Purpose:</p>
                          <p className="text-sm text-gray-600">{request.purpose}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Received: {formatDate(request.createdAt)}</span>
                        {request.status === 'pending' ? (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-extrabold border-2 border-yellow-200">
                            Pending
                          </span>
                        ) : request.status === 'accepted' ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-extrabold border-2 border-green-200">
                            Accepted
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-extrabold border-2 border-red-200">
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex flex-col gap-2 md:w-48">
                        <motion.button
                          onClick={() => handleAccept(request._id)}
                          disabled={processingId === request._id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </motion.button>
                        <motion.button
                          onClick={() => handleReject(request._id)}
                          disabled={processingId === request._id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )
        ) : (
          connections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-purple-100"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Building2 className="w-16 h-16 text-[#783be8] mx-auto mb-4" />
              </motion.div>
              <p className="text-gray-500 text-lg font-medium">No connected NGOs yet</p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {connections.map((connection, index) => (
                <motion.div
                  key={connection._id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100 hover:border-[#783be8] transition"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Building2 className="w-6 h-6 text-[#783be8]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{connection.ngo.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-[#783be8]" />
                      <span className="truncate">{connection.ngo.email}</span>
                    </div>

                    {connection.ngoProfile?.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-[#783be8]" />
                        <span>{connection.ngoProfile.phoneNumber}</span>
                      </div>
                    )}

                    {connection.ngoProfile?.address?.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-[#783be8]" />
                        <span>{connection.ngoProfile.address.city}, {connection.ngoProfile.address.state}</span>
                      </div>
                    )}

                    {connection.ngoProfile?.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-[#783be8]" />
                        <a 
                          href={connection.ngoProfile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#783be8] hover:underline truncate font-medium"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {connection.ngoProfile?.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {connection.ngoProfile.description}
                    </p>
                  )}

                  <div className="pt-3 border-t-2 border-purple-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500">Connected on {formatDate(connection.updatedAt)}</p>
                    <motion.button
                      onClick={() => openChat(connection)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-lg hover:shadow-lg transition text-sm font-semibold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )
        )}
      </main>

      {/* Chat Modal */}
      {showChatModal && selectedConnection && (
        <ChatModal connection={selectedConnection} onClose={closeChat} />
      )}
    </div>
  );
};

export default ArtisanConnections;
