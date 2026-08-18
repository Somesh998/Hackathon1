const reelAnalyzer = require('./reelAnalyzer');
const { validateAIAnalysis, ALLOWED_DOMAINS } = require('./validator');

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'local-semantic-engine';
    this.apiKey = process.env.AI_API_KEY || null;
    this.model = process.env.AI_MODEL || 'gpt-4o-mini';
  }

  isConfigured() {
    return reelAnalyzer.hasLiveApiKey();
  }

  /**
   * Analyze reel semantic meaning and return structured JSON
   */
  async analyzeReel(reel) {
    return reelAnalyzer.analyzeReel(reel);
  }

  /**
   * Validate raw AI analysis
   */
  validateAnalysis(data) {
    return validateAIAnalysis(data);
  }

  getAllowedDomains() {
    return ALLOWED_DOMAINS;
  }
}

module.exports = new AIService();
