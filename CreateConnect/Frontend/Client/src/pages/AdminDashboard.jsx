import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, CheckCircle, AlertCircle, XCircle, Clock, LogOut, Search, Shield, BookOpen, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
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

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const fadeInDown = {
    hidden: { opacity: 0, y: -60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <div className="w-16 h-16 border-4 border-[#783be8] border-t-transparent rounded-full"></div>
          </motion.div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/admin-dashboard')}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="w-8 h-8 text-[#783be8]" />
              </motion.div>
              <motion.h1 
                className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CraftConnect
              </motion.h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-semibold shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div 
            variants={scaleIn}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.2)" }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Artisans</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                  {stats?.totalArtisans || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-xl">
                <Users className="w-8 h-8 text-[#783be8]" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={scaleIn}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(234, 179, 8, 0.2)" }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-yellow-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.pendingVerification || 0}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={scaleIn}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(34, 197, 94, 0.2)" }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-green-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Verified</p>
                <p className="text-3xl font-bold text-green-600">{stats?.verified || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={scaleIn}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(239, 68, 68, 0.2)" }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-red-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Fraud</p>
                <p className="text-3xl font-bold text-red-600">{stats?.fraud || 0}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={scaleIn}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(107, 114, 128, 0.2)" }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-gray-600">{stats?.rejected || 0}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <XCircle className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Artisans List */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
              Artisan List
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search artisans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] w-full sm:w-64 outline-none transition"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] bg-white outline-none transition"
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
                  artisans.map((artisan) => {
                    // Add null check for artisan.user
                    if (!artisan.user) {
                      return null;
                    }

                    return (
                      <tr key={artisan._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {artisan.user?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {artisan.user?.email || 'N/A'}
                            </div>
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
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => openModal(artisan, 'verify')}
                                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-sm transition"
                                >
                                  Verify
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => openModal(artisan, 'fraud')}
                                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold shadow-sm transition"
                                >
                                  Fraud
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => openModal(artisan, 'reject')}
                                  className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold shadow-sm transition"
                                >
                                  Reject
                                </motion.button>
                              </>
                            )}
                            {artisan.verificationStatus !== 'pending' && (
                              <span className="text-gray-500 italic text-sm">
                                {artisan.verifiedBy?.name ? `By ${artisan.verifiedBy.name}` : 'Processed'}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }).filter(Boolean)
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Art Stories Management */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-[#783be8]" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                Art Stories & Videos
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStoryModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-semibold shadow-lg"
            >
              Add New Story
            </motion.button>
          </div>

          {/* Existing Stories */}
          <div className="space-y-4">
            {stories.map((story) => (
              <motion.div 
                key={story._id} 
                className="flex items-center justify-between p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-purple-100 shadow-sm"
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(120, 59, 232, 0.15)" }}
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg mb-1">{story.title}</p>
                  <p className="text-sm font-semibold text-[#783be8] mb-2">{story.artForm}</p>
                  <p className="text-xs text-gray-600 break-all">{story.storybookLink}</p>
                </div>
                <div className="flex gap-3 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditStory(story)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold shadow-md flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteStory(story._id)}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition font-semibold shadow-md flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
            {stories.length === 0 && (
              <p className="text-gray-500 text-center py-8 text-lg">No stories added yet</p>
            )}
          </div>
        </motion.div>

        {/* Story Modal */}
        {showStoryModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto border-2 border-purple-100"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent mb-6">
                {editingStory ? 'Edit Art Story' : 'Add New Art Story'}
              </h3>
              
              <form onSubmit={handleStorySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Art Form <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={storyForm.artForm}
                    onChange={(e) => setStoryForm({ ...storyForm, artForm: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] outline-none transition"
                    required
                  >
                    <option value="">-- Select Art Form --</option>
                    {artForms.map((art) => (
                      <option key={art} value={art}>{art}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={storyForm.title}
                    onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] outline-none transition"
                    placeholder="e.g., The Art of Indian Pottery"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Storybook Link (Gemini AI Storybook) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={storyForm.storybookLink}
                    onChange={(e) => setStoryForm({ ...storyForm, storybookLink: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] outline-none transition"
                    placeholder="https://gemini.google.com/share/..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Paste Gemini AI Storybook share link (will open in new window for users)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={storyForm.description}
                    onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] outline-none transition"
                    placeholder="Brief description about this art form..."
                  />
                </div>

                <div className="flex gap-4 justify-end pt-4 border-t border-purple-100">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setShowStoryModal(false);
                      setEditingStory(null);
                      setStoryForm({ artForm: '', title: '', storybookLink: '', description: '' });
                    }}
                    className="px-6 py-3 border-2 border-purple-300 rounded-xl text-gray-700 hover:bg-purple-50 transition font-semibold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-semibold shadow-lg"
                  >
                    {editingStory ? 'Update Story' : 'Create Story'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Action Modal for Verify/Fraud/Reject */}
        {showModal && selectedArtisan && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 border-purple-100"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent mb-4">
                {modalAction === 'verify' && 'Verify Artisan'}
                {modalAction === 'fraud' && 'Mark as Fraud'}
                {modalAction === 'reject' && 'Reject Artisan'}
              </h3>
              
              <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <p className="font-semibold text-gray-900 mb-1">{selectedArtisan.user?.name}</p>
                <p className="text-sm text-gray-600">{selectedArtisan.user?.email}</p>
                <p className="text-sm text-[#783be8] mt-1 font-medium capitalize">
                  {selectedArtisan.artType === 'others' ? selectedArtisan.otherArtType : selectedArtisan.artType.replace(/_/g, ' ')}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {modalAction === 'verify' ? 'Notes (Optional)' : 'Reason *'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] outline-none transition"
                  placeholder={modalAction === 'verify' ? 'Add any notes...' : 'Please provide a reason...'}
                />
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 border-2 border-purple-300 rounded-xl text-gray-700 hover:bg-purple-50 transition font-semibold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAction}
                  disabled={actionLoading}
                  className={`flex-1 px-6 py-3 rounded-xl text-white transition font-semibold shadow-lg ${
                    modalAction === 'verify'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                      : modalAction === 'fraud'
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                      : 'bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700'
                  }`}
                >
                  {actionLoading ? 'Processing...' : 'Confirm'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
