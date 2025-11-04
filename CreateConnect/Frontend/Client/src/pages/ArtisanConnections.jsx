import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Building2, Mail, Phone, Globe, CheckCircle, XCircle, Clock, MapPin, MessageCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/artisan-dashboard')}
              className="text-white hover:text-purple-100 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <h1 className="text-2xl font-bold text-white">NGO Connections</h1>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md mb-6"
        >
          <div className="border-b border-gray-200">
            <div className="flex">
              <motion.button
                whileHover={{ backgroundColor: 'rgba(111, 78, 236, 0.05)' }}
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === 'requests'
                    ? 'border-purple-600 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Connection Requests
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: 'rgba(111, 78, 236, 0.05)' }}
                onClick={() => setActiveTab('connected')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === 'connected'
                    ? 'border-purple-600 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Connected NGOs
              </motion.button>
            </div>
          </div>

          {activeTab === 'requests' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border-b border-gray-200"
            >
              <motion.select
                whileFocus={{ scale: 1.02 }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </motion.select>
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-white rounded-xl shadow-md"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"
              />
              <p className="mt-4 text-gray-600">Loading...</p>
            </motion.div>
          ) : activeTab === 'requests' ? (
            <motion.div
              key="requests"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {requests.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-md p-12 text-center"
                >
                  <Clock className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No connection requests found</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {requests.map((request, index) => (
                    <motion.div 
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-full"
                            >
                              <Building2 className="w-6 h-6 text-purple-600" />
                            </motion.div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{request.ngo.name}</h3>
                              <p className="text-sm text-gray-500">{request.ngo.email}</p>
                            </div>
                          </div>

                          {request.ngoProfile && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Building2 className="w-4 h-4 text-purple-600" />
                                <span className="capitalize">
                                  {request.ngoProfile.ngoType === 'others' 
                                    ? request.ngoProfile.otherNgoType 
                                    : request.ngoProfile.ngoType.replace(/_/g, ' ')}
                                </span>
                              </div>
                              {request.ngoProfile.phoneNumber && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4 text-purple-600" />
                                  <span>{request.ngoProfile.phoneNumber}</span>
                                </div>
                              )}
                              {request.ngoProfile.address?.city && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4 text-purple-600" />
                                  <span>{request.ngoProfile.address.city}, {request.ngoProfile.address.state}</span>
                                </div>
                              )}
                              {request.ngoProfile.website && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Globe className="w-4 h-4 text-purple-600" />
                                  <a 
                                    href={request.ngoProfile.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:underline"
                                  >
                                    Visit Website
                                  </a>
                                </div>
                              )}
                            </div>
                          )}

                          {request.message && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg mb-3"
                            >
                              <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                              <p className="text-sm text-gray-600">{request.message}</p>
                            </motion.div>
                          )}

                          {request.purpose && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="bg-blue-50 p-4 rounded-lg mb-3"
                            >
                              <p className="text-sm font-medium text-gray-700 mb-1">Purpose:</p>
                              <p className="text-sm text-gray-600">{request.purpose}</p>
                            </motion.div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Received: {formatDate(request.createdAt)}</span>
                            {request.status === 'pending' ? (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                                Pending
                              </span>
                            ) : request.status === 'accepted' ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                                Accepted
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                                Rejected
                              </span>
                            )}
                          </div>
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex flex-col gap-2 md:w-48">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAccept(request._id)}
                              disabled={processingId === request._id}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReject(request._id)}
                              disabled={processingId === request._id}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="connected"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {connections.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-md p-12 text-center"
                >
                  <Building2 className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No connected NGOs yet</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {connections.map((connection, index) => (
                    <motion.div 
                      key={connection._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-full"
                        >
                          <Building2 className="w-6 h-6 text-purple-600" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{connection.ngo.name}</h3>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-purple-600" />
                          <span className="truncate">{connection.ngo.email}</span>
                        </div>

                        {connection.ngoProfile?.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-purple-600" />
                            <span>{connection.ngoProfile.phoneNumber}</span>
                          </div>
                        )}

                        {connection.ngoProfile?.address?.city && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <span>{connection.ngoProfile.address.city}, {connection.ngoProfile.address.state}</span>
                          </div>
                        )}

                        {connection.ngoProfile?.website && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="w-4 h-4 text-purple-600" />
                            <a 
                              href={connection.ngoProfile.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:underline truncate"
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

                      <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-xs text-gray-500">Connected on {formatDate(connection.updatedAt)}</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openChat(connection)}
                          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition text-sm shadow-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {showChatModal && selectedConnection && (
        <ChatModal connection={selectedConnection} onClose={closeChat} />
      )}
    </div>
  );
};

export default ArtisanConnections;