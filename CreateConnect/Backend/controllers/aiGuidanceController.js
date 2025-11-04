const asyncHandler = require('express-async-handler');
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');

// Fallback sponsor approach data
const getFallbackGuidance = (sponsorName) => ({
  "overview": `${sponsorName} is one of India's leading corporate CSR sponsors with a strong focus on social development and cultural preservation. They actively support NGOs working in traditional crafts, artisan welfare, and skill development. Your NGO's focus on artisan support aligns well with their CSR priorities.`,
  "steps": [
    {
      "step": 1,
      "title": "Research & Alignment",
      "description": `Study ${sponsorName}'s annual CSR report and recent funded projects to understand their priorities and funding patterns.`,
      "timeline": "1-2 weeks",
      "keyActions": [
        `Visit ${sponsorName}'s official CSR page and download their latest annual report`,
        "Identify projects similar to yours that they've funded",
        "Note their preferred project size, duration, and impact metrics",
        "Research their application deadlines and submission windows"
      ]
    },
    {
      "step": 2,
      "title": "Prepare Documentation",
      "description": "Compile comprehensive documentation showcasing your NGO's credibility, track record, and project proposal.",
      "timeline": "2-3 weeks",
      "keyActions": [
        "Prepare detailed project proposal with clear objectives, timeline, and budget breakdown",
        "Gather NGO registration certificates, 12A & 80G certifications, audited financials",
        "Create impact reports from previous projects with photographs and testimonials",
        "Develop a compelling presentation deck highlighting artisan success stories",
        "Prepare letters of support from beneficiaries and community leaders"
      ]
    },
    {
      "step": 3,
      "title": "Contact Strategy",
      "description": `Identify and connect with the right decision-makers at ${sponsorName}'s CSR department.`,
      "timeline": "2-4 weeks",
      "keyActions": [
        "Find CSR head's contact through LinkedIn or official channels",
        "Send a concise introductory email highlighting alignment with their CSR goals",
        "Follow up with a phone call after 3-5 business days",
        "Request a meeting to present your proposal in detail",
        "Leverage any mutual connections for warm introductions"
      ]
    },
    {
      "step": 4,
      "title": "Proposal Submission",
      "description": "Submit a well-structured, professional proposal through their official channels.",
      "timeline": "1-2 weeks",
      "keyActions": [
        "Follow their specific proposal format and guidelines exactly",
        "Include executive summary, need analysis, implementation plan, and monitoring framework",
        "Provide detailed budget with justifications for each line item",
        "Attach all supporting documents in the required format",
        "Submit before the deadline with confirmation of receipt"
      ]
    },
    {
      "step": 5,
      "title": "Follow-up & Engagement",
      "description": "Maintain professional engagement throughout the review and decision process.",
      "timeline": "4-8 weeks",
      "keyActions": [
        "Send a thank you email immediately after submission",
        "Follow up every 2 weeks for status updates",
        "Be prepared to present your project to their CSR committee if invited",
        "Respond promptly to any queries or requests for additional information",
        "If approved, ensure timely agreement signing and project kickoff"
      ]
    }
  ],
  "tips": [
    `Emphasize measurable impact - ${sponsorName} values projects with clear, quantifiable outcomes`,
    "Highlight alignment with Sustainable Development Goals (SDGs), especially SDG 8 (Decent Work) and SDG 10 (Reduced Inequalities)",
    "Demonstrate financial sustainability - show how the project will have long-term impact beyond the funding period",
    "Provide evidence of community participation and artisan involvement in project planning",
    "Be transparent about challenges and risks, with mitigation strategies clearly outlined",
    "Showcase innovation in traditional crafts preservation while maintaining cultural authenticity"
  ],
  "documents": [
    "NGO Registration Certificate (Trust/Society/Section 8 Company)",
    "12A and 80G Tax Exemption Certificates from Income Tax Department",
    "Last 3 years' audited financial statements and annual reports",
    "Detailed project proposal with objectives, activities, timeline, and budget",
    "Letters of support from artisan communities and local administration",
    "Impact assessment reports from previous projects",
    "Bank account details and cancelled cheque",
    "List of board members with brief profiles"
  ],
  "timeline": "The entire process from initial research to funding approval typically takes 3-6 months. Be patient and persistent throughout.",
  "successFactors": [
    "Strong track record of successful artisan welfare projects with documented impact",
    "Clear alignment between your NGO's mission and the sponsor's CSR priorities",
    "Professional, well-documented proposal with realistic budget and timelines",
    "Transparent governance and financial management practices",
    "Ability to scale impact and create sustainable livelihood opportunities for artisans"
  ]
});

// @desc    Get AI-powered approach guide for sponsor
// @route   POST /api/ai-guidance/sponsor-approach
// @access  Private (NGO)
const getSponsorApproach = asyncHandler(async (req, res) => {
  const { sponsorName, ngoFocus, projectBudget } = req.body;

  if (!sponsorName) {
    res.status(400);
    throw new Error('Please provide sponsor name');
  }

  try {
    // Check if API key exists
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log('Using fallback guidance - API key not configured');
      return res.json({
        success: true,
        data: getFallbackGuidance(sponsorName),
        note: 'This is a general guidance template. For more specific recommendations, please configure AI settings.'
      });
    }

    const model = google('gemini-2.0-flash-exp');

    const prompt = `You are an expert NGO fundraising consultant with deep knowledge of Indian corporate CSR programs.

Generate a detailed, step-by-step approach guide for an NGO to secure funding from ${sponsorName}.

NGO Details:
- Focus Area: ${ngoFocus || 'Artisan support and traditional crafts preservation'}
- Project Budget: ${projectBudget || '5-20 Lakhs'}

Provide a comprehensive JSON response with the following structure:
{
  "overview": "A 2-3 sentence summary of ${sponsorName}'s CSR priorities and why they might fund this NGO",
  "steps": [
    {
      "step": 1,
      "title": "Research & Alignment",
      "description": "Detailed action items",
      "timeline": "Time needed",
      "keyActions": ["Action 1", "Action 2", "Action 3"]
    }
    // ... 5 steps total
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "documents": ["Doc 1", "Doc 2", "Doc 3", "Doc 4"],
  "timeline": "Overall timeline",
  "successFactors": ["Factor 1", "Factor 2", "Factor 3"]
}

Make it specific to ${sponsorName}'s actual CSR programs. Return ONLY valid JSON.`;

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      maxTokens: 3000,
    });

    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const guidance = JSON.parse(cleanedText);

    res.json({
      success: true,
      data: guidance
    });
  } catch (error) {
    console.error('AI Guidance Error:', error.message);
    
    // Return fallback on any error
    console.log('Using fallback guidance due to error');
    res.json({
      success: true,
      data: getFallbackGuidance(sponsorName),
      note: 'AI service temporarily unavailable. Showing general guidance template.'
    });
  }
});

module.exports = {
  getSponsorApproach
};
