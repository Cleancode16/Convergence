import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Search, Filter, Heart, Star, Eye } from 'lucide-react';
import { getAllPosts, toggleLike, toggleFavorite } from '../services/artistPostService';

const ExploreArtists = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [favorites, setFavorites] = useState([]);

  const specializations = [
    { value: 'all', label: 'All Arts' },
    { value: 'pottery', label: 'Pottery' },
    { value: 'weavery', label: 'Weavery' },
    { value: 'paintings', label: 'Paintings' },
    { value: 'tanjore paintings', label: 'Tanjore Paintings' },
    { value: 'puppetry', label: 'Puppetry' },
    { value: 'dokra jewellery', label: 'Dokra Jewellery' },
    { value: 'meenakari', label: 'Meenakari' },
    { value: 'kondapalli bommalu', label: 'Kondapalli Bommalu' },
    { value: 'ikkat', label: 'Ikkat' },
    { value: 'mandala', label: 'Mandala' },
    { value: 'stationary', label: 'Stationary' },
    { value: 'embroidery', label: 'Embroidery' },
    { value: 'wood carving', label: 'Wood Carving' },
    { value: 'metal work', label: 'Metal Work' },
    { value: 'textile', label: 'Textile' },
    { value: 'others', label: 'Others' },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (filterSpecialization && filterSpecialization !== 'all') {
        filters.specialization = filterSpecialization;
      }
      
      const data = await getAllPosts(filters);
      setPosts(data.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleLike = async (postId) => {
    if (!userInfo) {
      alert('Please login to like posts');
      return;
    }

    try {
      const data = await toggleLike(postId, userInfo.token);
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, likesCount: data.likesCount, likes: data.liked ? [...(post.likes || []), userInfo._id] : (post.likes || []).filter(id => id !== userInfo._id) }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFavorite = async (artistId) => {
    if (!userInfo) {
      alert('Please login to favorite artists');
      return;
    }

    if (!artistId) {
      alert('Artist information not available');
      return;
    }

    try {
      const data = await toggleFavorite(artistId, userInfo.token);
      if (data.isFavorite) {
        setFavorites(prev => [...prev, artistId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== artistId));
      }
      alert(data.message);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="text-white hover:text-gray-200 transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Explore Artists</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by artist name, specialization, description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Specialization Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white appearance-none"
              >
                {specializations.map((spec) => (
                  <option key={spec.value} value={spec.value}>
                    {spec.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={fetchPosts}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Search
            </button>

            <div className="text-sm text-gray-600">
              Showing {posts.length} artist{posts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Category Quick Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {specializations.map((spec) => (
              <button
                key={spec.value}
                onClick={() => {
                  setFilterSpecialization(spec.value);
                  setTimeout(fetchPosts, 100);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  filterSpecialization === spec.value
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {spec.label}
              </button>
            ))}
          </div>
        </div>

        {/* Artists Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading artists...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No artists found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              // Add null checks
              if (!post.artisan) {
                return null; // Skip posts with no artisan data
              }

              return (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 bg-gradient-to-r from-teal-400 to-blue-500">
                    {post.media && post.media.length > 0 && post.media[0].type === 'image' ? (
                      <img
                        src={post.media[0].url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {post.artisan?.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => handleFavorite(post.artisan?._id)}
                      disabled={!post.artisan?._id}
                      className={`absolute top-3 right-3 p-2 rounded-full transition ${
                        favorites.includes(post.artisan?._id)
                          ? 'bg-yellow-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-yellow-500 hover:text-white'
                      } ${!post.artisan?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Star className="w-5 h-5" fill={favorites.includes(post.artisan?._id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                      {post.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                        {post.specialization}
                      </span>
                    </div>

                    {post.experience && (
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Experience:</strong> {post.experience}
                      </p>
                    )}

                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {post.likesCount || 0}
                        </span>
                        {post.media && post.media.length > 0 && (
                          <span>{post.media.length} photos</span>
                        )}
                      </div>
                      <span className="text-xs">By {post.artisan?.name || 'Unknown'}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 transition flex items-center justify-center gap-2 ${
                          post.likes?.includes(userInfo?._id)
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                        }`}
                      >
                        <Heart className="w-4 h-4" fill={post.likes?.includes(userInfo?._id) ? 'currentColor' : 'none'} />
                        Like
                      </button>
                      
                      <button
                        onClick={() => navigate(`/artist-post/${post._id}`)}
                        className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            }).filter(Boolean)}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExploreArtists;
