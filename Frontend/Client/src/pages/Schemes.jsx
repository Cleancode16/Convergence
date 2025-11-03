import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Award, FileText, ExternalLink, Calendar, Phone, Mail, TrendingUp, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { getSchemeRecommendations, getSchemeDetails } from '../services/schemeService';

const Schemes = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemeDetails, setSchemeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await getSchemeRecommendations(userInfo.token);
      setRecommendations(data.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSchemeClick = async (scheme) => {
    setSelectedScheme(scheme);
    setLoadingDetails(true);
    try {
      const data = await getSchemeDetails(scheme.schemeName, userInfo.token);
      setSchemeDetails(data.data);
    } catch (error) {
      console.error('Error fetching details:', error);
      alert(error.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Financial Aid': 'bg-green-100 text-green-800 border-green-300',
      'Skill Development': 'bg-blue-100 text-blue-800 border-blue-300',
      'Marketing Support': 'bg-purple-100 text-purple-800 border-purple-300',
      'Health & Welfare': 'bg-pink-100 text-pink-800 border-pink-300',
      'Education': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Finding schemes for you...</p>
          <p className="text-sm text-gray-500 mt-2">Analyzing your profile with AI ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/artisan-dashboard')}
                className="text-white hover:text-gray-200 transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-white" />
                <h1 className="text-2xl font-bold text-white">Government Schemes</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Banner */}
        {recommendations && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" />
              <h2 className="text-2xl font-bold">AI-Powered Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">{recommendations.totalSchemes}</p>
                <p className="text-sm text-amber-100">Available Schemes</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">{recommendations.highPriorityCount}</p>
                <p className="text-sm text-amber-100">High Priority</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">
                  {recommendations.recommendations?.filter(s => s.matchPercentage >= 90).length}
                </p>
                <p className="text-sm text-amber-100">Perfect Match</p>
              </div>
            </div>
          </div>
        )}

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {recommendations?.recommendations?.map((scheme, index) => (
            <div
              key={index}
              onClick={() => handleSchemeClick(scheme)}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition">
                      {scheme.schemeName}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-3 py-1 rounded-full border ${getCategoryColor(scheme.category)}`}>
                        {scheme.category}
                      </span>
                      {scheme.matchPercentage >= 90 && (
                        <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-300 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Perfect Match
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getMatchColor(scheme.matchPercentage)}`}>
                      {scheme.matchPercentage}%
                    </div>
                    <div className="text-xs text-gray-500">Match</div>
                  </div>
                </div>

                {/* Benefits */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{scheme.benefits}</p>

                {/* Key Points */}
                <div className="space-y-2 mb-4">
                  {scheme.keyPoints?.slice(0, 3).map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{point}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{scheme.deadline}</span>
                  </div>
                  <button className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {loadingDetails ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading detailed information...</p>
              </div>
            ) : schemeDetails ? (
              <div>
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-t-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{schemeDetails.schemeName}</h2>
                      <p className="text-amber-100 text-sm">{schemeDetails.implementingAgency}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedScheme(null);
                        setSchemeDetails(null);
                      }}
                      className="text-white hover:text-gray-200 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      About the Scheme
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {schemeDetails.fullDescription}
                    </p>
                  </div>

                  {/* Eligibility */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Eligibility Criteria</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(schemeDetails.eligibilityDetails || {}).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-gray-900 capitalize">{key}: </span>
                            <span className="text-gray-700">
                              {Array.isArray(value) ? value.join(', ') : value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(schemeDetails.benefitsDetailed || {}).map(([category, benefits]) => (
                        <div key={category} className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-semibold text-green-900 mb-2 capitalize">{category}</h4>
                          <ul className="space-y-1">
                            {benefits.map((benefit, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-green-600">•</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents Required */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Documents Required</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {schemeDetails.documentsRequired?.map((doc, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                          <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">{doc.document}</p>
                            <p className="text-sm text-gray-600">{doc.purpose}</p>
                            {doc.mandatory && (
                              <span className="text-xs text-red-600">* Mandatory</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Application Process */}
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">How to Apply</h3>
                    <div className="space-y-4">
                      {schemeDetails.applicationProcess?.onlineSteps && (
                        <div>
                          <h4 className="font-semibold text-amber-900 mb-2">Online Application:</h4>
                          <ol className="space-y-2">
                            {schemeDetails.applicationProcess.onlineSteps.map((step, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm">
                                  {idx + 1}
                                </span>
                                <span className="text-gray-700">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      {schemeDetails.contactDetails?.helpline && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-purple-600" />
                          <span className="text-gray-700">{schemeDetails.contactDetails.helpline}</span>
                        </div>
                      )}
                      {schemeDetails.contactDetails?.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-purple-600" />
                          <span className="text-gray-700">{schemeDetails.contactDetails.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Apply Button */}
                  {selectedScheme.applicationLink && (
                    <a
                      href={selectedScheme.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-center rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-semibold text-lg"
                    >
                      Apply Now →
                    </a>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Schemes;
