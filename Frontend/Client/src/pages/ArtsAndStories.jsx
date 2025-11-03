import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Search, BookOpen, Heart, Eye, Sparkles } from 'lucide-react';
import { getAllStories, toggleLike } from '../services/artStoryService';

const ArtsAndStories = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStories();
  }, []);

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

  const handleLike = async (storyId) => {
    if (!userInfo) {
      alert('Please login to like stories');
      return;
    }

    try {
      const data = await toggleLike(storyId, userInfo.token);
      setStories(prev => prev.map(story => 
        story._id === storyId 
          ? { ...story, likesCount: data.likesCount, likes: data.liked ? [...(story.likes || []), userInfo._id] : (story.likes || []).filter(id => id !== userInfo._id) }
          : story
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStories();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/user-dashboard')}
                className="text-white hover:text-gray-200 transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-white" />
                <h1 className="text-2xl font-bold text-white">Arts & Stories</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Discover Indian Art Forms</h2>
          </div>
          <p className="text-lg text-indigo-100">
            Explore AI-generated storybooks about traditional Indian arts, their history, and cultural significance
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for art forms..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </form>
          <div className="mt-4 text-sm text-gray-600">
            {stories.length} {stories.length === 1 ? 'story' : 'stories'} available
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No stories found</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new stories!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group cursor-pointer"
              >
                {/* Cover Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    onClick={() => navigate(`/art-story/${story._id}`)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* AI Badge */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Generated
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(story._id);
                    }}
                    className={`absolute top-3 left-3 p-2 rounded-full transition ${
                      story.likes?.includes(userInfo?._id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={story.likes?.includes(userInfo?._id) ? 'currentColor' : 'none'} />
                  </button>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-xl line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-indigo-200 text-sm mt-1">{story.artForm}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                    {story.introduction}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {story.likesCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {story.views || 0}
                      </span>
                    </div>
                  </div>

                  {/* Read Button */}
                  <button
                    onClick={() => navigate(`/art-story/${story._id}`)}
                    className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Read Story
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ArtsAndStories;
