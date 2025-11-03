import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Heart, Target, TrendingUp, Users, Mail, Phone, Globe, Calendar, X } from 'lucide-react';
import { getNGODetails, createDonation } from '../services/donationService';

const NGODetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    fetchNGODetails();
  }, [id]);

  const fetchNGODetails = async () => {
    try {
      setLoading(true);
      const data = await getNGODetails(id);
      console.log('NGO Details:', data); // Debug log
      setNgo(data.data);
    } catch (error) {
      console.error('Error fetching NGO details:', error);
      alert('Failed to load NGO details: ' + error.message);
      navigate('/ngos'); // Redirect back to NGOs list
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!userInfo) {
      alert('Please login to donate');
      navigate('/signin');
      return;
    }

    if (!donationAmount || donationAmount < 1) {
      alert('Please enter a valid donation amount (minimum ₹1)');
      return;
    }

    try {
      setDonating(true);
      await createDonation(
        {
          ngoId: id,
          amount: Number(donationAmount),
          message: donationMessage,
        },
        userInfo.token
      );
      alert('Thank you for your donation! 🙏');
      setShowDonateModal(false);
      setDonationAmount('');
      setDonationMessage('');
      fetchNGODetails();
    } catch (error) {
      alert(error.message);
    } finally {
      setDonating(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">NGO not found</p>
          <button
            onClick={() => navigate('/ngos')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to NGOs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-green-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 transition">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="ml-4 text-xl font-bold text-white">NGO Details</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* NGO Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{ngo.profile?.organizationName || ngo.name}</h1>
                <p className="text-green-100">Registered NGO</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Target className="w-6 h-6 mb-2" />
                <p className="text-sm text-green-100">Total Funds Raised</p>
                <p className="text-2xl font-bold">₹{ngo.profile?.totalFundsRaised?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <TrendingUp className="w-6 h-6 mb-2" />
                <p className="text-sm text-green-100">Total Donors</p>
                <p className="text-2xl font-bold">{ngo.profile?.donorsCount || 0}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Calendar className="w-6 h-6 mb-2" />
                <p className="text-sm text-green-100">Established</p>
                <p className="text-2xl font-bold">{ngo.profile?.yearEstablished || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* NGO Details */}
          <div className="p-8">
            {/* Mission */}
            {ngo.profile?.mission && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{ngo.profile.mission}</p>
              </div>
            )}

            {/* Description */}
            {ngo.profile?.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
                <p className="text-gray-700 leading-relaxed">{ngo.profile.description}</p>
              </div>
            )}

            {/* Focus Areas */}
            {ngo.profile?.focusAreas && ngo.profile.focusAreas.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Focus Areas</h2>
                <div className="flex flex-wrap gap-3">
                  {ngo.profile.focusAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{ngo.email}</p>
                  </div>
                </div>
                {ngo.profile?.phoneNumber && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{ngo.profile.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {ngo.profile?.website && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <a
                        href={ngo.profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-green-600 hover:text-green-700"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
                {ngo.profile?.registrationNumber && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Target className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Registration Number</p>
                      <p className="font-semibold text-gray-900">{ngo.profile.registrationNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Donations */}
            {ngo.recentDonations && ngo.recentDonations.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Supporters</h2>
                <div className="space-y-3">
                  {ngo.recentDonations.map((donation) => (
                    <div key={donation._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                          <Heart className="w-5 h-5 text-green-600" fill="currentColor" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{donation.donor?.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-green-600">₹{donation.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Donate Button */}
            <div className="sticky bottom-4 mt-8">
              <button
                onClick={() => setShowDonateModal(true)}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition font-bold text-lg shadow-2xl flex items-center justify-center gap-2"
              >
                <Heart className="w-6 h-6" fill="currentColor" />
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Donation Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
                Make a Donation
              </h3>
              <button
                onClick={() => setShowDonateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Support <span className="font-bold">{ngo.profile?.organizationName || ngo.name}</span> in their mission
              </p>

              {/* Quick Amounts */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount.toString())}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition ${
                      donationAmount === amount.toString()
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Amount (₹)
                </label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
                />
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={donationMessage}
                  onChange={(e) => setDonationMessage(e.target.value)}
                  placeholder="Leave a message of support..."
                  rows="3"
                  maxLength="500"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Summary */}
            {donationAmount && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700 mb-1">You are donating</p>
                <p className="text-3xl font-bold text-green-600">₹{Number(donationAmount).toLocaleString()}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDonateModal(false)}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDonate}
                disabled={!donationAmount || donating}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {donating ? 'Processing...' : 'Donate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGODetails;
