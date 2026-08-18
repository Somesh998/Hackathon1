const interestService = require('../services/interest');
const recommendationService = require('../services/recommendation');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * GET /api/interests/:userId
 * Retrieve student's inferred interest profile
 */
const getStudentInterestProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !userId.trim()) {
      return sendError(res, 'userId parameter is required.', null, 400);
    }

    const profile = await interestService.getStudentInterestProfile(userId);

    return sendSuccess(
      res,
      `Inferred interest profile retrieved for student '${userId}'`,
      profile
    );
  } catch (error) {
    console.error('Error in getStudentInterestProfile:', error);
    return sendError(res, 'Failed to fetch student interest profile', error, 500);
  }
};

/**
 * POST /api/interests/infer/:userId
 * Force re-computation of student's inferred interest profile
 */
const triggerInterestInference = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !userId.trim()) {
      return sendError(res, 'userId parameter is required.', null, 400);
    }

    const profile = await interestService.inferStudentInterestProfile(userId);

    return sendSuccess(
      res,
      `Fresh interest profile computed for student '${userId}'`,
      profile
    );
  } catch (error) {
    console.error('Error in triggerInterestInference:', error);
    return sendError(res, 'Failed to infer student interest profile', error, 500);
  }
};

/**
 * GET /api/interests/evidence/:userId
 * Return raw behavioral evidence signals
 */
const getStudentInterestEvidence = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !userId.trim()) {
      return sendError(res, 'userId parameter is required.', null, 400);
    }

    const evidenceProfile = await interestService.extractUserInterestEvidence(userId);

    return sendSuccess(
      res,
      `Extracted behavioral interest evidence for user '${userId}'`,
      evidenceProfile
    );
  } catch (error) {
    console.error('Error in getStudentInterestEvidence:', error);
    return sendError(res, 'Failed to extract student interest evidence', error, 500);
  }
};

/**
 * GET /api/interests/recommendations/:userId
 * Generate recommendations based on inferred interest profile
 */
const getStudentRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !userId.trim()) {
      return sendError(res, 'userId parameter is required.', null, 400);
    }

    const recommendations = await recommendationService.recommendReelsForStudent(userId);

    return sendSuccess(
      res,
      `Personalized recommendations generated for student '${userId}'`,
      recommendations
    );
  } catch (error) {
    console.error('Error in getStudentRecommendations:', error);
    return sendError(res, 'Failed to generate student recommendations', error, 500);
  }
};

module.exports = {
  getStudentInterestProfile,
  triggerInterestInference,
  getStudentInterestEvidence,
  getStudentRecommendations,
};
