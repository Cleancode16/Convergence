import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-teal-600 to-green-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/ngo-dashboard')}
              className="text-white hover:text-gray-200 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="ml-4 text-2xl font-bold text-white">AI-Powered Reports</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-blue-500" />
                <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  Last 7 Days
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Weekly Impact</p>
              <p className="text-3xl font-bold text-gray-900">₹{summary.weekly.amount.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{summary.weekly.donations} donations</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-8 h-8 text-purple-500" />
                <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  Last 30 Days
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Monthly Impact</p>
              <p className="text-3xl font-bold text-gray-900">₹{summary.monthly.amount.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">
                {summary.monthly.donations} donations • {summary.monthly.artisans} artisans
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  All Time
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Impact</p>
              <p className="text-3xl font-bold text-gray-900">₹{summary.allTime.amount.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">
                {summary.allTime.donations} donations • {summary.allTime.artisans} artisans
              </p>
            </div>
          </div>
        )}

        {/* Report Generation */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-teal-600" />
            Generate AI-Powered Report
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleGenerateReport('weekly')}
              disabled={loading}
              className={`p-6 rounded-xl border-2 transition ${
                selectedPeriod === 'weekly' && report
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
              } disabled:opacity-50`}
            >
              <Calendar className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Weekly Report</h3>
              <p className="text-sm text-gray-600">Last 7 days analysis</p>
            </button>

            <button
              onClick={() => handleGenerateReport('monthly')}
              disabled={loading}
              className={`p-6 rounded-xl border-2 transition ${
                selectedPeriod === 'monthly' && report
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
              } disabled:opacity-50`}
            >
              <BarChart3 className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Monthly Report</h3>
              <p className="text-sm text-gray-600">Last 30 days insights</p>
            </button>

            <button
              onClick={() => handleGenerateReport('yearly')}
              disabled={loading}
              className={`p-6 rounded-xl border-2 transition ${
                selectedPeriod === 'yearly' && report
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
              } disabled:opacity-50`}
            >
              <TrendingUp className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Yearly Report</h3>
              <p className="text-sm text-gray-600">Last 12 months overview</p>
            </button>
          </div>

          {loading && (
            <div className="mt-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mb-4"></div>
              <p className="text-gray-600">Generating AI-powered insights...</p>
            </div>
          )}
        </div>

        {/* Generated Report */}
        {report && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="w-7 h-7 text-teal-600" />
                {report.period.charAt(0).toUpperCase() + report.period.slice(1)} Report
              </h2>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition font-semibold shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Period:</span> {report.dateRange.from} to {report.dateRange.to}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Generated: {new Date(report.generatedAt).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-teal-50 to-green-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-teal-600" />
                  Financial Overview
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Donations:</span>
                    <span className="font-bold text-teal-600">₹{report.statistics.donations.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Donations:</span>
                    <span className="font-bold">{report.statistics.donations.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unique Donors:</span>
                    <span className="font-bold">{report.statistics.donations.uniqueDonors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Donation:</span>
                    <span className="font-bold text-teal-600">₹{report.statistics.donations.avgDonation.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Artisan Support
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Connections:</span>
                    <span className="font-bold text-purple-600">{report.statistics.artisans.newConnections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Connections:</span>
                    <span className="font-bold text-purple-600">{report.statistics.artisans.totalConnections}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Donors */}
            {report.topDonors.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  Top Donors
                </h3>
                <div className="space-y-3">
                  {report.topDonors.map((donor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-teal-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{donor.name}</p>
                          <p className="text-sm text-gray-500">{donor.count} donation{donor.count > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <p className="font-bold text-teal-600 text-lg">₹{donor.totalAmount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Artisan Support */}
            {report.artisanList && report.artisanList.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Artisans Connected This Period
                </h3>
                <div className="space-y-3">
                  {report.artisanList.map((artisan, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{artisan.name}</p>
                          <p className="text-sm text-gray-500">{artisan.email}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Connected: {new Date(artisan.connectedAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights */}
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                AI-Generated Impact Analysis
              </h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-base">
                  {report.aiInsights}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NGOReports;
