import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ArtisanDashboard from './pages/ArtisanDashboard';
import NgoDashboard from './pages/NgoDashboard';
import ArtisanProfileSetup from './pages/ArtisanProfileSetup';
import NgoProfileSetup from './pages/NgoProfileSetup';
import ProtectedRoute from './components/ProtectedRoute';
import BrowseArtisans from './pages/BrowseArtisans';
import ArtisanConnections from './pages/ArtisanConnections';
import CreateProduct from './pages/CreateProduct';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import MyProducts from './pages/MyProducts';
import MyOrders from './pages/MyOrders';
import ArtisanOrders from './pages/ArtisanOrders';
import EditProduct from './pages/EditProduct';
import MyArtistPost from './pages/MyArtistPost';
import CreateArtistPost from './pages/CreateArtistPost';
import ExploreArtists from './pages/ExploreArtists';
import ArtistPostDetails from './pages/ArtistPostDetails';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/artisan-dashboard"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <ArtisanDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/artisan-profile-setup"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <ArtisanProfileSetup />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ngo-dashboard"
            element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <NgoDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ngo-profile-setup"
            element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <NgoProfileSetup />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/browse-artisans"
            element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <BrowseArtisans />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/artisan-connections"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <ArtisanConnections />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/create-product"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute allowedRoles={['user', 'artisan', 'ngo']}>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute allowedRoles={['user', 'artisan', 'ngo']}>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/my-products"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <MyProducts />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute allowedRoles={['user', 'artisan', 'ngo']}>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/artisan-orders"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <ArtisanOrders />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/my-artist-post"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <MyArtistPost />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/create-artist-post"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <CreateArtistPost />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/explore-artists"
            element={
              <ProtectedRoute allowedRoles={['user', 'ngo']}>
                <ExploreArtists />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/artist-post/:id"
            element={
              <ProtectedRoute allowedRoles={['user', 'artisan', 'ngo']}>
                <ArtistPostDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
