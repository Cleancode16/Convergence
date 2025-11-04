import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Search, Wallet, Users, Download, Calendar, TrendingUp, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import { getNGODonations } from '../services/donationService';

const NGODonations = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalAmount: 0,
    uniqueDonors: 0,
    averageDonation: 0,
  });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
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

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    filterDonations();
  }, [searchTerm, donations]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await getNGODonations(userInfo.token);
      setDonations(data.data || []);
      setFilteredDonations(data.data || []);
      setStats(data.stats || {
        totalAmount: 0,
        uniqueDonors: 0,
        averageDonation: 0,
      });
    } catch (error) {
      console.error('Error fetching donations:', error);
      alert('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const filterDonations = () => {
    if (!searchTerm.trim()) {
      setFilteredDonations(donations);
      return;
    }

    const search = searchTerm.toLowerCase();
    const filtered = donations.filter(donation => 
      donation.donor?.name?.toLowerCase().includes(search) ||
      donation.donor?.email?.toLowerCase().includes(search) ||
      donation.message?.toLowerCase().includes(search) ||
      donation.amount.toString().includes(search)
    );
    setFilteredDonations(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Donor Name', 'Email', 'Amount', 'Message', 'Status'];
    const rows = filteredDonations.map(d => [
      new Date(d.createdAt).toLocaleDateString(),
      d.donor?.name || 'Anonymous',
      d.donor?.email || 'N/A',
      `₹${d.amount}`,
      d.message || '-',
      d.status
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <div className="w-16 h-16 border-4 border-[#783be8] border-t-transparent rounded-full"></div>
          </motion.div>
          <p className="mt-4 text-gray-700 font-semibold">Loading donations...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg border-b border-purple-100 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)} 
                className="text-[#783be8] hover:text-purple-700 transition p-2 rounded-lg hover:bg-purple-50"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Wallet className="w-8 h-8 text-[#783be8]" />
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                  All Donations
                </h1>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px -10px rgba(120, 59, 232, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-bold shadow-lg"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div 
            variants={scaleIn}
            whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(120, 59, 232, 0.3)" }}
            className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-[#783be8]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">Total Raised</p>
                <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                  ₹{stats.totalAmount?.toLocaleString() || 0}
                </p>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Wallet className="w-12 h-12 md:w-14 md:h-14 text-[#783be8]" />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={scaleIn}
            whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.3)" }}
            className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">Total Donors</p>
                <p className="text-3xl md:text-4xl font-extrabold text-blue-600">{stats.uniqueDonors || 0}</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Users className="w-12 h-12 md:w-14 md:h-14 text-blue-500" />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={scaleIn}
            whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(168, 85, 247, 0.3)" }}
            className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">Average Donation</p>
                <p className="text-3xl md:text-4xl font-extrabold text-purple-600">₹{Math.round(stats.averageDonation || 0).toLocaleString()}</p>
              </div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <TrendingUp className="w-12 h-12 md:w-14 md:h-14 text-purple-500" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-purple-100"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#783be8] w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by donor name, email, message, or amount..."
              className="w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-[#783be8] focus:border-[#783be8] transition-all text-gray-700 font-medium"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3 font-medium">
            Found <span className="font-bold text-[#783be8] text-lg">{filteredDonations.length}</span> donation(s)
          </p>
        </motion.div>

        {/* Donations Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-100"
        >
          {filteredDonations.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Wallet className="w-20 h-20 text-purple-300 mx-auto mb-6" />
              </motion.div>
              <p className="text-gray-700 text-xl font-semibold mb-2">No donations found</p>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-100">
                <thead className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
                  <tr>
                    <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">Donor</th>
                    <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-50">
                  {filteredDonations.map((donation, index) => (
                    <motion.tr 
                      key={donation._id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "#faf5ff", scale: 1.01 }}
                      className="transition-all cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-[#783be8] to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                          >
                            <span className="text-white font-bold text-lg">
                              {donation.donor?.name?.charAt(0) || 'A'}
                            </span>
                          </motion.div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{donation.donor?.name || 'Anonymous'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-medium">{donation.donor?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                          ₹{donation.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">
                          {new Date(donation.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {new Date(donation.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs font-medium">{donation.message || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className={`px-4 py-2 inline-flex text-xs leading-5 font-bold rounded-full shadow-md ${
                            donation.status === 'completed'
                              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                              : donation.status === 'pending'
                              ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200'
                              : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default NGODonations;
