import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Calendar, Clock, MapPin, Users, DollarSign, User, Phone, Mail } from 'lucide-react';
import { getWorkshop, enrollWorkshop, cancelEnrollment } from '../services/workshopService';

const WorkshopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchWorkshop();
  }, [id]);

  const fetchWorkshop = async () => {
    try {
      setLoading(true);
      const data = await getWorkshop(id);
      setWorkshop(data.data);
    } catch (error) {
      console.error('Error fetching workshop:', error);
      alert('Failed to load workshop');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!userInfo) {
      alert('Please login to enroll');
      navigate('/signin');
      return;
    }

    try {
      setActionLoading(true);
      await enrollWorkshop(id, userInfo.token);
      alert('Successfully enrolled!');
      fetchWorkshop();
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEnrollment = async () => {
    if (!confirm('Are you sure you want to cancel your enrollment?')) return;

    try {
      setActionLoading(true);
      await cancelEnrollment(id, userInfo.token);
      alert('Enrollment cancelled successfully');
      fetchWorkshop();
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Workshop not found</p>
      </div>
    );
  }

  const isEnrolled = workshop.enrolledUsers?.some(e => e.user._id === userInfo?._id || e.user === userInfo?._id);
  const isFull = workshop.availableSlots === 0;
  const isArtisan = workshop.artisan?._id === userInfo?._id || workshop.artisan === userInfo?._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 transition">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="ml-4 text-xl font-bold text-white">Workshop Details</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Workshop Images */}
          {workshop.images && workshop.images.length > 0 && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={workshop.images[0].url}
                alt={workshop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-semibold text-purple-600">{workshop.artForm}</span>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Workshop Title & Description */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{workshop.name}</h1>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">{workshop.description}</p>

            {/* Workshop Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">{new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold text-gray-900">{workshop.startTime} - {workshop.endTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Available Slots</p>
                    <p className="font-semibold text-gray-900">{workshop.availableSlots} / {workshop.totalSlots}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">
                      {workshop.location?.address && <span>{workshop.location.address}<br /></span>}
                      {workshop.location?.city}, {workshop.location?.state} - {workshop.location?.pincode}
                    </p>
                  </div>
                </div>

                {workshop.price > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-semibold text-gray-900 text-2xl text-purple-600">₹{workshop.price}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Artisan Information */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Workshop Conducted By</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Artisan Name</p>
                    <p className="font-semibold text-gray-900">{workshop.artisan?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{workshop.artisan?.email}</p>
                  </div>
                </div>
                {workshop.artisan?.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{workshop.artisan.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enrolled Participants - Only show to artisan */}
            {isArtisan && workshop.enrolledUsers && workshop.enrolledUsers.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Enrolled Participants ({workshop.enrolledUsers.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {workshop.enrolledUsers.map((enrollment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="w-12 h-12 bg-purple-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{enrollment.user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{enrollment.user?.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show enrollment count to others */}
            {!isArtisan && workshop.enrolledUsers && workshop.enrolledUsers.length > 0 && (
              <div className="mb-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-center text-purple-900 font-medium">
                  <Users className="w-5 h-5 inline mr-2" />
                  {workshop.enrolledUsers.length} {workshop.enrolledUsers.length === 1 ? 'person has' : 'people have'} enrolled
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {isEnrolled ? (
                <button
                  onClick={handleCancelEnrollment}
                  disabled={actionLoading}
                  className="flex-1 py-4 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Processing...' : 'Cancel Enrollment'}
                </button>
              ) : isFull ? (
                <div className="flex-1 py-4 px-6 bg-gray-300 text-gray-600 rounded-lg text-center font-semibold cursor-not-allowed">
                  Workshop Fully Booked
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={actionLoading}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {actionLoading ? 'Processing...' : 'Enroll Now'}
                </button>
              )}
              <button
                onClick={() => navigate('/workshops')}
                className="py-4 px-6 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Browse More
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkshopDetails;
