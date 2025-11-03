import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, CheckCircle, AlertCircle, XCircle, Clock, LogOut, Search } from 'lucide-react';
import { logout } from '../redux/actions/authActions';
import { getArtisanStats, getAllArtisans, verifyArtisan, markAsFraud, rejectArtisan } from '../services/adminService';
import { createArtStory, updateArtStory, getAllStories, deleteStory } from '../services/artStoryService';

const AdminDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [artisans, setArtisans] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [storyForm, setStoryForm] = useState({
    artForm: '',
    title: '',
    storybookLink: '',
    description: '',
  });

  const artForms = [
    'Pottery', 'Weaving', 'Tanjore Paintings', 'Puppetry', 'Dokra Jewellery',
    'Meenakari', 'Kondapalli Bommalu', 'Ikkat', 'Mandala Art', 'Madhubani Painting',
    'Warli Art', 'Pattachitra', 'Kalamkari', 'Bidriware', 'Blue Pottery'
  ];

  useEffect(() => {
    fetchData();
    fetchStories();
  }, [userInfo, filterStatus, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, artisansData] = await Promise.all([
        getArtisanStats(userInfo.token),
        getAllArtisans(userInfo.token, filterStatus, searchTerm)
      ]);
      setStats(statsData.data);
      setArtisans(artisansData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const data = await getAllStories();
      setStories(data.data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  const openModal = (artisan, action) => {
    setSelectedArtisan(artisan);
    setModalAction(action);
    setNotes('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArtisan(null);
    setModalAction('');
    setNotes('');
  };

  const handleAction = async () => {
    if (!selectedArtisan) return;

    try {
      setActionLoading(true);
      
      if (modalAction === 'verify') {
        await verifyArtisan(selectedArtisan._id, notes, userInfo.token);
      } else if (modalAction === 'fraud') {
        if (!notes.trim()) {
          alert('Please provide a reason for marking as fraud');
          return;
        }
        await markAsFraud(selectedArtisan._id, notes, userInfo.token);
      } else if (modalAction === 'reject') {
        if (!notes.trim()) {
          alert('Please provide a reason for rejection');
          return;
        }
        await rejectArtisan(selectedArtisan._id, notes, userInfo.token);
      }

      closeModal();
      fetchData();
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    
    if (!storyForm.artForm || !storyForm.title || !storyForm.storybookLink) {
      alert('Please fill all required fields');
      return;
    }

    try {
      if (editingStory) {
        await updateArtStory(editingStory._id, storyForm, userInfo.token);
        alert('Art story updated successfully!');
      } else {
        await createArtStory(storyForm, userInfo.token);
        alert('Art story created successfully!');
      }
      
      setShowStoryModal(false);
      setEditingStory(null);
      setStoryForm({ artForm: '', title: '', storybookLink: '', description: '' });
      fetchStories();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditStory = (story) => {
    setEditingStory(story);
    setStoryForm({
      artForm: story.artForm,
      title: story.title,
      storybookLink: story.storybookLink,
      description: story.description || '',
    });
    setShowStoryModal(true);
  };

  const handleDeleteStory = async (storyId) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      await deleteStory(storyId, userInfo.token);
      alert('Story deleted successfully');
      fetchStories();
    } catch (error) {
      alert(error.message);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Verified' },
      fraud: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Fraud' },
      rejected: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Rejected' },
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {badge.text}
      </span>
    );
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Artisans</p>
                <p className="text-3xl font-bold text-indigo-600">{stats?.totalArtisans || 0}</p>
              </div>
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.pendingVerification || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-3xl font-bold text-green-600">{stats?.verified || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fraud</p>
                <p className="text-3xl font-bold text-red-600">{stats?.fraud || 0}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-gray-600">{stats?.rejected || 0}</p>
              </div>
              <XCircle className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Artisans List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Artisan List</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search artisans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="fraud">Fraud</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Artisans Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artisan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Art Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {artisans.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No artisans found
                    </td>
                  </tr>
                ) : (
                  artisans.map((artisan) => (
                    <tr key={artisan._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{artisan.user.name}</div>
                          <div className="text-sm text-gray-500">{artisan.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {artisan.artType === 'others' ? artisan.otherArtType : artisan.artType.replace(/_/g, ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{artisan.phoneNumber}</div>
                        <div className="text-sm text-gray-500">Aadhar: {artisan.aadharNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(artisan.verificationStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {artisan.verificationStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => openModal(artisan, 'verify')}
                                className="text-green-600 hover:text-green-900 font-medium"
                              >
                                Verify
                              </button>
                              <button
                                onClick={() => openModal(artisan, 'fraud')}
                                className="text-red-600 hover:text-red-900 font-medium"
                              >
                                Fraud
                              </button>
                              <button
                                onClick={() => openModal(artisan, 'reject')}
                                className="text-gray-600 hover:text-gray-900 font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {artisan.verificationStatus !== 'pending' && (
                            <span className="text-gray-500 italic">
                              {artisan.verifiedBy?.name && `By ${artisan.verifiedBy.name}`}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Art Stories Management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Art Stories & Videos</h2>
            <button
              onClick={() => setShowStoryModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Add New Story
            </button>
          </div>

          {/* Existing Stories */}
          <div className="space-y-3">
            {stories.map((story) => (
              <div key={story._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{story.title}</p>
                  <p className="text-sm text-gray-600">{story.artForm}</p>
                  <p className="text-xs text-gray-500 mt-1">{story.storybookLink}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditStory(story)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStory(story._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {stories.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No stories added yet</p>
            )}
          </div>
        </div>

        {/* Story Modal */}
        {showStoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingStory ? 'Edit Art Story' : 'Add New Art Story'}
              </h3>
              
              <form onSubmit={handleStorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Art Form <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={storyForm.artForm}
                    onChange={(e) => setStoryForm({ ...storyForm, artForm: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">-- Select Art Form --</option>
                    {artForms.map((art) => (
                      <option key={art} value={art}>{art}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={storyForm.title}
                    onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., The Art of Indian Pottery"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Storybook Link (Gemini AI Storybook) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={storyForm.storybookLink}
                    onChange={(e) => setStoryForm({ ...storyForm, storybookLink: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://gemini.google.com/share/..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste Gemini AI Storybook share link (will open in new window for users)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={storyForm.description}
                    onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief description about this art form..."
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStoryModal(false);
                      setEditingStory(null);
                      setStoryForm({ artForm: '', title: '', storybookLink: '', description: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    {editingStory ? 'Update Story' : 'Create Story'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
