import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, BookOpen, ExternalLink, Calendar, Eye, Sparkles, Search, X } from 'lucide-react';
import { getAllStories } from '../services/artStoryService';

const ArtsAndStories = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtForm, setSelectedArtForm] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Available art forms (extracted from stories)
  const [artForms, setArtForms] = useState([]);

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    // Extract unique art forms from stories
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

  // Apply filters and sorting
  const filteredStories = stories
    .filter(story => {
      // Search filter
      const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.artForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Art form filter
      const matchesArtForm = selectedArtForm === 'all' || story.artForm === selectedArtForm;
      
      return matchesSearch && matchesArtForm;
    })
    .sort((a, b) => {
      // Sorting logic
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Search & Filters Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Discover Indian Art Forms</h2>
          </div>

          {/* Search and Filters in One Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Bar */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stories..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            {/* Art Form Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedArtForm}
                onChange={(e) => setSelectedArtForm(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
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
                <button
                  onClick={clearFilters}
                  className="w-full px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                  title="Clear filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Active Filters Tags */}
          {(selectedArtForm !== 'all' || sortBy !== 'newest') && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedArtForm !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                  {selectedArtForm}
                  <button onClick={() => setSelectedArtForm('all')} className="hover:text-indigo-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {sortBy !== 'newest' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {sortBy === 'oldest' ? 'Oldest' : sortBy === 'popular' ? 'Popular' : 'A-Z'}
                  <button onClick={() => setSortBy('newest')} className="hover:text-purple-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm">
            <span className="font-bold text-indigo-600">{filteredStories.length}</span> {filteredStories.length === 1 ? 'story' : 'stories'} found
          </p>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading stories...</p>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters!</p>
            {(selectedArtForm !== 'all' || searchTerm || sortBy !== 'newest') && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div
                key={story._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                {/* Card Header with Art Form Badge */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold">
                      {story.artForm}
                    </span>
                    <BookOpen className="w-6 h-6" />
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
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{story.views || 0} views</span>
                    </div>
                  </div>

                  {/* Storybook Link Info */}
                  {story.storybookLink && (
                    <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                      <div className="flex items-center gap-2 text-indigo-700 text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-medium">Interactive Gemini Storybook Available</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleOpenStory(story.storybookLink)}
                    disabled={!story.storybookLink}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      story.storybookLink
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Open Storybook</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  {!story.storybookLink && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Story link not available
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State Alternative */}
        {!loading && stories.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="max-w-md mx-auto">
              <BookOpen className="w-24 h-24 text-indigo-300 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Stories Yet</h3>
              <p className="text-gray-600 mb-6">
                The admin hasn't added any art stories yet. Check back soon for exciting content about Indian traditional arts!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArtsAndStories;
