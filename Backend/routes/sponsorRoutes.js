const express = require('express');
const router = express.Router();

// Public route - get all sponsors info
router.get('/sponsors', (req, res) => {
  const sponsors = [
    {
      id: 1,
      name: 'Tata Trusts',
      logo: 'https://www.tatatrusts.org/assets/images/logo.png',
      website: 'https://www.tatatrusts.org/',
      focus: ['Education', 'Healthcare', 'Livelihood', 'Rural Development'],
      description: 'One of India\'s oldest philanthropic organizations focusing on comprehensive community development.',
      fundingRange: '₹10 Lakhs - ₹5 Crores',
      applicationPeriod: 'Year-round'
    },
    {
      id: 2,
      name: 'Reliance Foundation',
      logo: 'https://www.reliancefoundation.org/static/rf-logo.svg',
      website: 'https://www.reliancefoundation.org/',
      focus: ['Rural Transformation', 'Education', 'Health', 'Arts & Culture'],
      description: 'Leading corporate foundation with focus on holistic development and traditional arts preservation.',
      fundingRange: '₹5 Lakhs - ₹3 Crores',
      applicationPeriod: 'Quarterly'
    },
    {
      id: 3,
      name: 'Infosys Foundation',
      logo: 'https://www.infosys.com/content/dam/infosys-web/en/global-resource/logo/infosys-logo.svg',
      website: 'https://www.infosys.com/infosys-foundation',
      focus: ['Education', 'Healthcare', 'Arts & Culture', 'Social Rehabilitation'],
      description: 'Supports initiatives in education, healthcare, and preservation of Indian arts and culture.',
      fundingRange: '₹3 Lakhs - ₹2 Crores',
      applicationPeriod: 'Half-yearly'
    },
    {
      id: 4,
      name: 'Adani Foundation',
      logo: 'https://adanifoundation.org/static/images/logo.svg',
      website: 'https://adanifoundation.org/',
      focus: ['Education', 'Community Health', 'Sustainable Livelihood', 'Rural Infrastructure'],
      description: 'Focused on community development with emphasis on skill development and livelihood.',
      fundingRange: '₹5 Lakhs - ₹2 Crores',
      applicationPeriod: 'Year-round'
    },
    {
      id: 5,
      name: 'Mahindra Group',
      logo: 'https://www.mahindra.com/images/mahindra-logo.svg',
      website: 'https://www.mahindra.com/',
      focus: ['Education', 'Livelihood', 'Environment', 'Arts & Heritage'],
      description: 'Corporate sponsor supporting education, skill development, and cultural heritage preservation.',
      fundingRange: '₹4 Lakhs - ₹1.5 Crores',
      applicationPeriod: 'Annual'
    },
    {
      id: 6,
      name: 'HDFC Bank',
      logo: 'https://www.hdfcbank.com/content/dam/hdfcbank/common-images/common/logo.svg',
      website: 'https://www.hdfcbank.com/aboutus/csr/csr_initiatives',
      focus: ['Education', 'Skill Development', 'Livelihood', 'Healthcare'],
      description: 'Banking giant supporting skill development, education, and sustainable livelihood programs.',
      fundingRange: '₹3 Lakhs - ₹1 Crore',
      applicationPeriod: 'Quarterly'
    }
  ];

  res.json({
    success: true,
    data: sponsors
  });
});

module.exports = router;
