const recommendationService = require('../services/recommendation');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * POST & GET /api/recommendations/generate/:userId
 * Generates personalized technology reel recommendation conforming strictly to the Phase 8 contract
 */
const generateRecommendation = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !userId.trim()) {
      return sendError(res, 'userId parameter is required.', null, 400);
    }

    const recommendation = await recommendationService.generateContractRecommendation(userId);

    // Return the clean 8 contract fields
    return res.status(200).json({
      success: true,
      currentReel: recommendation.currentReel,
      interestDetected: recommendation.interestDetected,
      why: recommendation.why,
      recommendedTechReel: recommendation.recommendedTechReel,
      category: recommendation.category,
      whyThisRecommendation: recommendation.whyThisRecommendation,
      difficulty: recommendation.difficulty,
      confidence: recommendation.confidence,
      _metadata: recommendation._metadata,
    });
  } catch (error) {
    console.error('Error in generateRecommendation:', error);
    return sendError(res, `Failed to generate recommendation: ${error.message}`, error, 500);
  }
};

module.exports = {
  generateRecommendation,
};
