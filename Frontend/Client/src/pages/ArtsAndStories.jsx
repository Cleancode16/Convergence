import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, BookOpen, ExternalLink, Calendar, Eye, Sparkles, Search, X } from 'lucide-react';
import { getAllStories } from '../services/artStoryService';
import { motion } from 'framer-motion';

const ArtsAndStories = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtForm, setSelectedArtForm] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [artForms, setArtForms] = useState([]);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (stories.length > 0) {
      const uniqueForms = [...new Set(stories.map(story => story.artForm))];
      setArtForms(uniqueForms.sort());
    }
  }, [stories]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      
      const data = await getAllStories(filters);
      setStories(data.data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStory = (storybookLink) => {
    if (storybookLink) {
      window.open(storybookLink, '_blank', 'noopener,noreferrer');
    }
  };

  const clearFilters = () => {
    setSelectedArtForm('all');
    setSortBy('newest');
    setSearchTerm('');
  };

  const filteredStories = stories
    .filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.artForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesArtForm = selectedArtForm === 'all' || story.artForm === selectedArtForm;
      
      return matchesSearch && matchesArtForm;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="text-white hover:text-gray-200 transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-white" />
                <h1 className="text-xl sm:text-2xl font-bold text-white">Arts & Stories</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Discover Indian Art Forms</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* Search Bar */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stories..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
              />
            </div>

            {/* Art Form Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedArtForm}
                onChange={(e) => setSelectedArtForm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Art Forms</option>
                {artForms.map((form) => (
                  <option key={form} value={form}>{form}</option>
                ))}
              </select>
            </div>

            {/* Sort By Filter */}
            <div className="sm:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white outline-none appearance-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>

            {/* Clear Button */}
            {(selectedArtForm !== 'all' || sortBy !== 'newest' || searchTerm) && (
              <div className="sm:col-span-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center justify-center"
                  title="Clear filters"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Active Filters Tags */}
          {(selectedArtForm !== 'all' || sortBy !== 'newest') && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedArtForm !== 'all' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-semibold"
                >
                  {selectedArtForm}
                  <button onClick={() => setSelectedArtForm('all')} className="hover:text-indigo-900">
                    <X className="w-4 h-4" />
                  </button>
                </motion.span>
              )}
              {sortBy !== 'newest' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold"
                >
                  {sortBy === 'oldest' ? 'Oldest' : sortBy === 'popular' ? 'Popular' : 'A-Z'}
                  <button onClick={() => setSortBy('newest')} className="hover:text-purple-900">
                    <X className="w-4 h-4" />
                  </button>
                </motion.span>
              )}
            </div>
          )}

          <div className="mt-4">
            <p className="text-gray-700 text-sm font-medium">
              <span className="font-bold text-indigo-600">{filteredStories.length}</span> {filteredStories.length === 1 ? 'story' : 'stories'} found
            </p>
          </div>
        </motion.div>

        {/* Stories Grid */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
            </motion.div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Loading stories...</p>
          </div>
        ) : filteredStories.length === 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="bg-white rounded-2xl shadow-xl p-16 text-center"
          >
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters!</p>
            {(selectedArtForm !== 'all' || searchTerm || sortBy !== 'newest') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-lg"
              >
                Clear Filters
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {filteredStories.map((story) => (
              <motion.div
                key={story._id}
                variants={scaleIn}
                whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition cursor-pointer border-2 border-transparent hover:border-indigo-200 flex flex-col"
              >
                {/* Card Header with Art Form Badge */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {story.artForm}
                    </span>
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold leading-tight line-clamp-2">
                    {story.title}
                  </h3>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Description */}
                  <div className="mb-4 flex-1">
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                      {story.description || story.introduction || 'Explore this fascinating art form through an interactive AI-generated storybook experience.'}
                    </p>
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span>{story.views || 0} views</span>
                    </div>
                  </div>

                  {/* Storybook Link Info */}
                  {story.storybookLink && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-100">
                      <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium">
                        <Sparkles className="w-5 h-5" />
                        <span>Interactive Gemini Storybook Available</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenStory(story.storybookLink)}
                    disabled={!story.storybookLink}
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
                      story.storybookLink
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Open Storybook</span>
                    <ExternalLink className="w-5 h-5" />
                  </motion.button>

                  {!story.storybookLink && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Story link not available
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && stories.length === 0 && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="bg-white rounded-2xl shadow-xl p-16 text-center"
          >
            <div className="max-w-md mx-auto">
              <BookOpen className="w-24 h-24 text-indigo-300 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Stories Yet</h3>
              <p className="text-gray-600 mb-6">
                The admin hasn't added any art stories yet. Check back soon for exciting content about Indian traditional arts!
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ArtsAndStories;
