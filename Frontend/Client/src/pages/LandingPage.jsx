import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Users, Heart, Award, TrendingUp, Globe, 
  Sparkles, BookOpen, Calendar, HandHeart, MessageCircle,
  ArrowRight, CheckCircle, Star, Building2, Palette, 
  Shield, Zap, Target, Gift, BarChart3, Mail
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const words = [
    'Artisans',
    'Our Heritage',
    'Craftsmanship',
    'Our Culture',
    'Traditional Arts',
    'Authenticity',
    'Our Legacy',
    'Sustainability',
    'Communities',
    'Excellence',
    'Master Artists',
    'Innovation',
    'Quality Crafts',
    'Timeless Art',
    'Creative Passion',
    'Traditional Skills',
    'Cultural Pride',
    'Fine Artistry',
    'Ancient Wisdom',
    'Artistic Beauty',
    'Craft Integrity'
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInDown = {
    hidden: { opacity: 0, y: -60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
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

  const floatAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const features = [
    {
      icon: ShoppingBag,
      title: 'Authentic Marketplace',
      description: 'Browse and purchase genuine handcrafted products directly from skilled artisans',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Connect with Artisans',
      description: 'Discover talented craftspeople and learn about their unique artistic journey',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized product suggestions and smart chatbot assistance',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Calendar,
      title: 'Interactive Workshops',
      description: 'Learn traditional crafts through hands-on workshops led by master artisans',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: BookOpen,
      title: 'Art Stories & Culture',
      description: 'Explore the rich history and cultural significance of Indian art forms',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: HandHeart,
      title: 'Support NGOs',
      description: 'Donate to NGOs working to preserve traditional crafts and empower artisans',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Award,
      title: 'Government Schemes',
      description: 'Access AI-curated government schemes and funding opportunities for artisans',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Track sales, engagement, and growth with comprehensive analytics',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Building2,
      title: 'Corporate Sponsorships',
      description: 'NGOs can find CSR funding opportunities with AI-guided approach strategies',
      color: 'from-cyan-500 to-cyan-600'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Artisans', icon: Users },
    { number: '50,000+', label: 'Products', icon: ShoppingBag },
    { number: '500+', label: 'Workshops', icon: Calendar },
    { number: '100+', label: 'NGO Partners', icon: HandHeart }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Pottery Artist',
      image: '👨‍🎨',
      quote: 'CraftConnect helped me reach customers across India. My income has tripled!'
    },
    {
      name: 'Priya Sharma',
      role: 'Art Enthusiast',
      image: '👩',
      quote: 'I found authentic handicrafts and learned about their cultural significance. Amazing!'
    },
    {
      name: 'Green Earth NGO',
      role: 'NGO Partner',
      image: '🌱',
      quote: 'The AI-powered reports and sponsor matching features are game-changers for us.'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Sign Up',
      description: 'Create your account as an Artisan, User, NGO, or browse as a guest',
      icon: Shield
    },
    {
      step: 2,
      title: 'Explore & Discover',
      description: 'Browse products, workshops, art stories, and connect with artisans',
      icon: Globe
    },
    {
      step: 3,
      title: 'Engage & Support',
      description: 'Purchase products, enroll in workshops, donate to NGOs, or sell your crafts',
      icon: Heart
    },
    {
      step: 4,
      title: 'Grow Together',
      description: 'Track progress, get AI insights, and be part of preserving Indian heritage',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Animated Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div animate={floatAnimation}>
                <Palette className="w-10 h-10 text-indigo-600" />
              </motion.div>
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CraftConnect
              </span>
            </motion.div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signin')}
                className="px-6 py-3 text-indigo-600 font-semibold hover:text-indigo-700 transition"
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-lg"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              variants={fadeInDown}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight min-h-[180px] sm:min-h-[200px] lg:min-h-[240px] flex flex-col items-center justify-center gap-1"
            >
              <span className="block">Empowering{' '}
                <span className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {words[currentWordIndex]}
                </span>
                ,</span>
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Preserving Traditions
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto mt-2"
            >
              India's first AI-powered platform connecting artisans, art lovers, and NGOs to celebrate and sustain traditional handicrafts
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-bold text-lg shadow-2xl flex items-center gap-3 group"
              >
                Start Your Journey
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/marketplace')}
                className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl hover:bg-indigo-50 transition font-bold text-lg shadow-lg"
              >
                Explore Marketplace
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Animated Stats */}
          <motion.div 
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.3 }
                  }}
                  className="bg-white rounded-2xl shadow-xl p-6 text-center cursor-pointer"
                >
                  <Icon className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                  <motion.p 
                    className="text-4xl font-bold text-gray-900 mb-1"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                  >
                    {stat.number}
                  </motion.p>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Everything You Need in
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                One Platform
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive features designed to support artisans, delight customers, and empower NGOs
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100 cursor-pointer"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInDown}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              How CraftConnect Works
            </h2>
            <p className="text-xl text-gray-600">Simple steps to get started</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.step} 
                  className="relative"
                  variants={scaleIn}
                >
                  <motion.div 
                    className="bg-white rounded-2xl p-8 shadow-xl text-center h-full"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-2xl font-bold text-white">{item.step}</span>
                    </div>
                    <Icon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </motion.div>
                  {item.step < 4 && (
                    <motion.div 
                      className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2"
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-8 h-8 text-indigo-300" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Loved by Our Community
            </h2>
            <p className="text-xl text-gray-600">Real stories from real people</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-xl cursor-pointer"
              >
                <motion.div 
                  className="flex items-center gap-1 mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 + i * 0.1 }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  ))}
                </motion.div>
                <p className="text-gray-700 text-lg italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-4xl sm:text-5xl font-extrabold text-white mb-6"
            variants={fadeInDown}
          >
            Ready to Be Part of the Movement?
          </motion.h2>
          <motion.p 
            className="text-xl text-white/90 mb-10"
            variants={fadeInUp}
          >
            Join thousands of artisans, art lovers, and changemakers preserving India's rich cultural heritage
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={staggerContainer}
          >
            <motion.button
              variants={scaleIn}
              whileHover={{ scale: 1.1, boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="px-10 py-5 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition font-bold text-lg shadow-2xl"
            >
              Join CraftConnect Today
            </motion.button>
            <motion.button
              variants={scaleIn}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/marketplace')}
              className="px-10 py-5 bg-transparent text-white border-2 border-white rounded-xl hover:bg-white/10 transition font-bold text-lg"
            >
              Explore Platform
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-8 h-8 text-indigo-400" />
                <span className="text-2xl font-bold">CraftConnect</span>
              </div>
              <p className="text-gray-400">
                Empowering artisans and preserving India's traditional crafts through technology
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Marketplace</li>
                <li className="hover:text-white cursor-pointer">Workshops</li>
                <li className="hover:text-white cursor-pointer">Art Stories</li>
                <li className="hover:text-white cursor-pointer">NGO Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Artisans</li>
                <li className="hover:text-white cursor-pointer">Buyers</li>
                <li className="hover:text-white cursor-pointer">NGOs</li>
                <li className="hover:text-white cursor-pointer">Blog</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Contact</li>
                <li className="hover:text-white cursor-pointer">Support</li>
                <li className="hover:text-white cursor-pointer">FAQ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 CraftConnect. All rights reserved. Made with ❤️ for Indian Artisans</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
