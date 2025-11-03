const asyncHandler = require('express-async-handler');
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');
const Donation = require('../models/Donation');
const Connection = require('../models/Connection');
const User = require('../models/User');

// @desc    Generate AI-powered NGO report
// @route   POST /api/ngo/reports/generate
// @access  Private (NGO only)
const generateNGOReport = asyncHandler(async (req, res) => {
  const { period } = req.body;

  console.log('=== Report Generation Started ===');
  console.log('Period:', period);
  console.log('NGO ID:', req.user._id);
  console.log('NGO Name:', req.user.name);

  try {
    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    console.log('Date Range:', startDate, 'to', now);

    // Get donations received
    console.log('Fetching donations...');
    const donations = await Donation.find({
      ngo: req.user._id,
      createdAt: { $gte: startDate },
    }).populate('donor', 'name email');
    console.log('Donations found:', donations.length);

    // Get artisan connections with full artisan details
    console.log('Fetching connections...');
    const connections = await Connection.find({
      ngo: req.user._id,
      status: 'accepted',
      createdAt: { $gte: startDate },
    }).populate('artisan', 'name email');
    console.log('New connections found:', connections.length);

    // Get all active connections for total count
    const allConnections = await Connection.find({
      ngo: req.user._id,
      status: 'accepted',
    }).populate('artisan', 'name email');
    console.log('Total connections:', allConnections.length);

    // Calculate statistics
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
    const uniqueDonors = [...new Set(donations.map(d => d.donor?._id?.toString()))].filter(Boolean).length;
    const avgDonation = donations.length > 0 ? totalDonations / donations.length : 0;

    // Get top donors
    const donorMap = {};
    donations.forEach(d => {
      if (d.donor) {
        const donorId = d.donor._id.toString();
        if (!donorMap[donorId]) {
          donorMap[donorId] = {
            name: d.donor.name,
            email: d.donor.email,
            totalAmount: 0,
            count: 0,
          };
        }
        donorMap[donorId].totalAmount += d.amount;
        donorMap[donorId].count += 1;
      }
    });

    const topDonors = Object.values(donorMap)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);

    // Get artisan details
    const artisanList = connections
      .filter(c => c.artisan)
      .map(c => ({
        name: c.artisan.name,
        email: c.artisan.email,
        connectedAt: c.createdAt,
      }));

    console.log('Statistics calculated successfully');

    // Prepare data for AI
    const reportData = {
      period,
      ngoName: req.user.name,
      dateRange: {
        from: startDate.toLocaleDateString('en-IN'),
        to: new Date().toLocaleDateString('en-IN'),
      },
      donations: {
        total: totalDonations,
        count: donations.length,
        uniqueDonors,
        avgDonation: Math.round(avgDonation),
      },
      artisans: {
        newConnections: connections.length,
        totalConnections: allConnections.length,
        list: artisanList,
      },
      topDonors,
    };

    // Generate AI report if API key exists
    let aiInsights = '';
    
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log('Generating AI insights...');
      try {
        const model = google('gemini-2.0-flash-exp');

        const prompt = `Generate a professional NGO impact report. Use plain text only, no special symbols, asterisks, or markdown formatting.

Organization: ${reportData.ngoName}
Report Period: ${period}
Date Range: ${reportData.dateRange.from} to ${reportData.dateRange.to}

FINANCIAL DATA:
Total Donations Received: Rs ${reportData.donations.total.toLocaleString()}
Number of Donations: ${reportData.donations.count}
Unique Donors: ${reportData.donations.uniqueDonors}
Average Donation Amount: Rs ${reportData.donations.avgDonation.toLocaleString()}

ARTISAN SUPPORT DATA:
New Artisan Connections This Period: ${reportData.artisans.newConnections}
Total Active Artisan Connections: ${reportData.artisans.totalConnections}

New Artisans Connected:
${artisanList.length > 0 ? artisanList.map((a, i) => `${i + 1}. ${a.name} (Connected: ${new Date(a.connectedAt).toLocaleDateString('en-IN')})`).join('\n') : 'No new artisan connections in this period'}

Top Contributors:
${topDonors.length > 0 ? topDonors.map((d, i) => `${i + 1}. ${d.name} - Rs ${d.totalAmount.toLocaleString()} across ${d.count} donation${d.count > 1 ? 's' : ''}`).join('\n') : 'No donations in this period'}

Generate a professional report with these exact sections in plain text format:

EXECUTIVE SUMMARY
Write 2-3 sentences summarizing the overall impact and achievements.

KEY ACHIEVEMENTS
List 3-5 major accomplishments during this period.

FINANCIAL PERFORMANCE ANALYSIS
Analyze donation trends, donor engagement, and financial health.

ARTISAN SUPPORT IMPACT
Describe the impact of supporting ${reportData.artisans.totalConnections} artisan${reportData.artisans.totalConnections > 1 ? 's' : ''}, including the ${reportData.artisans.newConnections} new connection${reportData.artisans.newConnections !== 1 ? 's' : ''} made this period. Mention the importance of preserving traditional crafts.

DONOR RECOGNITION
Acknowledge top donors and their contribution to the mission.

RECOMMENDATIONS FOR GROWTH
Provide 3-4 actionable recommendations for increasing impact.

FUTURE GOALS
Outline 2-3 strategic goals for the next period.

Use professional language, plain text only, no special formatting symbols. Use "Rs" for currency.`;

        const { text } = await generateText({
          model,
          prompt,
          temperature: 0.7,
          maxTokens: 1500,
        });

        // Clean up any remaining special characters
        aiInsights = text
          .replace(/[*#_`~]/g, '')
          .replace(/₹/g, 'Rs ')
          .replace(/\*\*/g, '')
          .trim();

        console.log('AI insights generated successfully');
      } catch (aiError) {
        console.error('AI Generation Error:', aiError.message);
        // Fallback to manual report if AI fails
        aiInsights = generateFallbackReport(reportData, artisanList, topDonors);
      }
    } else {
      console.log('No AI API key, using fallback report');
      aiInsights = generateFallbackReport(reportData, artisanList, topDonors);
    }

    console.log('=== Report Generation Completed Successfully ===');

    res.json({
      success: true,
      data: {
        period,
        dateRange: reportData.dateRange,
        statistics: {
          donations: reportData.donations,
          artisans: reportData.artisans,
        },
        topDonors,
        artisanList,
        aiInsights,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('=== Report Generation Failed ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: `Failed to generate report: ${error.message}`,
    });
  }
});

// Helper function for fallback report
function generateFallbackReport(reportData, artisanList, topDonors) {
  return `NGO IMPACT REPORT

Organization: ${reportData.ngoName}
Period: ${reportData.period.toUpperCase()}
Date Range: ${reportData.dateRange.from} to ${reportData.dateRange.to}

EXECUTIVE SUMMARY

During this ${reportData.period} period, ${reportData.ngoName} successfully raised Rs ${reportData.donations.total.toLocaleString()} through ${reportData.donations.count} donation${reportData.donations.count !== 1 ? 's' : ''} from ${reportData.donations.uniqueDonors} unique donor${reportData.donations.uniqueDonors !== 1 ? 's' : ''}. The organization connected with ${reportData.artisans.newConnections} new artisan${reportData.artisans.newConnections !== 1 ? 's' : ''}, bringing the total active artisan network to ${reportData.artisans.totalConnections}.

FINANCIAL PERFORMANCE

Total Donations: Rs ${reportData.donations.total.toLocaleString()}
Number of Donations: ${reportData.donations.count}
Unique Donors: ${reportData.donations.uniqueDonors}
Average Donation: Rs ${reportData.donations.avgDonation.toLocaleString()}

${reportData.donations.count > 0 ? `The average donation of Rs ${reportData.donations.avgDonation.toLocaleString()} demonstrates strong donor commitment to our mission.` : 'Focus on engaging donors to build a sustainable funding base.'}

ARTISAN SUPPORT IMPACT

New Artisan Connections: ${reportData.artisans.newConnections}
Total Active Artisans: ${reportData.artisans.totalConnections}

${artisanList.length > 0 ? `Artisans Connected This Period:\n${artisanList.map((a, i) => `${i + 1}. ${a.name} - Connected on ${new Date(a.connectedAt).toLocaleDateString('en-IN')}`).join('\n')}` : 'No new artisan connections during this period. Focus on outreach efforts.'}

By supporting these artisans, we are preserving traditional Indian handicrafts and providing sustainable livelihoods to skilled craftspeople.

TOP DONORS

${topDonors.length > 0 ? topDonors.map((d, i) => `${i + 1}. ${d.name} - Rs ${d.totalAmount.toLocaleString()} (${d.count} donation${d.count > 1 ? 's' : ''})`).join('\n') : 'No donations recorded during this period.'}

RECOMMENDATIONS

1. Increase artisan outreach to connect with more traditional craftspeople
2. Develop donor recognition programs to strengthen relationships
3. Create impact stories showcasing artisan success
4. Expand fundraising channels to reach new donor segments

FUTURE GOALS

1. Connect with at least ${Math.max(5, reportData.artisans.newConnections * 2)} new artisans in the next period
2. Increase total donations by 20 percent
3. Launch artisan showcase events to increase visibility

Continue making a positive impact in preserving traditional Indian handicrafts and supporting artisan communities.`;
}

// @desc    Get report summary data
// @route   GET /api/ngo/reports/summary
// @access  Private (NGO only)
const getReportSummary = asyncHandler(async (req, res) => {
  try {
    const now = new Date();

    // Last 30 days
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const donations30 = await Donation.find({
      ngo: req.user._id,
      createdAt: { $gte: last30Days },
    });

    const connections30 = await Connection.find({
      ngo: req.user._id,
      status: 'accepted',
      createdAt: { $gte: last30Days },
    });

    // Last 7 days
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const donations7 = await Donation.find({
      ngo: req.user._id,
      createdAt: { $gte: last7Days },
    });

    // All time
    const allDonations = await Donation.find({ ngo: req.user._id });
    const allConnections = await Connection.find({ 
      ngo: req.user._id, 
      status: 'accepted' 
    });

    res.json({
      success: true,
      data: {
        weekly: {
          donations: donations7.length,
          amount: donations7.reduce((sum, d) => sum + d.amount, 0),
        },
        monthly: {
          donations: donations30.length,
          amount: donations30.reduce((sum, d) => sum + d.amount, 0),
          artisans: connections30.length,
        },
        allTime: {
          donations: allDonations.length,
          amount: allDonations.reduce((sum, d) => sum + d.amount, 0),
          artisans: allConnections.length,
        },
      },
    });
  } catch (error) {
    console.error('Summary Error:', error);
    res.status(500);
    throw new Error('Failed to fetch summary');
  }
});

module.exports = {
  generateNGOReport,
  getReportSummary,
};
