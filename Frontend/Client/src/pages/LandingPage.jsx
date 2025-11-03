import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Users, Heart, Award, TrendingUp, Globe, 
  Sparkles, BookOpen, Calendar, HandHeart, MessageCircle,
  ArrowRight, CheckCircle, Star, Building2, Palette, 
  Shield, Zap, Target, Gift, BarChart3, Mail
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <Palette className="w-10 h-10 text-indigo-600" />
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CraftConnect
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/signin')}
                className="px-6 py-3 text-indigo-600 font-semibold hover:text-indigo-700 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6">
              Empowering Artisans,
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Preserving Traditions
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              India's first AI-powered platform connecting artisans, art lovers, and NGOs to celebrate and sustain traditional handicrafts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-bold text-lg shadow-2xl hover:shadow-3xl flex items-center gap-3 group"
              >
                Start Your Journey
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl hover:bg-indigo-50 transition font-bold text-lg shadow-lg"
              >
                Explore Marketplace
              </button>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition">
                  <Icon className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-gray-900 mb-1">{stat.number}</p>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Everything You Need in
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                One Platform
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive features designed to support artisans, delight customers, and empower NGOs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              How CraftConnect Works
            </h2>
            <p className="text-xl text-gray-600">Simple steps to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-xl text-center h-full transform hover:scale-105 transition">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-2xl font-bold text-white">{item.step}</span>
                    </div>
                    <Icon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  {item.step < 4 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-indigo-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Loved by Our Community
            </h2>
            <p className="text-xl text-gray-600">Real stories from real people</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Ready to Be Part of the Movement?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of artisans, art lovers, and changemakers preserving India's rich cultural heritage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-10 py-5 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition font-bold text-lg shadow-2xl"
            >
              Join CraftConnect Today
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-10 py-5 bg-transparent text-white border-2 border-white rounded-xl hover:bg-white/10 transition font-bold text-lg"
            >
              Explore Platform
            </button>
          </div>
        </div>
      </section>

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
