import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Sparkles,
  BarChart3,
  IndianRupee
} from 'lucide-react';
import { generateReport, getReportSummary } from '../services/ngoReportService';
// import { jsPDF } from 'jspdf'; // Comment this temporarily

const NGOReports = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [report, setReport] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Animation Variants
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
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const data = await getReportSummary(userInfo.token);
      setSummary(data.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleGenerateReport = async (period) => {
    setLoading(true);
    setSelectedPeriod(period);
    
    try {
      const data = await generateReport(period, userInfo.token);
      setReport(data.data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;

    const reportText = `
================================================================================
NGO IMPACT REPORT
================================================================================

Period: ${report.period.toUpperCase()}
Date Range: ${report.dateRange.from} to ${report.dateRange.to}
Generated: ${new Date(report.generatedAt).toLocaleString('en-IN')}

================================================================================
FINANCIAL OVERVIEW
================================================================================

Total Donations Received: Rs ${report.statistics.donations.total.toLocaleString()}
Number of Donations: ${report.statistics.donations.count}
Unique Donors: ${report.statistics.donations.uniqueDonors}
Average Donation Amount: Rs ${report.statistics.donations.avgDonation.toLocaleString()}

================================================================================
ARTISAN SUPPORT
================================================================================

New Artisan Connections This Period: ${report.statistics.artisans.newConnections}
Total Active Artisan Connections: ${report.statistics.artisans.totalConnections}

${report.artisanList && report.artisanList.length > 0 ? `
Artisans Connected During This Period:
${report.artisanList.map((a, i) => `${i + 1}. ${a.name}
   Email: ${a.email}
   Connected: ${new Date(a.connectedAt).toLocaleDateString('en-IN')}`).join('\n\n')}
` : 'No new artisan connections during this period.'}

================================================================================
TOP DONORS
================================================================================

${report.topDonors.map((d, i) => `${i + 1}. ${d.name}
   Total Contribution: Rs ${d.totalAmount.toLocaleString()}
   Number of Donations: ${d.count}
   Email: ${d.email}`).join('\n\n')}

================================================================================
AI-GENERATED INSIGHTS AND ANALYSIS
================================================================================

${report.aiInsights}

================================================================================
END OF REPORT
================================================================================
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NGO_Impact_Report_${report.period}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const downloadPDF = () => {
    alert('PDF download temporarily disabled. Install jsPDF first: npm install jspdf');
    // if (!report) return;

    // const doc = new jsPDF();
    // const pageWidth = doc.internal.pageSize.getWidth();
    // const pageHeight = doc.internal.pageSize.getHeight();
    // const margin = 20;
    // const maxWidth = pageWidth - 2 * margin;
    // let yPosition = margin;

    // // Helper function to add text with word wrap
    // const addText = (text, fontSize = 10, isBold = false) => {
    //   doc.setFontSize(fontSize);
    //   doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      
    //   const lines = doc.splitTextToSize(text, maxWidth);
    //   lines.forEach(line => {
    //     if (yPosition > pageHeight - margin) {
    //       doc.addPage();
    //       yPosition = margin;
    //     }
    //     doc.text(line, margin, yPosition);
    //     yPosition += fontSize * 0.5;
    //   });
    //   yPosition += 5;
    // };

    // const addSection = (title, content = '') => {
    //   yPosition += 5;
    //   doc.setDrawColor(76, 175, 80);
    //   doc.setLineWidth(0.5);
    //   doc.line(margin, yPosition, pageWidth - margin, yPosition);
    //   yPosition += 8;
    //   addText(title, 14, true);
    //   if (content) {
    //     addText(content, 10, false);
    //   }
    // };

    // // Title
    // doc.setFillColor(76, 175, 80);
    // doc.rect(0, 0, pageWidth, 30, 'F');
    // doc.setTextColor(255, 255, 255);
    // doc.setFontSize(20);
    // doc.setFont('helvetica', 'bold');
    // doc.text('NGO IMPACT REPORT', pageWidth / 2, 20, { align: 'center' });
    
    // yPosition = 40;
    // doc.setTextColor(0, 0, 0);

    // // Organization & Period
    // addText(`Organization: ${userInfo?.name || 'NGO'}`, 12, true);
    // addText(`Report Period: ${report.period.toUpperCase()}`, 11, false);
    // addText(`Date Range: ${report.dateRange.from} to ${report.dateRange.to}`, 10, false);
    // addText(`Generated: ${new Date(report.generatedAt).toLocaleString('en-IN')}`, 9, false);

    // // Financial Overview
    // addSection('FINANCIAL OVERVIEW');
    // addText(`Total Donations Received: Rs ${report.statistics.donations.total.toLocaleString()}`);
    // addText(`Number of Donations: ${report.statistics.donations.count}`);
    // addText(`Unique Donors: ${report.statistics.donations.uniqueDonors}`);
    // addText(`Average Donation: Rs ${report.statistics.donations.avgDonation.toLocaleString()}`);

    // // Artisan Support
    // addSection('ARTISAN SUPPORT');
    // addText(`New Connections This Period: ${report.statistics.artisans.newConnections}`);
    // addText(`Total Active Connections: ${report.statistics.artisans.totalConnections}`);
    
    // if (report.artisanList && report.artisanList.length > 0) {
    //   yPosition += 5;
    //   addText('Artisans Connected This Period:', 11, true);
    //   report.artisanList.forEach((artisan, index) => {
    //     addText(`${index + 1}. ${artisan.name}`);
    //     addText(`   Email: ${artisan.email}`, 9);
    //     addText(`   Connected: ${new Date(artisan.connectedAt).toLocaleDateString('en-IN')}`, 9);
    //   });
    // }

    // // Top Donors
    // if (report.topDonors.length > 0) {
    //   addSection('TOP DONORS');
    //   report.topDonors.forEach((donor, index) => {
    //     addText(`${index + 1}. ${donor.name}`);
    //     addText(`   Total Contribution: Rs ${donor.totalAmount.toLocaleString()}`, 9);
    //     addText(`   Number of Donations: ${donor.count}`, 9);
    //     addText(`   Email: ${donor.email}`, 9);
    //   });
    // }

    // // AI Insights
    // addSection('AI-GENERATED INSIGHTS AND ANALYSIS');
    // addText(report.aiInsights, 10, false);

    // // Footer
    // const footerY = pageHeight - 15;
    // doc.setFontSize(8);
    // doc.setTextColor(128, 128, 128);
    // doc.text('CraftConnect - Empowering Artisans, Preserving Traditions', pageWidth / 2, footerY, { align: 'center' });

    // // Save PDF
    // doc.save(`NGO_Impact_Report_${report.period}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/ngo-dashboard')}
              className="text-[#783be8] hover:text-purple-700 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div className="ml-4 flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-7 h-7 text-[#783be8]" />
              </motion.div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                AI-Powered Impact Reports
              </h1>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        {summary && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div 
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(120, 59, 232, 0.25)" }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100"
            >
              <div className="flex items-center justify-between mb-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Calendar className="w-8 h-8 text-blue-600" />
                </motion.div>
                <span className="text-sm font-bold text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-2 rounded-full shadow">
                  Last 7 Days
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2 font-semibold">Weekly Impact</p>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ₹{summary.weekly.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2 font-medium">{summary.weekly.donations} donations</p>
            </motion.div>

            <motion.div 
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(120, 59, 232, 0.25)" }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100"
            >
              <div className="flex items-center justify-between mb-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BarChart3 className="w-8 h-8 text-[#783be8]" />
                </motion.div>
                <span className="text-sm font-bold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full shadow">
                  Last 30 Days
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2 font-semibold">Monthly Impact</p>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-[#783be8] to-purple-600 bg-clip-text text-transparent">
                ₹{summary.monthly.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2 font-medium">
                {summary.monthly.donations} donations • {summary.monthly.artisans} artisans
              </p>
            </motion.div>

            <motion.div 
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(120, 59, 232, 0.25)" }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100"
            >
              <div className="flex items-center justify-between mb-3">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </motion.div>
                <span className="text-sm font-bold text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full shadow">
                  All Time
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2 font-semibold">Total Impact</p>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ₹{summary.allTime.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2 font-medium">
                {summary.allTime.donations} donations • {summary.allTime.artisans} artisans
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Report Generation */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-purple-100"
        >
          <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-[#783be8]" />
            </motion.div>
            <span className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
              Generate AI-Powered Report
            </span>
          </h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.button
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenerateReport('weekly')}
              disabled={loading}
              className={`p-8 rounded-2xl border-2 transition ${
                selectedPeriod === 'weekly' && report
                  ? 'border-[#783be8] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-xl'
                  : 'border-purple-200 hover:border-[#783be8] hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50'
              } disabled:opacity-50`}
            >
              <motion.div
                animate={selectedPeriod === 'weekly' && report ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Calendar className="w-10 h-10 text-[#783be8] mx-auto mb-4" />
              </motion.div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Weekly Report</h3>
              <p className="text-sm text-gray-600 font-medium">Last 7 days analysis</p>
            </motion.button>

            <motion.button
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenerateReport('monthly')}
              disabled={loading}
              className={`p-8 rounded-2xl border-2 transition ${
                selectedPeriod === 'monthly' && report
                  ? 'border-[#783be8] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-xl'
                  : 'border-purple-200 hover:border-[#783be8] hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50'
              } disabled:opacity-50`}
            >
              <motion.div
                animate={selectedPeriod === 'monthly' && report ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BarChart3 className="w-10 h-10 text-[#783be8] mx-auto mb-4" />
              </motion.div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Monthly Report</h3>
              <p className="text-sm text-gray-600 font-medium">Last 30 days insights</p>
            </motion.button>

            <motion.button
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenerateReport('yearly')}
              disabled={loading}
              className={`p-8 rounded-2xl border-2 transition ${
                selectedPeriod === 'yearly' && report
                  ? 'border-[#783be8] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-xl'
                  : 'border-purple-200 hover:border-[#783be8] hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50'
              } disabled:opacity-50`}
            >
              <motion.div
                animate={selectedPeriod === 'yearly' && report ? { y: [0, -5, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="w-10 h-10 text-[#783be8] mx-auto mb-4" />
              </motion.div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Yearly Report</h3>
              <p className="text-sm text-gray-600 font-medium">Last 12 months overview</p>
            </motion.button>
          </motion.div>

          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block rounded-full h-16 w-16 border-4 border-[#783be8] border-t-transparent mb-4"
              />
              <p className="text-gray-700 font-semibold text-lg">Generating AI-powered insights...</p>
            </motion.div>
          )}
        </motion.div>

        {/* Generated Report */}
        {report && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-purple-100"
          >
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <FileText className="w-8 h-8 text-[#783be8]" />
                <span className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                  {report.period.charAt(0).toUpperCase() + report.period.slice(1)} Report
                </span>
              </h2>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(120, 59, 232, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadPDF}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-purple-700 transition font-bold shadow-xl"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </motion.button>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
              <p className="text-sm text-gray-700 font-semibold">
                <span className="font-extrabold text-[#783be8]">Period:</span> {report.dateRange.from} to {report.dateRange.to}
              </p>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                Generated: {new Date(report.generatedAt).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Statistics */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div 
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-lg"
              >
                <h3 className="font-extrabold text-gray-900 mb-5 flex items-center gap-3 text-lg">
                  <IndianRupee className="w-6 h-6 text-[#783be8]" />
                  Financial Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Donations:</span>
                    <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-[#783be8] bg-clip-text text-transparent">
                      ₹{report.statistics.donations.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Number of Donations:</span>
                    <span className="font-bold text-gray-900">{report.statistics.donations.count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Unique Donors:</span>
                    <span className="font-bold text-gray-900">{report.statistics.donations.uniqueDonors}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Average Donation:</span>
                    <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-[#783be8] bg-clip-text text-transparent">
                      ₹{report.statistics.donations.avgDonation.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-lg"
              >
                <h3 className="font-extrabold text-gray-900 mb-5 flex items-center gap-3 text-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                  Artisan Support
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">New Connections:</span>
                    <span className="font-extrabold text-xl text-purple-600">{report.statistics.artisans.newConnections}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Connections:</span>
                    <span className="font-extrabold text-xl text-purple-600">{report.statistics.artisans.totalConnections}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Top Donors */}
            {report.topDonors.length > 0 && (
              <div className="mb-8">
                <h3 className="font-extrabold text-gray-900 mb-6 flex items-center gap-3 text-xl">
                  <TrendingUp className="w-6 h-6 text-[#783be8]" />
                  Top Donors
                </h3>
                <div className="space-y-4">
                  {report.topDonors.map((donor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 10, boxShadow: "0 10px 20px -10px rgba(120, 59, 232, 0.3)" }}
                      className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-purple-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-[#783be8] rounded-full flex items-center justify-center shadow-lg">
                          <span className="font-bold text-white text-lg">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{donor.name}</p>
                          <p className="text-sm text-gray-600 font-medium">
                            {donor.count} donation{donor.count > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <p className="font-extrabold text-2xl bg-gradient-to-r from-indigo-600 to-[#783be8] bg-clip-text text-transparent">
                        ₹{donor.totalAmount.toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Artisan Support */}
            {report.artisanList && report.artisanList.length > 0 && (
              <div className="mb-8">
                <h3 className="font-extrabold text-gray-900 mb-6 flex items-center gap-3 text-xl">
                  <Users className="w-6 h-6 text-purple-600" />
                  Artisans Connected This Period
                </h3>
                <div className="space-y-4">
                  {report.artisanList.map((artisan, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 10, boxShadow: "0 10px 20px -10px rgba(168, 85, 247, 0.3)" }}
                      className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{artisan.name}</p>
                          <p className="text-sm text-gray-600 font-medium">{artisan.email}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 font-semibold bg-white px-4 py-2 rounded-full shadow">
                        {new Date(artisan.connectedAt).toLocaleDateString('en-IN')}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights */}
            <div className="p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-lg">
              <h3 className="font-extrabold text-gray-900 mb-6 flex items-center gap-3 text-xl">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-[#783be8]" />
                </motion.div>
                <span className="bg-gradient-to-r from-indigo-600 via-[#783be8] to-purple-600 bg-clip-text text-transparent">
                  AI-Generated Impact Analysis
                </span>
              </h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-base bg-white p-6 rounded-xl border-2 border-purple-100 shadow">
                  {report.aiInsights}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default NGOReports;
