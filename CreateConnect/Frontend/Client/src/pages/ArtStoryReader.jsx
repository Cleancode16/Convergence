import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Heart, Sparkles, BookOpen, ChevronRight, ChevronLeft, Home, ExternalLink } from 'lucide-react';
import { getStory, toggleLike } from '../services/artStoryService';

const ArtStoryReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('introduction');
  const [currentChapter, setCurrentChapter] = useState(0);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const data = await getStory(id);
      setStory(data.data);
    } catch (error) {
      console.error('Error fetching story:', error);
      alert('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!userInfo) {
      alert('Please login to like stories');
      return;
    }

    try {
      const data = await toggleLike(id, userInfo.token);
      setStory(prev => ({
        ...prev,
        likesCount: data.likesCount,
        likes: data.liked ? [...(prev.likes || []), userInfo._id] : (prev.likes || []).filter(uid => uid !== userInfo._id)
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const sections = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'chapters', label: 'Story Chapters' },
    { id: 'history', label: 'History' },
    { id: 'importance', label: 'Importance' },
    { id: 'cultural', label: 'Cultural Significance' },
    { id: 'modern', label: 'Modern Relevance' },
    { id: 'facts', label: 'Fun Facts' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Story not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/arts-and-stories')}
                className="text-white hover:text-gray-200 transition"
                title="Back to Stories"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigate('/user-dashboard')}
                className="text-white hover:text-gray-200 transition"
                title="Home"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>
            <h1 className="text-xl font-bold text-white line-clamp-1">{story.title}</h1>
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition ${
                story.likes?.includes(userInfo?._id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart className="w-5 h-5" fill={story.likes?.includes(userInfo?._id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Contents
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setCurrentSection(section.id);
                      if (section.id === 'chapters') setCurrentChapter(0);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      currentSection === section.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Introduction with Embedded Storybook */}
              {currentSection === 'introduction' && (
                <div>
                  <div className="mb-6">
                    {story.storybookLink ? (
                      <div className="relative w-full">
                        {/* Try to embed first */}
                        {!iframeError ? (
                          <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ paddingBottom: '100%', minHeight: '600px' }}>
                            <iframe
                              src={story.storybookLink}
                              className="absolute top-0 left-0 w-full h-full rounded-lg border-2 border-indigo-200"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation allow-popups-to-escape-sandbox"
                              title={story.title}
                              onError={() => setIframeError(true)}
                            ></iframe>
                            
                            {/* Fallback button if iframe doesn't load */}
                            <div className="absolute bottom-4 right-4 z-10">
                              <a
                                href={story.storybookLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg shadow-lg hover:bg-gray-50 transition text-sm font-medium"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Open in New Tab
                              </a>
                            </div>
                          </div>
                        ) : (
                          /* Fallback UI when iframe fails */
                          <div className="w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-lg p-8 text-center">
                            <BookOpen className="w-20 h-20 text-indigo-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Gemini Storybook</h3>
                            <p className="text-gray-700 mb-6">
                              This content cannot be embedded directly. Click below to view it.
                            </p>
                            <a
                              href={story.storybookLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-lg"
                            >
                              <Sparkles className="w-5 h-5" />
                              Open Gemini Storybook
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                    )}
                    <h2 className="text-4xl font-bold text-gray-900 my-6">{story.title}</h2>
                    <p className="text-xl text-indigo-600 font-semibold mb-6">{story.artForm}</p>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.introduction}</p>
                  </div>
                </div>
              )}

              {/* Chapters */}
              {currentSection === 'chapters' && story.chapters && story.chapters.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Chapter {story.chapters[currentChapter].chapterNumber}: {story.chapters[currentChapter].title}
                    </h2>
                  </div>
                  
                  {story.chapters[currentChapter].image && (
                    <img
                      src={story.chapters[currentChapter].image}
                      alt={story.chapters[currentChapter].title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  
                  <div className="prose prose-lg max-w-none mb-8">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {story.chapters[currentChapter].content}
                    </p>
                  </div>

                  {/* Chapter Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                      disabled={currentChapter === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Chapter {currentChapter + 1} of {story.chapters.length}
                    </span>
                    <button
                      onClick={() => setCurrentChapter(Math.min(story.chapters.length - 1, currentChapter + 1))}
                      disabled={currentChapter === story.chapters.length - 1}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* History */}
              {currentSection === 'history' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Historical Background</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.history}</p>
                  </div>
                </div>
              )}

              {/* Importance */}
              {currentSection === 'importance' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Why This Art Matters</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.importance}</p>
                  </div>
                </div>
              )}

              {/* Cultural Significance */}
              {currentSection === 'cultural' && story.culturalSignificance && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Cultural Significance</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.culturalSignificance}</p>
                  </div>
                </div>
              )}

              {/* Modern Relevance */}
              {currentSection === 'modern' && story.modernRelevance && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Modern Relevance</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.modernRelevance}</p>
                  </div>
                </div>
              )}

              {/* Fun Facts */}
              {currentSection === 'facts' && story.funFacts && story.funFacts.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Fun Facts</h2>
                  <div className="space-y-4">
                    {story.funFacts.map((fact, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-indigo-50 rounded-lg">
                        <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 leading-relaxed">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtStoryReader;
