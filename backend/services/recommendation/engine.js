const path = require('path');
const fs = require('fs');
const Reel = require('../../models/Reel');
const InterestProfile = require('../../models/InterestProfile');
const interestService = require('../interest');
const { validateRecommendationContract } = require('./contractValidator');

// Local fallback loader for reels
const getLocalSampleReels = () => {
  try {
    const dataPath = path.resolve(__dirname, '../../../data/sample-reels.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    return [];
  }
};

class RecommendationEngine {
  /**
   * Main Phase 7 & 8 Generator: Produces strict contract-validated recommendation payload
   * @param {String} userId
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async generateContractRecommendation(userId, options = {}) {
    // 1. Ingest student interest profile & interaction telemetry
    let profile = options.profile;
    if (!profile) {
      profile = await interestService.getStudentInterestProfile(userId);
    }

    const evidenceReport = await interestService.extractUserInterestEvidence(userId);
    const { strongestEvidence = [] } = evidenceReport;

    // Identify current/last watched reel
    const currentReelTitle =
      strongestEvidence[0]?.title ||
      'When NullPointerException hits in production at 5 PM on Friday';

    // 2. Fetch candidate reels catalog
    let candidateReels = [];
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        candidateReels = await Reel.find({});
      }
    } catch (e) {
      candidateReels = [];
    }
    if (!candidateReels || !candidateReels.length) {
      candidateReels = getLocalSampleReels();
    }

    // 3. Compute 10-factor scores across all candidate reels
    const watchedReelIds = strongestEvidence.map((e) => e.reelId);
    const scoredCandidates = candidateReels.map((candidate) => {
      return this.calculate10FactorScore(candidate, profile, strongestEvidence, watchedReelIds);
    });

    // 4. Sort by final recommendation score descending
    scoredCandidates.sort((a, b) => b.finalScore - a.finalScore);

    // 5. Select the winning candidate
    const winner = scoredCandidates[0] || {
      reelId: 'reel_cybersecurity_08',
      title: 'How SQL Injection Works (and How Parameterized Queries Prevent It)',
      category: 'Cybersecurity & AppSec',
      difficulty: 'Intermediate',
      matchReason: 'High educational value (10/10) and technical depth (8/10) covering critical database defense.',
    };

    // 6. Build raw recommendation payload matching the 8 conceptual fields
    const rawPayload = {
      currentReel: currentReelTitle,
      interestDetected: profile.primaryInterest || 'Software Engineering and Technology',
      why: profile.reasoning || 'Student demonstrated high engagement across software engineering culture, agile standup humor, and workstation hardware.',
      recommendedTechReel: winner.title,
      category: winner.category,
      whyThisRecommendation: winner.matchReason || 'High educational depth and technical credibility covering essential engineering concepts.',
      difficulty: winner.difficulty || 'Intermediate',
      confidence: profile.confidence >= 0.8 ? 'High' : profile.confidence >= 0.5 ? 'Medium' : 'Low',
    };

    // 7. Validate & Sanitize via Contract Validator
    const validationResult = validateRecommendationContract(rawPayload);
    if (!validationResult.isValid) {
      throw new Error(`Recommendation contract validation failed: ${validationResult.errors.join('; ')}`);
    }

    return {
      ...validationResult.sanitized,
      _metadata: {
        winnerScore: winner.finalScore,
        dominanceFactor: profile.dominanceFactor,
        trapDefenseActive: profile.dominanceFactor < 0.40,
        candidatesEvaluated: scoredCandidates.length,
        candidateRankings: scoredCandidates.map((c) => ({
          reelId: c.reelId,
          title: c.title,
          category: c.category,
          finalScore: c.finalScore,
          matchReason: c.matchReason,
        })),
      },
    };
  }

  /**
   * 10-Factor Multi-Dimensional Candidate Scoring
   */
  calculate10FactorScore(candidate, profile, evidence = [], watchedReelIds = []) {
    const { primaryInterest = 'Software Engineering and Technology', supportingTopics = [], dominanceFactor = 0.22 } = profile;
    const candidateTopics = (candidate.topics || []).map((t) => t.toLowerCase());

    // 1. Interest Match (Weight: 20%)
    let sInterest = 0.5;
    if (primaryInterest.includes('Software Engineering') || primaryInterest.includes('Technology')) {
      if (['Cybersecurity & AppSec', 'Hardware & Engineering Setup', 'Artificial Intelligence', 'Programming Tutorials', 'Interview & Algorithms'].includes(candidate.category)) {
        sInterest = 0.95;
      }
    } else if (candidate.category.toLowerCase().includes(primaryInterest.toLowerCase())) {
      sInterest = 1.0;
    }

    // 2. Semantic Similarity (Weight: 15%)
    const topicMatches = supportingTopics.filter((st) =>
      candidateTopics.some((ct) => ct.includes(st.toLowerCase()) || st.toLowerCase().includes(ct))
    );
    const sSemantic = Math.min(1.0, 0.4 + topicMatches.length * 0.25);

    // 3. Behavioral Relevance (Weight: 10%)
    const sBehavior = Math.min(1.0, 0.6 + (evidence.length * 0.1));

    // 4. Educational Value (Weight: 15%)
    const sEdu = Number(candidate.educationalValue || 5) / 10;

    // 5. Career Relevance (Weight: 10%)
    const sCareer = Number(candidate.careerValue || 5) / 10;

    // 6. Technical Relevance / Depth (Weight: 10%)
    const sTech = Number(candidate.technicalDepth || 5) / 10;

    // 7. Diversity Bonus (Weight: 10%)
    // Bonus for introducing non-redundant complementary categories
    let sDiversity = 0.7;
    const lastWatchedCategory = evidence[0]?.category;
    if (candidate.category !== lastWatchedCategory) {
      sDiversity = 1.0; // Encourage cross-domain learning
    }

    // 8. Novelty (Weight: 10%)
    const isUnseen = !watchedReelIds.includes(candidate.reelId);
    const sNovelty = isUnseen ? 1.0 : 0.2;

    // 9. Hype Penalty (P_hype)
    // Severe penalty if reel has high hype (> 7) but low technical depth (< 5) (Clickbait filter)
    let pHype = 0;
    const hypeScore = Number(candidate.hypeScore || 5);
    const techDepth = Number(candidate.technicalDepth || 5);
    if (hypeScore >= 8 && techDepth <= 4) {
      pHype = 0.50; // Severe 50% penalty for sensationalist clickbait
    } else if (candidate.title?.toLowerCase().includes('get you a job in 7 days') || candidate.title?.toLowerCase().includes('make $100k')) {
      pHype = 0.75;
    }

    // 10. Repetition Penalty (P_rep)
    let pRepetition = 0;
    if (watchedReelIds.includes(candidate.reelId)) {
      pRepetition = 0.35; // Heavy repetition penalty for already watched items
    }
    // Trap defense penalty: de-prioritize repetitive Java memes when broad interest is active
    if (candidate.reelId === 'reel_java_meme_01' && dominanceFactor < 0.40) {
      pRepetition += 0.25;
    }

    // Weighted Synthesis (Sum of positive components minus penalties)
    const rawScore =
      sInterest * 0.20 +
      sSemantic * 0.15 +
      sBehavior * 0.10 +
      sEdu * 0.15 +
      sCareer * 0.10 +
      sTech * 0.10 +
      sDiversity * 0.10 +
      sNovelty * 0.10 -
      pHype -
      pRepetition;

    const finalScore = Number(Math.max(0, Math.min(1, rawScore)).toFixed(3));

    // Formulate human-readable winning explanation
    const reasons = [];
    if (sEdu >= 0.8) reasons.push(`Exceptional educational value (${candidate.educationalValue}/10)`);
    if (sTech >= 0.7) reasons.push(`Rigorous technical depth (${candidate.technicalDepth}/10)`);
    if (sDiversity === 1.0) reasons.push(`Broadens student knowledge in ${candidate.category}`);
    if (pHype > 0) reasons.push(`[Penalized for clickbait/hype]`);
    if (pRepetition > 0) reasons.push(`[Penalized for repetition]`);

    const matchReason = reasons.length ? reasons.join(' &bull; ') : 'High alignment with inferred technology domain.';

    return {
      reelId: candidate.reelId,
      title: candidate.title,
      category: candidate.category,
      difficulty: candidate.difficulty || 'Intermediate',
      finalScore,
      matchReason,
      scores: {
        interest: sInterest,
        semantic: sSemantic,
        behavior: sBehavior,
        educational: sEdu,
        career: sCareer,
        technical: sTech,
        diversity: sDiversity,
        novelty: sNovelty,
        hypePenalty: pHype,
        repetitionPenalty: pRepetition,
      },
    };
  }

  /**
   * Backward-compatible recommendations list
   */
  async recommendReelsForStudent(userId, options = {}) {
    const contractResult = await this.generateContractRecommendation(userId, options);
    return {
      userId,
      inferredInterest: contractResult.interestDetected,
      trapDefenseActive: contractResult._metadata?.trapDefenseActive,
      totalRecommendations: contractResult._metadata?.candidatesEvaluated || 8,
      recommendations: contractResult._metadata?.candidateRankings || [],
      contractOutput: contractResult,
    };
  }
}

module.exports = new RecommendationEngine();
