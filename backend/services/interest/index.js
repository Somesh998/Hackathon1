const scoringService = require('./scoringService');
const inferenceEngine = require('./inferenceEngine');
const InterestProfile = require('../../models/InterestProfile');

class InterestService {
  /**
   * Compute normalized engagement score for a single interaction
   */
  calculateEngagementScore(interaction) {
    return scoringService.calculateEngagementScore(interaction);
  }

  /**
   * Compute aggregated interest evidence strength for a reel
   */
  calculateInterestEvidenceStrength(interactions, reel) {
    return scoringService.calculateInterestEvidenceStrength(interactions, reel);
  }

  /**
   * Extract ranked behavioral evidence for a student
   */
  async extractUserInterestEvidence(userId) {
    return scoringService.extractUserInterestEvidence(userId);
  }

  /**
   * Infer full interest profile from multi-evidence signals
   */
  async inferStudentInterestProfile(userId, options = {}) {
    return inferenceEngine.inferStudentInterestProfile(userId, options);
  }

  /**
   * Retrieve cached or freshly computed interest profile
   */
  async getStudentInterestProfile(userId) {
    // Check if existing profile exists in MongoDB
    try {
      const cachedProfile = await InterestProfile.findOne({ userId });
      if (cachedProfile) {
        return cachedProfile;
      }
    } catch (err) {
      // Continue to fresh inference
    }

    // Compute fresh inference
    return inferenceEngine.inferStudentInterestProfile(userId);
  }
}

module.exports = new InterestService();
