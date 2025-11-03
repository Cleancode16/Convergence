const asyncHandler = require('express-async-handler');
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');

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
    const model = google('gemini-2.0-flash-exp');

    const prompt = `You are an expert NGO fundraising consultant with deep knowledge of Indian corporate CSR programs.

Generate a detailed, step-by-step approach guide for an NGO to secure funding from ${sponsorName}.

NGO Details:
- Focus Area: ${ngoFocus || 'Artisan support and traditional crafts preservation'}
- Project Budget: ${projectBudget || 'Not specified'}

Provide a comprehensive JSON response with the following structure:
{
  "overview": "A 2-3 sentence summary of ${sponsorName}'s CSR priorities and why they might fund this NGO",
  "steps": [
    {
      "step": 1,
      "title": "Research & Alignment",
      "description": "Detailed action items for understanding their priorities",
      "timeline": "Time needed for this step",
      "keyActions": ["Action 1", "Action 2", "Action 3"]
    },
    {
      "step": 2,
      "title": "Prepare Documentation",
      "description": "What documents and materials to prepare",
      "timeline": "Time needed",
      "keyActions": ["Required documents list"]
    },
    {
      "step": 3,
      "title": "Contact Strategy",
      "description": "How to make initial contact",
      "timeline": "Time needed",
      "keyActions": ["Contact methods and tips"]
    },
    {
      "step": 4,
      "title": "Proposal Submission",
      "description": "How to structure and submit the proposal",
      "timeline": "Time needed",
      "keyActions": ["Proposal elements and submission process"]
    },
    {
      "step": 5,
      "title": "Follow-up & Engagement",
      "description": "Post-submission activities",
      "timeline": "Time needed",
      "keyActions": ["Follow-up strategies"]
    }
  ],
  "tips": [
    "Specific tip 1 for ${sponsorName}",
    "Specific tip 2",
    "Specific tip 3",
    "Specific tip 4",
    "Specific tip 5"
  ],
  "documents": [
    "Essential document 1",
    "Essential document 2",
    "Essential document 3",
    "Essential document 4"
  ],
  "timeline": "Overall timeline from start to potential approval",
  "successFactors": [
    "Key success factor 1",
    "Key success factor 2",
    "Key success factor 3"
  ]
}

Make it specific to ${sponsorName}'s actual CSR programs, priorities, and application processes. Be practical and actionable.

Return ONLY valid JSON, no markdown formatting.`;

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
    console.error('AI Guidance Error:', error);
    res.status(500);
    throw new Error(`Failed to generate guidance: ${error.message}`);
  }
});

module.exports = {
  getSponsorApproach
};
