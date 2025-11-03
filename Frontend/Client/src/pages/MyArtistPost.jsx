import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Edit2, Trash2, Upload, X, Video, Plus, FileText } from 'lucide-react';
import { getMyPost, deletePost } from '../services/artistPostService';
import { uploadToCloudinary } from '../services/productService';

const MyArtistPost = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await getMyPost(userInfo.token);
      setPost(data.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your artist post?')) return;

    try {
      await deletePost(post._id, userInfo.token);
      alert('Post deleted successfully');
      setPost(null);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-amber-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/artisan-dashboard')}
                className="text-white hover:text-gray-200 transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">My Artist Post</h1>
            </div>
            {!post && (
              <button
                onClick={() => navigate('/create-artist-post')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition"
              >
                <Plus className="w-5 h-5" />
                Create Post
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!post ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Artist Post Yet</h2>
            <p className="text-gray-600 mb-6">Create your artist post to showcase your work and tell your story!</p>
            <button
              onClick={() => navigate('/create-artist-post')}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              Create My Post
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Post Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{post.title}</h2>
                  <p className="text-amber-100">{post.specialization}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/create-artist-post')}
                    className="p-3 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Experience */}
              {post.experience && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Experience</h3>
                  <p className="text-gray-700">{post.experience}</p>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">About Me & My Arts</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{post.description}</p>
              </div>

              {/* Media Gallery */}
              {post.media && post.media.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {post.media.map((media, index) => (
                      <div key={index} className="relative group">
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={media.url}
                            controls
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{post.likesCount || 0} likes</span>
                  <span>Posted on {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyArtistPost;
