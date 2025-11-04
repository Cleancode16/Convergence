import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signinAction, clearError } from '../redux/actions/authActions';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Palette, Eye, EyeOff, 
  ArrowRight, AlertCircle, Shield, Zap 
} from 'lucide-react';

const Signin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigateToDashboard(userInfo.role);
    }
    return () => dispatch(clearError());
  }, [userInfo, navigate, dispatch]);

  const navigateToDashboard = (role) => {
    const dashboardRoutes = {
      user: '/user-dashboard',
      admin: '/admin-dashboard',
      artisan: '/artisan-dashboard',
      ngo: '/ngo-dashboard',
    };
    navigate(dashboardRoutes[role] || '/');
  };

  const onSubmit = async (data) => {
    try {
      const userData = await dispatch(signinAction(data.email, data.password, data.role));
      navigateToDashboard(userData.role);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-2xl w-full"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header - No Logo */}
        <motion.div 
          className="text-center mb-8"
          variants={fadeInUp}
        >
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-3 text-gray-600 text-xl">Sign in to continue your journey</p>
        </motion.div>

        {/* Form Card - Larger */}
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl p-10 space-y-6"
          variants={fadeInUp}
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <motion.div variants={fadeInUp}>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition outline-none"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={fadeInUp}>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-14 pr-14 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Role Selection */}
            <motion.div variants={fadeInUp}>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Sign in as
              </label>
              <select
                {...register('role', { required: 'Please select your role' })}
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white outline-none appearance-none cursor-pointer"
              >
                <option value="">Select your role</option>
                <option value="user">User</option>
                <option value="artisan">Artisan</option>
                <option value="ngo">NGO</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.role.message}
                </p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
                </>
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <motion.div 
            className="text-center pt-6 border-t border-gray-200"
            variants={fadeInUp}
          >
            <p className="text-gray-600 text-lg">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-bold text-purple-600 hover:text-purple-700 transition"
              >
                Create Account
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Security Badge */}
        <motion.div 
          className="mt-8 text-center space-y-3"
          variants={fadeInUp}
        >
          <div className="flex items-center justify-center gap-8 text-base text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-500" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-500" />
              <span>Fast Access</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signin;
