import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Search, Wallet, Users, Download, Calendar, TrendingUp, IndianRupee } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-green-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 transition">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">All Donations</h1>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Raised</p>
                <p className="text-3xl font-bold text-green-600">₹{stats.totalAmount?.toLocaleString() || 0}</p>
              </div>
              <Wallet className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Donors</p>
                <p className="text-3xl font-bold text-blue-600">{stats.uniqueDonors || 0}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Donation</p>
                <p className="text-3xl font-bold text-purple-600">₹{Math.round(stats.averageDonation || 0).toLocaleString()}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by donor name, email, message, or amount..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Found <span className="font-bold text-green-600">{filteredDonations.length}</span> donation(s)
          </p>
        </div>

        {/* Donations Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredDonations.length === 0 ? (
            <div className="text-center py-16">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No donations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-green-50 to-teal-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Donor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDonations.map((donation) => (
                    <tr key={donation._id} className="hover:bg-green-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{donation.donor?.name || 'Anonymous'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{donation.donor?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base font-bold text-green-600">₹{donation.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(donation.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(donation.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">{donation.message || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          donation.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : donation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NGODonations;
