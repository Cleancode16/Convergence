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
import ArtsAndStories from './pages/ArtsAndStories';
import ArtStoryReader from './pages/ArtStoryReader';
import Schemes from './pages/Schemes';
import Analytics from './pages/Analytics';
import NGOSponsors from './pages/NGOSponsors';
import Workshops from './pages/Workshops';
import WorkshopDetails from './pages/WorkshopDetails';
import CreateWorkshop from './pages/CreateWorkshop';
import NGOsList from './pages/NGOsList';
import NGODetails from './pages/NGODetails';
import NGODonations from './pages/NGODonations';
import MyDonations from './pages/MyDonations';
import UserProfile from './pages/UserProfile';
import NGOReports from './pages/NGOReports';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
          
          <Route
            path="/arts-and-stories"
            element={
              <ProtectedRoute allowedRoles={['user', 'artisan', 'ngo']}>
                <ArtsAndStories />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/art-story/:id"
            element={
              <ProtectedRoute allowedRoles={['user', 'artisan', 'ngo']}>
                <ArtStoryReader />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/schemes"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <Schemes />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          
          <Route path="/ngo-sponsors" element={<NGOSponsors />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/workshop/:id" element={<WorkshopDetails />} />
          <Route path="/create-workshop" element={<CreateWorkshop />} />
          <Route path="/ngos" element={<NGOsList />} />
          <Route path="/ngo/:id" element={<NGODetails />} />
          <Route path="/ngo-donations" element={
            <ProtectedRoute allowedRoles={['ngo']}>
              <NGODonations />
            </ProtectedRoute>
          } />
          <Route path="/my-donations" element={
            <ProtectedRoute allowedRoles={['user', 'artisan', 'ngo']}>
              <MyDonations />
            </ProtectedRoute>
          } />
          <Route path="/user-profile" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/ngo-reports" element={
            <ProtectedRoute allowedRoles={['ngo']}>
              <NGOReports />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
