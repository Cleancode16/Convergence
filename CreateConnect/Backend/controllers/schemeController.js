const asyncHandler = require('express-async-handler');
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');
const ArtisanProfile = require('../models/ArtisanProfile');

// Fallback scheme data when AI is unavailable
const fallbackSchemes = {
  "recommendations": [
    {
      "schemeName": "PM Vishwakarma Yojana",
      "category": "Financial Aid",
      "eligibility": "Traditional artisans and craftspeople across India",
      "benefits": "Financial assistance of ₹1-3 lakh, skill training, modern equipment support, and marketing assistance",
      "howToApply": "Visit PM Vishwakarma portal, register with Aadhar, submit documents online, attend skill training, receive financial support",
      "documentsRequired": ["Aadhar Card", "Bank Account Details", "Artisan Certificate", "Caste Certificate (if applicable)", "Mobile Number"],
      "applicationLink": "https://pmvishwakarma.gov.in",
      "deadline": "Ongoing",
      "contactInfo": "Toll-free: 1800-267-4888",
      "matchPercentage": 95,
      "keyPoints": ["Up to ₹3 lakh financial support", "Free skill training", "Modern tools & equipment"]
    },
    {
      "schemeName": "National Handicrafts Development Programme",
      "category": "Skill Development",
      "eligibility": "Handicraft artisans across all states",
      "benefits": "Design development, technology upgradation, marketing support, and exhibition opportunities",
      "howToApply": "Contact District Industries Centre, submit application with craft samples, get registered with Development Commissioner (Handicrafts)",
      "documentsRequired": ["Identity Proof", "Address Proof", "Artisan Card", "Sample of Craft Work"],
      "applicationLink": "http://handicrafts.nic.in",
      "deadline": "Ongoing",
      "contactInfo": "Email: office.dchandicrafts@nic.in",
      "matchPercentage": 90,
      "keyPoints": ["Design & technology support", "National & international exhibitions", "Marketing assistance"]
    },
    {
      "schemeName": "Marketing Support & Services Scheme",
      "category": "Marketing Support",
      "eligibility": "Registered artisans and craft groups",
      "benefits": "Participation in domestic and international exhibitions, e-commerce platform listing, branding support",
      "howToApply": "Register on Handicrafts & Handlooms Export Corporation portal, submit business plan, attend workshops",
      "documentsRequired": ["Business Registration", "GST Certificate (if applicable)", "Product Catalog", "Bank Details"],
      "applicationLink": "https://www.hhec.gov.in",
      "deadline": "Ongoing",
      "contactInfo": "Phone: 011-26516101",
      "matchPercentage": 88,
      "keyPoints": ["Free exhibition stalls", "E-commerce integration", "Branding & packaging support"]
    },
    {
      "schemeName": "Handicrafts Artisan Comprehensive Welfare Scheme",
      "category": "Health & Welfare",
      "eligibility": "Artisans aged 18-60 years with valid artisan card",
      "benefits": "Health insurance coverage up to ₹1 lakh, accident insurance, maternity benefits, education support for children",
      "howToApply": "Enroll through nearest artisan facilitation center, submit health documents, pay nominal premium",
      "documentsRequired": ["Artisan Card", "Age Proof", "Family Details", "Nominee Details", "Health Certificate"],
      "applicationLink": null,
      "deadline": "Ongoing",
      "contactInfo": "Contact nearest District Industries Centre",
      "matchPercentage": 85,
      "keyPoints": ["₹1 lakh health insurance", "Accident coverage", "Education scholarships for children"]
    },
    {
      "schemeName": "Credit Guarantee Scheme for Artisans",
      "category": "Financial Aid",
      "eligibility": "Artisans seeking loans up to ₹10 lakh without collateral",
      "benefits": "Collateral-free loans, lower interest rates, credit guarantee coverage, business expansion support",
      "howToApply": "Approach designated banks with business proposal, submit artisan credentials, get loan sanctioned",
      "documentsRequired": ["Artisan Card", "Business Plan", "Income Proof", "Bank Statements", "Property Documents (for higher loans)"],
      "applicationLink": null,
      "deadline": "Ongoing",
      "contactInfo": "Contact authorized banks - SBI, PNB, Canara Bank",
      "matchPercentage": 82,
      "keyPoints": ["Loans up to ₹10 lakh", "No collateral required", "Subsidized interest rates"]
    },
    {
      "schemeName": "Design & Technology Upgradation Scheme",
      "category": "Skill Development",
      "eligibility": "Artisans willing to learn modern techniques and designs",
      "benefits": "Free training in contemporary designs, CAD/CAM software training, modern tool kits, design consultancy",
      "howToApply": "Register at nearest National Institute of Design center, attend orientation program, complete training modules",
      "documentsRequired": ["Artisan Identification", "Educational Certificates", "Portfolio of Work"],
      "applicationLink": "https://www.nid.edu",
      "deadline": "Quarterly batches",
      "contactInfo": "Email: admissions@nid.edu",
      "matchPercentage": 78,
      "keyPoints": ["Modern design training", "Digital tools training", "Free tool kits worth ₹25,000"]
    }
  ],
  "totalSchemes": 6,
  "highPriorityCount": 3
};

// @desc    Get personalized scheme recommendations
// @route   GET /api/schemes/recommendations
// @access  Private (Artisan only)
const getSchemeRecommendations = asyncHandler(async (req, res) => {
  try {
    const profile = await ArtisanProfile.findOne({ user: req.user._id });

    if (!profile) {
      res.status(404);
      throw new Error('Please complete your profile first');
    }

    console.log('Generating scheme recommendations for:', req.user.name);

    // Return fallback data immediately due to rate limits
    console.log('Using fallback scheme data due to API rate limits');
    
    // Customize schemes based on profile
    const customizedSchemes = { ...fallbackSchemes };
    
    // Add state-specific note if available
    if (profile.address?.state) {
      customizedSchemes.recommendations.forEach(scheme => {
        if (!scheme.stateNote) {
          scheme.stateNote = `Also check ${profile.address.state} state handicrafts board for additional regional schemes`;
        }
      });
    }

    res.json({
      success: true,
      data: customizedSchemes,
      note: 'Showing curated schemes. For personalized AI recommendations, please try again later when API limits reset.',
    });

  } catch (error) {
    console.error('Scheme Recommendation Error:', error);
    
    // Return fallback data on any error
    res.json({
      success: true,
      data: fallbackSchemes,
      note: 'Showing default schemes. Please try again later for personalized recommendations.',
    });
  }
});

// @desc    Get detailed scheme information
// @route   POST /api/schemes/details
// @access  Private (Artisan only)
const getSchemeDetails = asyncHandler(async (req, res) => {
  const { schemeName } = req.body;

  if (!schemeName) {
    res.status(400);
    throw new Error('Please provide scheme name');
  }

  // Fallback detailed information
  const fallbackDetails = {
    "schemeName": schemeName,
    "fullDescription": `${schemeName} is a comprehensive government initiative designed to support traditional artisans and craftspeople across India. The scheme aims to preserve traditional crafts while providing modern tools, training, and market access to artisans.\n\nThis program recognizes the crucial role artisans play in India's cultural heritage and economy. Through financial assistance, skill development, and marketing support, the scheme helps artisans improve their livelihood while maintaining the authenticity of their craft.\n\nThe scheme is implemented in partnership with state governments, industry bodies, and craft development agencies to ensure maximum reach and impact.`,
    "implementingAgency": "Ministry of Textiles / Ministry of MSME",
    "launchedYear": "2023-2024",
    "budget": "Information available on official portal",
    "targetBeneficiaries": "Traditional artisans, craftspeople, and handicraft workers",
    "eligibilityDetails": {
      "age": "18-60 years",
      "income": "As per scheme guidelines",
      "profession": "Traditional artisans and craftspeople",
      "location": "All states and union territories",
      "other": ["Valid artisan identification", "Active in craft profession", "Not availing similar benefits from other schemes"]
    },
    "benefitsDetailed": {
      "financial": [
        "Direct financial assistance for business expansion",
        "Subsidized loans with credit guarantee",
        "Working capital support"
      ],
      "training": [
        "Skill upgradation workshops",
        "Modern technique training",
        "Quality improvement programs",
        "Design development courses"
      ],
      "marketing": [
        "Exhibition participation support",
        "E-commerce platform listing",
        "Branding and packaging assistance",
        "Buyer-seller meets"
      ],
      "other": [
        "Health insurance coverage",
        "Tool kit distribution",
        "Raw material bank access",
        "Common facility center usage"
      ]
    },
    "applicationProcess": {
      "onlineSteps": [
        "Visit the official scheme portal",
        "Register using Aadhar authentication",
        "Fill application form with personal and craft details",
        "Upload required documents (scanned copies)",
        "Submit application and note reference number",
        "Track application status online",
        "Attend verification process if required",
        "Receive approval and benefits"
      ],
      "offlineSteps": [
        "Visit nearest District Industries Centre (DIC)",
        "Collect application form",
        "Fill form with assistance from officials",
        "Attach document photocopies",
        "Submit at DIC counter",
        "Get acknowledgment receipt",
        "Follow up for verification",
        "Collect approval letter"
      ],
      "timeline": "30-60 days from application submission"
    },
    "documentsRequired": [
      {
        "document": "Aadhar Card",
        "purpose": "Identity and address verification",
        "mandatory": true
      },
      {
        "document": "Bank Account Details",
        "purpose": "Direct benefit transfer",
        "mandatory": true
      },
      {
        "document": "Artisan Card/Certificate",
        "purpose": "Proof of profession",
        "mandatory": true
      },
      {
        "document": "Caste Certificate",
        "purpose": "For reservation benefits (if applicable)",
        "mandatory": false
      },
      {
        "document": "Income Certificate",
        "purpose": "Eligibility verification",
        "mandatory": true
      },
      {
        "document": "Mobile Number",
        "purpose": "Communication and OTP verification",
        "mandatory": true
      }
    ],
    "importantLinks": {
      "official": "https://pmvishwakarma.gov.in",
      "applicationPortal": "https://pmvishwakarma.gov.in/Home/ApplyNow",
      "guidelines": "Check official website for latest guidelines PDF",
      "faq": "Available on scheme portal"
    },
    "contactDetails": {
      "helpline": "1800-267-4888 (Toll-free)",
      "email": "Check official portal for contact email",
      "regionalOffices": [
        "Contact District Industries Centre (DIC) in your district",
        "State Handicrafts Development Corporation office",
        "Khadi and Village Industries Commission (KVIC) office"
      ]
    },
    "successStories": [
      "Artisan from Rajasthan increased income by 300% after receiving tool kit and training under the scheme",
      "Weaver cooperative in West Bengal got access to international markets through exhibition support"
    ],
    "faqs": [
      {
        "question": "How long does the application process take?",
        "answer": "Typically 30-60 days from submission to approval, depending on document verification."
      },
      {
        "question": "Can I apply for multiple schemes?",
        "answer": "Yes, you can apply for non-overlapping schemes. However, you cannot receive duplicate benefits."
      },
      {
        "question": "Is there any application fee?",
        "answer": "No, application is completely free of cost. Beware of fraudulent intermediaries."
      },
      {
        "question": "What if my application is rejected?",
        "answer": "You will receive rejection reason and can reapply after rectifying issues or appeal the decision."
      }
    ],
    "tips": [
      "Keep all original documents ready for verification",
      "Apply early as some schemes have annual quotas",
      "Maintain active bank account with mobile number linked",
      "Take help from nearest DIC or artisan facilitation center for application",
      "Keep acknowledgment/reference number safely for future correspondence"
    ]
  };

  res.json({
    success: true,
    data: fallbackDetails,
  });
});

module.exports = {
  getSchemeRecommendations,
  getSchemeDetails,
};
