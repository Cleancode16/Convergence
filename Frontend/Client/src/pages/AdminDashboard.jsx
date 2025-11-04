import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, CheckCircle, AlertCircle, XCircle, Clock, LogOut, Search, BookOpen, Plus, ArrowRight, Menu, ChevronDown, Sparkles, X, BarChart3, Edit2, Trash2, ExternalLink } from 'lucide-react';
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
  const [showQuickNav, setShowQuickNav] = useState(false);

  const artForms = [
    'Pottery', 'Weaving', 'Tanjore Paintings', 'Puppetry', 'Dokra Jewellery',
    'Meenakari', 'Kondapalli Bommalu', 'Ikkat', 'Mandala Art', 'Madhubani Painting',
    'Warli Art', 'Pattachitra', 'Kalamkari', 'Bidriware', 'Blue Pottery'
  ];

  const adminSections = [
    {
      id: 'overview',
      title: 'Admin Control Center',
      description: 'Monitor platform health, track key metrics, and oversee all operations from a centralized dashboard.',
      icon: Users,
      gradient: 'from-indigo-600 to-purple-600',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200',
      imagePosition: 'left',
      isStats: true
    },
    {
      id: 'artisans',
      title: 'Artisan Verification',
      description: 'Review artisan profiles, verify authenticity, and maintain the integrity of our artisan community.',
      icon: Users,
      gradient: 'from-blue-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200',
      imagePosition: 'right',
      isArtisans: true
    },
    {
      id: 'stories',
      title: 'Art Stories Management',
      description: 'Create, edit, and manage educational content about Indian art forms to inspire and educate users.',
      icon: BookOpen,
      gradient: 'from-indigo-600 to-purple-600',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200',
      imagePosition: 'left',
      isStories: true
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Fixed Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>

            <div className="flex items-center gap-3">
              {/* Desktop Quick Nav */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setShowQuickNav(!showQuickNav)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg hover:from-indigo-200 hover:to-purple-200 transition font-semibold border border-indigo-200"
                >
                  <Menu className="w-5 h-5" />
                  <span>Quick Access</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showQuickNav ? 'rotate-180' : ''}`} />
                </button>

                {showQuickNav && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    {/* ...dropdown menu similar to other dashboards... */}
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-Width Scrolling Sections */}
      <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
        {adminSections.map((section, index) => {
          const Icon = section.icon;
          
          return (
            <section
              key={section.id}
              id={section.id}
              className="snap-start min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-white pt-24"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-5`}></div>

              <div className="relative w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-y-auto">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${section.imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Text Content */}
                  <div className={`flex flex-col justify-center ${section.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'} space-y-6`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                      {section.title}
                    </h2>
                    
                    <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                      {section.description}
                    </p>

                    {/* Stats Grid for Overview Section */}
                    {section.isStats && stats && (
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30 hover:scale-105 transition">
                          <CheckCircle className="w-8 h-8 mb-2 text-green-600" />
                          <p className="text-3xl font-bold text-gray-900">{stats.verified || 0}</p>
                          <p className="text-sm text-gray-600">Verified</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30 hover:scale-105 transition">
                          <Clock className="w-8 h-8 mb-2 text-yellow-600" />
                          <p className="text-3xl font-bold text-gray-900">{stats.pendingVerification || 0}</p>
                          <p className="text-sm text-gray-600">Pending</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30 hover:scale-105 transition">
                          <Users className="w-8 h-8 mb-2 text-blue-600" />
                          <p className="text-3xl font-bold text-gray-900">{stats.totalArtisans || 0}</p>
                          <p className="text-sm text-gray-600">Total Artisans</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30 hover:scale-105 transition">
                          <AlertCircle className="w-8 h-8 mb-2 text-red-600" />
                          <p className="text-3xl font-bold text-gray-900">{stats.fraud || 0}</p>
                          <p className="text-sm text-gray-600">Flagged</p>
                        </div>
                      </div>
                    )}

                    {/* Artisan List for Artisans Section */}
                    {section.isArtisans && (
                      <div className="space-y-4">
                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              placeholder="Search artisans..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                            />
                          </div>
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="fraud">Fraud</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        {/* Artisan Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                          {artisans.slice(0, 6).map((artisan) => {
                            if (!artisan.user) return null;
                            return (
                              <div
                                key={artisan._id}
                                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 hover:shadow-xl transition border border-white/30"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h3 className="text-sm font-bold text-gray-900">
                                      {artisan.user?.name || 'Unknown'}
                                    </h3>
                                    <p className="text-xs text-gray-600">{artisan.user?.email || 'N/A'}</p>
                                  </div>
                                  {getStatusBadge(artisan.verificationStatus)}
                                </div>

                                {artisan.verificationStatus === 'pending' && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => openModal(artisan, 'verify')}
                                      className="flex-1 px-2 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs font-medium"
                                    >
                                      Verify
                                    </button>
                                    <button
                                      onClick={() => openModal(artisan, 'fraud')}
                                      className="flex-1 px-2 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs font-medium"
                                    >
                                      Fraud
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Stories Section - Enhanced */}
                    {section.isStories && (
                      <div className="space-y-4">
                        <button
                          onClick={() => setShowStoryModal(true)}
                          className={`group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${section.gradient} text-white rounded-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold`}
                        >
                          <Plus className="w-6 h-6" />
                          <span>Create New Story</span>
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Enhanced Story Cards with Edit/Delete */}
                        <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                          {stories.length === 0 ? (
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 text-center border border-white/30">
                              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500 text-sm">No stories created yet</p>
                              <p className="text-gray-400 text-xs mt-1">Click "Create New Story" to get started</p>
                            </div>
                          ) : (
                            stories.map((story) => (
                              <div
                                key={story._id}
                                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/40 group"
                              >
                                <div className="flex flex-col sm:flex-row">
                                  {/* Story Info */}
                                  <div className="flex-1 p-6">
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium">
                                            {story.artForm}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {new Date(story.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition">
                                          {story.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                          {story.description || 'No description available'}
                                        </p>
                                        
                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                          <span className="flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            {story.views || 0} views
                                          </span>
                                          <span className="flex items-center gap-1">
                                            ❤️ {story.likesCount || 0} likes
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                      <button
                                        onClick={() => window.open(story.storybookLink, '_blank')}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition text-sm font-medium shadow-md"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                        View Story
                                      </button>
                                      <button
                                        onClick={() => handleEditStory(story)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition text-sm font-medium shadow-md"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteStory(story._id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition text-sm font-medium shadow-md"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                      </button>
                                    </div>
                                  </div>

                                  {/* Gemini AI Badge */}
                                  <div className="sm:w-24 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex flex-col items-center justify-center border-l border-white/40">
                                    <Sparkles className="w-8 h-8 text-indigo-600 mb-2" />
                                    <p className="text-xs font-semibold text-indigo-700 text-center">Gemini AI</p>
                                    <p className="text-xs text-gray-500 text-center">Powered</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Story Count Badge */}
                        {stories.length > 0 && (
                          <div className="text-center pt-4">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-white/40 shadow-sm">
                              <BookOpen className="w-4 h-4 text-indigo-600" />
                              {stories.length} {stories.length === 1 ? 'Story' : 'Stories'} Created
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Image */}
                  <div className={`relative ${section.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'} group`}>
                    <div className="relative h-[350px] rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                    </div>
                    
                    <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-2xl p-4 transform group-hover:scale-105 transition-transform">
                      <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {index + 1}/{adminSections.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Indicator (first section only) */}
              {index === 0 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <div className="w-6 h-10 border-2 border-indigo-400 rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Artisan Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {modalAction === 'verify' && 'Verify Artisan'}
              {modalAction === 'fraud' && 'Report Artisan as Fraud'}
              {modalAction === 'reject' && 'Reject Artisan'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes / Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your notes or reason here..."
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                disabled={actionLoading}
              >
                {actionLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {modalAction === 'verify' && 'Verify Artisan'}
                {modalAction === 'fraud' && 'Report as Fraud'}
                {modalAction === 'reject' && 'Reject Artisan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Story Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white p-6 rounded-t-3xl border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {editingStory ? 'Edit Art Story' : 'Create New Art Story'}
                    </h3>
                    <p className="text-sm text-indigo-100">Gemini AI Powered Content</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowStoryModal(false);
                    setEditingStory(null);
                    setStoryForm({ artForm: '', title: '', storybookLink: '', description: '' });
                  }}
                  className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleStorySubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Art Form <span className="text-red-500">*</span>
                </label>
                <select
                  value={storyForm.artForm}
                  onChange={(e) => setStoryForm({ ...storyForm, artForm: e.target.value })}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                >
                  <option value="">Select an art form</option>
                  {artForms.map((art) => (
                    <option key={art} value={art}>{art}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Story Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={storyForm.title}
                  onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="e.g., The Heritage of Indian Pottery"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gemini Storybook Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={storyForm.storybookLink}
                  onChange={(e) => setStoryForm({ ...storyForm, storybookLink: e.target.value })}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="https://gemini.google.com/share/..."
                  required
                />
                <div className="flex items-start gap-2 mt-2 p-3 bg-indigo-50 rounded-lg">
                  <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-indigo-700">
                    Paste your Gemini AI generated storybook share link here. Users will be able to view it in a new tab.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={storyForm.description}
                  onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                  placeholder="Brief description about this art form and what readers will learn..."
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowStoryModal(false);
                    setEditingStory(null);
                    setStoryForm({ artForm: '', title: '', storybookLink: '', description: '' });
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-lg"
                >
                  {editingStory ? '✓ Update Story' : '✨ Create Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .snap-y {
          scroll-snap-type: y mandatory;
          scrollbar-width: thin;
          scrollbar-color: rgba(124, 58, 237, 0.3) rgba(249, 250, 251, 1);
        }
        .snap-y::-webkit-scrollbar {
          width: 8px;
        }
        .snap-y::-webkit-scrollbar-track {
          background: rgba(249, 250, 251, 1);
        }
        .snap-y::-webkit-scrollbar-thumb {
          background: rgba(124, 58, 237, 0.3);
          border-radius: 4px;
        }
        .snap-y::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 58, 237, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(249, 250, 251, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>

      {/* Click outside to close dropdown */}
      {showQuickNav && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowQuickNav(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;