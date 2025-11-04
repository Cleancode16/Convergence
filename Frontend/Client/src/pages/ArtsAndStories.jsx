import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { getAllStories } from '../services/artStoryService';

// Import storybook images
import TheGoldenPrayer from '../assets/GoldenPlayer.png'; 
import TheClayFarmerStory from '../assets/TheClayFarmerStory.png'; 
import TheColorofSecrets from '../assets/TheColorofSecrets.png'; 
import TheMetalsforeverSong from '../assets/TheMetalsforeverSong.png'; 
import ThestorytellerStrings from '../assets/ThestorytellerStrings.png'; 
import Thecircleofcalm from '../assets/Thecircleofcalm.png';
import Thewoodensouls from '../assets/Thewoodensouls.png';
import LeelaandtheLoomSong from '../assets/LeelaandtheLoomSong.png';

const ArtsAndStories = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await getAllStories();
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

  // Map art forms to their respective storybook images
  const getStorybookImage = (artForm) => {
    const imageMap = {
      'Tanjore Paintings': TheGoldenPrayer,
      'Pottery': TheClayFarmerStory,
      'Weaving': LeelaandtheLoomSong,
      'Dokra Jewellery': TheMetalsforeverSong,
      'Meenakari': TheColorofSecrets,
      'Kondapalli Bommalu': Thewoodensouls,
      'Ikkat': LeelaandtheLoomSong,
      'Mandala Art': Thecircleofcalm,
      'Madhubani Painting': TheGoldenPrayer,
      'Warli Art': TheClayFarmerStory,
      'Pattachitra': TheGoldenPrayer,
      'Kalamkari': ThestorytellerStrings,
      'Bidriware': TheMetalsforeverSong,
      'Blue Pottery': TheClayFarmerStory,
      'Puppetry': ThestorytellerStrings,
    };
    
    return imageMap[artForm] || TheGoldenPrayer;
  };

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Explore Indian Art Forms
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the rich cultural heritage through interactive AI-powered storybooks
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <p className="text-sm text-indigo-600 font-medium">Powered by Gemini AI</p>
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-white/30">
            <BookOpen className="w-24 h-24 text-indigo-300 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No Stories Yet</h3>
            <p className="text-gray-600 mb-6">
              The admin hasn't added any art stories yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {stories.map((story) => (
              <div key={story._id} className="group">
                {/* Art Form Label - Outside Card */}
                <div className="mb-4 text-center">
                  <span className="inline-block px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm rounded-full shadow-lg">
                    {story.artForm}
                  </span>
                </div>

                {/* Storybook Card - No padding, full width image */}
                <div
                  onClick={() => handleOpenStory(story.storybookLink)}
                  className="relative bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.5)] border-2 border-gray-100 hover:border-indigo-300"
                  style={{ aspectRatio: '3/4' }}
                >
                  {/* Storybook Image - Full width, no padding */}
                  <div className="absolute inset-0">
                    <img
                      src={getStorybookImage(story.artForm)}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Story Title - Appears on Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-200 line-clamp-2 mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                      {story.description || 'Click to explore this fascinating art form...'}
                    </p>
                    <div className="flex items-center gap-2 text-white/90">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-xs font-medium">Open Storybook</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </div>
                  </div>

                  {/* Sparkle Effect on Hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                    <div className="bg-white/30 backdrop-blur-sm rounded-full p-3 animate-pulse shadow-lg">
                      <Sparkles className="w-6 h-6 text-yellow-300" />
                    </div>
                  </div>

                  {/* Click Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
                    <div className="bg-white/95 backdrop-blur-md rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 shadow-2xl">
                      <ExternalLink className="w-8 h-8 text-indigo-600" />
                    </div>
                  </div>
                </div>

                {/* Story Title Below - Always Visible */}
                <div className="mt-4 text-center px-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {story.title}
                  </h3>
                  {story.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {story.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {stories.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-white/30">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700 font-medium">
                {stories.length} {stories.length === 1 ? 'Story' : 'Stories'} Available
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default ArtsAndStories;
