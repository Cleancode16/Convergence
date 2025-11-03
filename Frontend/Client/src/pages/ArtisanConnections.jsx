import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Mail, Phone, Globe, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';
import { getConnectionRequests, acceptConnectionRequest, rejectConnectionRequest, getConnectedNgos } from '../services/artisanService';

const ArtisanConnections = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [processingId, setProcessingId] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-amber-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate('/artisan-dashboard')}
              className="text-white hover:text-gray-200 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">NGO Connections</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === 'requests'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Connection Requests
              </button>
              <button
                onClick={() => setActiveTab('connected')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === 'connected'
                    ? 'border-amber-600 text-amber-600'
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : activeTab === 'requests' ? (
          requests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No connection requests found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {requests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-teal-100 p-3 rounded-full">
                          <Building2 className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{request.ngo.name}</h3>
                          <p className="text-sm text-gray-500">{request.ngo.email}</p>
                        </div>
                      </div>

                      {request.ngoProfile && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 className="w-4 h-4 text-teal-600" />
                            <span className="capitalize">
                              {request.ngoProfile.ngoType === 'others' 
                                ? request.ngoProfile.otherNgoType 
                                : request.ngoProfile.ngoType.replace(/_/g, ' ')}
                            </span>
                          </div>
                          {request.ngoProfile.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4 text-teal-600" />
                              <span>{request.ngoProfile.phoneNumber}</span>
                            </div>
                          )}
                          {request.ngoProfile.address?.city && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-teal-600" />
                              <span>{request.ngoProfile.address.city}, {request.ngoProfile.address.state}</span>
                            </div>
                          )}
                          {request.ngoProfile.website && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Globe className="w-4 h-4 text-teal-600" />
                              <a 
                                href={request.ngoProfile.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:underline"
                              >
                                Visit Website
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {request.message && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                          <p className="text-sm text-gray-600">{request.message}</p>
                        </div>
                      )}

                      {request.purpose && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Purpose:</p>
                          <p className="text-sm text-gray-600">{request.purpose}</p>
                        </div>
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
                        <button
                          onClick={() => handleAccept(request._id)}
                          disabled={processingId === request._id}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          disabled={processingId === request._id}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          connections.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No connected NGOs yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((connection) => (
                <div key={connection._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-teal-100 p-3 rounded-full">
                      <Building2 className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{connection.ngo.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-teal-600" />
                      <span className="truncate">{connection.ngo.email}</span>
                    </div>

                    {connection.ngoProfile?.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-teal-600" />
                        <span>{connection.ngoProfile.phoneNumber}</span>
                      </div>
                    )}

                    {connection.ngoProfile?.address?.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-teal-600" />
                        <span>{connection.ngoProfile.address.city}, {connection.ngoProfile.address.state}</span>
                      </div>
                    )}

                    {connection.ngoProfile?.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-teal-600" />
                        <a 
                          href={connection.ngoProfile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:underline truncate"
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

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Connected on {formatDate(connection.updatedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default ArtisanConnections;
