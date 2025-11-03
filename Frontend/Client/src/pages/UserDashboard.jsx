import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';
import { ShoppingBag, Heart, Package, CreditCard, User, LogOut, Users, BookOpen } from 'lucide-react';

const UserDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome, {userInfo?.name}!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-medium text-gray-900">{userInfo?.email}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-lg font-medium text-gray-900 capitalize">{userInfo?.role}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/explore-artists')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore Artists</h3>
            <p className="text-gray-600 text-sm">Discover talented artisans</p>
          </div>

          <div 
            onClick={() => navigate('/marketplace')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg mb-4">
              <ShoppingBag className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Products</h3>
            <p className="text-gray-600 text-sm">Explore artisan crafts</p>
          </div>

          <div 
            onClick={() => navigate('/arts-and-stories')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Arts & Stories</h3>
            <p className="text-gray-600 text-sm">Discover art history</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Wishlist</h3>
            <p className="text-gray-600 text-sm">Your favorite items</p>
          </div>

          <div 
            onClick={() => navigate('/my-orders')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Orders</h3>
            <p className="text-gray-600 text-sm">Track your purchases</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
