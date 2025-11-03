import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, ExternalLink, Sparkles, Building2, TrendingUp, FileText, CheckCircle, Clock, Target, X } from 'lucide-react';
import { getAllSponsors, getSponsorApproach } from '../services/sponsorService';

const NGOSponsors = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [aiGuidance, setAiGuidance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const data = await getAllSponsors();
      setSponsors(data.data || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSponsor = (sponsor) => {
    setSelectedSponsor(sponsor);
    setAiGuidance(null);
    setShowGuidanceModal(true);
  };

  const handleGetGuidance = async () => {
    if (!selectedSponsor) return;
    
    setGuidanceLoading(true);
    
    try {
      const data = await getSponsorApproach(
        {
          sponsorName: selectedSponsor.name,
          ngoFocus: 'Artisan support and traditional crafts preservation',
          projectBudget: '5-20 Lakhs'
        },
        userInfo.token
      );
      setAiGuidance(data.data);
    } catch (error) {
      console.error('Error getting guidance:', error);
      alert('Failed to generate AI guidance. Please try again.');
    } finally {
      setGuidanceLoading(false);
    }
  };

  const closeModal = () => {
    setShowGuidanceModal(false);
    setSelectedSponsor(null);
    setAiGuidance(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg sticky top-0 z-50">
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
                <Building2 className="w-8 h-8 text-white" />
                <h1 className="text-2xl font-bold text-white">Corporate Sponsors</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-10 h-10" />
            <h2 className="text-3xl md:text-4xl font-bold">Top Corporate CSR Sponsors</h2>
          </div>
          <p className="text-lg text-blue-100">
            Discover leading Indian corporates supporting NGOs and get AI-powered guidance on how to approach them for funding
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading sponsors...</p>
          </div>
        ) : (
          <>
            {/* Sponsors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Sponsor Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{sponsor.name}</h3>
                    <p className="text-sm text-blue-100">{sponsor.fundingRange}</p>
                  </div>

                  {/* Sponsor Content */}
                  <div className="p-6">
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                      {sponsor.description}
                    </p>

                    {/* Focus Areas */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Focus Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {sponsor.focus.map((area, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Application Period */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Applications: {sponsor.applicationPeriod}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleViewSponsor(sponsor)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 font-semibold"
                      >
                        <Target className="w-5 h-5" />
                        View Details
                      </button>
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 font-semibold"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Visit Website
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sponsor Details & AI Guidance Modal */}
            {showGuidanceModal && selectedSponsor && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white rounded-t-2xl z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-8 h-8" />
                        <div>
                          <h3 className="text-2xl font-bold">{selectedSponsor.name}</h3>
                          <p className="text-blue-100">{selectedSponsor.fundingRange}</p>
                        </div>
                      </div>
                      <button
                        onClick={closeModal}
                        className="text-white hover:text-gray-200"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Sponsor Details */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">About</h4>
                      <p className="text-gray-700 leading-relaxed mb-4">{selectedSponsor.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Focus Areas</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSponsor.focus.map((area, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Application Period</p>
                          <p className="text-gray-900 font-medium">{selectedSponsor.applicationPeriod}</p>
                        </div>
                      </div>

                      <a
                        href={selectedSponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Official Website
                      </a>
                    </div>

                    {/* AI Guidance Section */}
                    {!aiGuidance ? (
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200 text-center">
                        <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Get AI-Powered Approach Guide</h4>
                        <p className="text-gray-700 mb-4">
                          Generate a customized step-by-step strategy to approach {selectedSponsor.name} for funding
                        </p>
                        <button
                          onClick={handleGetGuidance}
                          disabled={guidanceLoading}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {guidanceLoading ? (
                            <span className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Generating...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5" />
                              Generate AI Guidance
                            </span>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6 border-t-2 border-gray-200 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-6 h-6 text-indigo-600" />
                          <h4 className="text-xl font-bold text-gray-900">AI-Powered Approach Strategy</h4>
                        </div>

                        {/* Overview */}
                        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                          <p className="text-gray-700 leading-relaxed">{aiGuidance.overview}</p>
                        </div>

                        {/* Steps */}
                        <div>
                          <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            Step-by-Step Approach
                          </h5>
                          <div className="space-y-4">
                            {aiGuidance.steps.map((step) => (
                              <div key={step.step} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                    {step.step}
                                  </div>
                                  <div className="flex-1">
                                    <h6 className="font-bold text-gray-900 mb-2">{step.title}</h6>
                                    <p className="text-gray-700 text-sm mb-3">{step.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                      <Clock className="w-4 h-4" />
                                      <span>{step.timeline}</span>
                                    </div>
                                    <ul className="space-y-1">
                                      {step.keyActions.map((action, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                          <span>{action}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tips */}
                        <div>
                          <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            Pro Tips
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {aiGuidance.tips.map((tip, idx) => (
                              <div key={idx} className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <p className="text-sm text-gray-700">{tip}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Required Documents */}
                        <div>
                          <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            Required Documents
                          </h5>
                          <ul className="space-y-2">
                            {aiGuidance.documents.map((doc, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-gray-700">
                                <CheckCircle className="w-5 h-5 text-indigo-600" />
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Timeline & Success Factors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <h6 className="font-bold text-gray-900 mb-2">Expected Timeline</h6>
                            <p className="text-sm text-gray-700">{aiGuidance.timeline}</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <h6 className="font-bold text-gray-900 mb-2">Success Factors</h6>
                            <ul className="space-y-1">
                              {aiGuidance.successFactors.map((factor, idx) => (
                                <li key={idx} className="text-sm text-gray-700">• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default NGOSponsors;
