import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Heart, Star, Mail } from 'lucide-react';
import { getPost, toggleLike, toggleFavorite } from '../services/artistPostService';

const ArtistPostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await getPost(id);
      setPost(data.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to load artist post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!userInfo) {
      alert('Please login to like posts');
      return;
    }

    try {
      const data = await toggleLike(id, userInfo.token);
      setPost(prev => ({
        ...prev,
        likesCount: data.likesCount,
        likes: data.liked ? [...(prev.likes || []), userInfo._id] : (prev.likes || []).filter(uid => uid !== userInfo._id)
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFavorite = async () => {
    if (!userInfo) {
      alert('Please login to favorite artists');
      return;
    }

    try {
      const data = await toggleFavorite(post.artisan._id, userInfo.token);
      setIsFavorite(data.isFavorite);
      alert(data.message);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-200 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Artist Profile</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media Gallery */}
          <div>
            {post.media && post.media.length > 0 ? (
              <>
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                  {post.media[selectedMedia].type === 'image' ? (
                    <img
                      src={post.media[selectedMedia].url}
                      alt={post.title}
                      className="w-full h-96 object-cover"
                    />
                  ) : (
                    <video
                      src={post.media[selectedMedia].url}
                      controls
                      className="w-full h-96 object-cover"
                    />
                  )}
                </div>

                {/* Thumbnails */}
                {post.media.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {post.media.map((media, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedMedia(index)}
                        className={`rounded-lg overflow-hidden border-2 ${
                          selectedMedia === index ? 'border-teal-600' : 'border-gray-200'
                        }`}
                      >
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-16 object-cover"
                          />
                        ) : (
                          <div className="w-full h-16 bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">Video</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg shadow-md h-96 flex items-center justify-center">
                <span className="text-white text-6xl font-bold">
                  {post.artisan?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Artist Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                  {post.specialization}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likesCount || 0} likes</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Artist:</strong> {post.artisan?.name}
                </p>
                {post.experience && (
                  <p className="text-gray-600 text-sm">
                    <strong>Experience:</strong> {post.experience}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">About</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{post.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleLike}
                  className={`flex-1 px-6 py-3 rounded-lg border-2 transition flex items-center justify-center gap-2 ${
                    post.likes?.includes(userInfo?._id)
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={post.likes?.includes(userInfo?._id) ? 'currentColor' : 'none'} />
                  Like
                </button>

                <button
                  onClick={handleFavorite}
                  className={`flex-1 px-6 py-3 rounded-lg border-2 transition flex items-center justify-center gap-2 ${
                    isFavorite
                      ? 'border-yellow-500 bg-yellow-500 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-yellow-500 hover:text-yellow-500'
                  }`}
                >
                  <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                  Favorite
                </button>
              </div>

              <button
                onClick={() => window.location.href = `mailto:${post.artisan?.email}`}
                className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Contact Artist
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistPostDetails;
