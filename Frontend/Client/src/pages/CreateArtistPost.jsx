import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Video } from 'lucide-react';
import { createOrUpdatePost, getMyPost } from '../services/artistPostService';
import { uploadToCloudinary } from '../services/productService';

const CreateArtistPost = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [existingPost, setExistingPost] = useState(null);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    fetchExistingPost();
  }, []);

  const fetchExistingPost = async () => {
    try {
      const data = await getMyPost(userInfo.token);
      if (data.data) {
        setExistingPost(data.data);
        setValue('title', data.data.title);
        setValue('description', data.data.description);
        setValue('specialization', data.data.specialization);
        setValue('experience', data.data.experience);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (mediaFiles.length + files.length > 10) {
      alert('You can upload maximum 10 files');
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('Only images and videos are allowed');
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }

      setMediaFiles(prev => [...prev, file]);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviews(prev => [...prev, {
          url: reader.result,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setUploading(mediaFiles.length > 0);
    setError(null);

    try {
      let media = existingPost?.media || [];

      // Upload new media if any
      if (mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
          const file = mediaFiles[i];
          console.log(`Uploading file ${i + 1}/${mediaFiles.length}:`, file.name);
          
          const mediaData = await uploadToCloudinary(
            file,
            CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_UPLOAD_PRESET
          );
          media.push(mediaData);
        }
      }

      setUploading(false);

      const postData = {
        title: data.title,
        description: data.description,
        specialization: data.specialization,
        experience: data.experience || '',
        media,
      };

      await createOrUpdatePost(postData, userInfo.token);
      alert(existingPost ? 'Post updated successfully!' : 'Post created successfully!');
      navigate('/my-artist-post');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-amber-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate('/my-artist-post')}
              className="text-white hover:text-gray-200 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">
              {existingPost ? 'Edit Artist Post' : 'Create Artist Post'}
            </h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Title too long' } })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., Master Potter from Rajasthan"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('specialization', { required: 'Specialization is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., Pottery, Weaving, Painting"
              />
              {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (Optional)
              </label>
              <input
                type="text"
                {...register('experience')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., 15 years of traditional pottery"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About You & Your Arts <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description', { required: 'Description is required', maxLength: { value: 2000, message: 'Description too long' } })}
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                placeholder="Tell your story, describe your art, your journey, and what makes your work unique..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery (Optional - Max 10 files, 50MB each)
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="media-upload"
                  disabled={mediaFiles.length >= 10}
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload images or videos</p>
                  <p className="text-xs text-gray-500 mt-1">{mediaFiles.length}/10 files uploaded</p>
                </label>
              </div>

              {/* Preview */}
              {mediaPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      {preview.type === 'image' ? (
                        <img
                          src={preview.url}
                          alt={preview.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Video className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/my-artist-post')}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 py-3 px-4 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading media...' : loading ? 'Saving...' : existingPost ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateArtistPost;
