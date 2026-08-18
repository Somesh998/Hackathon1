const recommendationEngine = require('./engine');
const contractValidator = require('./contractValidator');

class RecommendationService {
  /**
   * Main Phase 8 contract generator
   */
  async generateContractRecommendation(userId, options = {}) {
    return recommendationEngine.generateContractRecommendation(userId, options);
  }

  /**
   * Recommend candidate reels
   */
  async recommendReelsForStudent(userId, options = {}) {
    return recommendationEngine.recommendReelsForStudent(userId, options);
  }

  /**
   * Score candidate reel against 10 factors
   */
  calculate10FactorScore(candidate, profile, evidence, watchedReelIds) {
    return recommendationEngine.calculate10FactorScore(candidate, profile, evidence, watchedReelIds);
  }

  validateContract(payload) {
    return contractValidator.validateRecommendationContract(payload);
  }
}

module.exports = new RecommendationService();
