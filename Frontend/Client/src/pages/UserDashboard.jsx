import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';
import { ShoppingBag, Heart, Package, CreditCard, User, LogOut, Users, BookOpen, Calendar } from 'lucide-react';
import { getFavoriteProducts } from '../services/productService';
import { useEffect, useState } from 'react';

const UserDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (userInfo) {
      fetchWishlist();
    }
  }, [userInfo]);

  const fetchWishlist = async () => {
    try {
      const data = await getFavoriteProducts(userInfo.token);
      setWishlist(data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

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

          <div
            onClick={() => navigate('/workshops')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Workshops</h3>
            <p className="text-gray-600 text-sm">Join hands-on art workshops</p>
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

        {/* Wishlist Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
              My Wishlist
            </h2>
            <button
              onClick={() => navigate('/marketplace')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Browse Products
            </button>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Your wishlist is empty</p>
              <button
                onClick={() => navigate('/marketplace')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Explore Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {wishlist.map((product) => (
                <div
                  key={product._id}
                  className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
                >
                  {/* Product Image */}
                  <div 
                    className="relative h-48 overflow-hidden bg-gray-100"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    
                    {/* Wishlist Heart Badge */}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow">
                      <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                    <h3 
                      className="font-semibold text-gray-900 mb-1 line-clamp-1 cursor-pointer hover:text-indigo-600"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600">
                        ₹{product.price}
                      </span>
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="w-full mt-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
