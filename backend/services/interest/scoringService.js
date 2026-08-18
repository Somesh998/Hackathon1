const Reel = require('../../models/Reel');
const Interaction = require('../../models/Interaction');

// Behavioral signal weights
const WEIGHTS = {
  VIEW: 1,
  HIGH_COMPLETION: 2,     // completionRate >= 0.80
  MODERATE_COMPLETION: 1, // 0.50 <= completionRate < 0.80
  LIKE: 3,
  SAVE: 4,
  SHARE: 5,
  SKIP: -2,
};

const MIN_RAW_SCORE = -2;
const MAX_RAW_SCORE = 15; // 1 (view) + 2 (high comp) + 3 (like) + 4 (save) + 5 (share)

/**
 * Calculate normalized engagement score (0.0 to 1.0) for a single interaction event
 * @param {Object} interaction
 * @returns {Number} normalized score between 0.0 and 1.0
 */
const calculateEngagementScore = (interaction) => {
  if (!interaction) return 0;

  let rawScore = 0;

  // 1. Base interaction type weight
  if (interaction.interactionType === 'SKIP' || interaction.skipped) {
    rawScore += WEIGHTS.SKIP;
  } else {
    rawScore += WEIGHTS.VIEW;
  }

  // 2. Completion rate weight
  const rate = Number(interaction.completionRate || 0);
  if (rate >= 0.8) {
    rawScore += WEIGHTS.HIGH_COMPLETION;
  } else if (rate >= 0.5) {
    rawScore += WEIGHTS.MODERATE_COMPLETION;
  }

  // 3. Explicit action flag weights
  if (interaction.liked || interaction.interactionType === 'LIKE') {
    rawScore += WEIGHTS.LIKE;
  }
  if (interaction.saved || interaction.interactionType === 'SAVE') {
    rawScore += WEIGHTS.SAVE;
  }
  if (interaction.shared || interaction.interactionType === 'SHARE') {
    rawScore += WEIGHTS.SHARE;
  }

  // Normalize between 0.0 and 1.0
  const normalized = (rawScore - MIN_RAW_SCORE) / (MAX_RAW_SCORE - MIN_RAW_SCORE);
  return Number(Math.max(0, Math.min(1, normalized)).toFixed(4));
};

/**
 * Calculate aggregated interest evidence strength for a specific reel and its topic footprint
 * @param {Array} interactions - All interactions for a student on this reel
 * @param {Object} reel - Reel metadata
 * @returns {Object} evidence metrics
 */
const calculateInterestEvidenceStrength = (interactions = [], reel = null) => {
  if (!interactions.length) {
    return {
      evidenceStrength: 0,
      evidenceLevel: 'NONE',
      totalEngagementScore: 0,
      viewCount: 0,
      avgCompletionRate: 0,
      likes: 0,
      saves: 0,
      shares: 0,
      skips: 0,
    };
  }

  let totalEngagement = 0;
  let totalCompletion = 0;
  let likes = 0;
  let saves = 0;
  let shares = 0;
  let skips = 0;

  interactions.forEach((item) => {
    const score = calculateEngagementScore(item);
    totalEngagement += score;
    totalCompletion += Number(item.completionRate || 0);

    if (item.liked || item.interactionType === 'LIKE') likes++;
    if (item.saved || item.interactionType === 'SAVE') saves++;
    if (item.shared || item.interactionType === 'SHARE') shares++;
    if (item.skipped || item.interactionType === 'SKIP') skips++;
  });

  const viewCount = interactions.length;
  const avgCompletionRate = Number((totalCompletion / viewCount).toFixed(2));

  // Repeated view multiplier: each re-watch adds a 15% boost to positive interest signal
  const repeatMultiplier = 1 + Math.max(0, (viewCount - 1) * 0.15);

  // Raw evidence score combines average engagement, repeat factor, and high-intent saves/shares
  const intentBonus = (saves * 0.3) + (shares * 0.4) + (likes * 0.2);
  const skipPenalty = skips * 0.5;

  const rawStrength = ((totalEngagement / viewCount) * repeatMultiplier * avgCompletionRate) + intentBonus - skipPenalty;
  const normalizedStrength = Number(Math.max(0, Math.min(1, rawStrength)).toFixed(4));

  // Categorize evidence tier
  let evidenceLevel = 'LOW';
  if (normalizedStrength >= 0.75) evidenceLevel = 'VERY_HIGH';
  else if (normalizedStrength >= 0.55) evidenceLevel = 'HIGH';
  else if (normalizedStrength >= 0.35) evidenceLevel = 'MODERATE';
  else if (normalizedStrength < 0.20 || skips > 0 && likes === 0) evidenceLevel = 'NEGATIVE';

  return {
    evidenceStrength: normalizedStrength,
    evidenceLevel,
    avgCompletionRate,
    viewCount,
    likes,
    saves,
    shares,
    skips,
    totalEngagementScore: Number(totalEngagement.toFixed(4)),
  };
};

/**
 * Extract and rank the strongest behavioral interest evidence for a student
 * @param {String} userId
 * @returns {Promise<Object>}
 */
const extractUserInterestEvidence = async (userId) => {
  const mongoose = require('mongoose');
  let interactions = [];
  
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    interactions = await Interaction.find({ userId }).sort({ timestamp: -1 });
  }

  if (!interactions.length) {
    return {
      userId,
      totalInteractions: 0,
      evidenceSummary: [],
      topicAffinity: {},
      strongestEvidence: [],
      message: `No interaction history found for student '${userId}'`,
    };
  }

  // Group interactions by reelId
  const interactionsByReel = {};
  interactions.forEach((item) => {
    if (!interactionsByReel[item.reelId]) {
      interactionsByReel[item.reelId] = [];
    }
    interactionsByReel[item.reelId].push(item);
  });

  // Fetch reel metadata
  const reelIds = Object.keys(interactionsByReel);
  let reels = [];
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    reels = await Reel.find({ reelId: { $in: reelIds } });
  }
  const reelMap = new Map(reels.map((r) => [r.reelId, r]));

  const evidenceItems = [];
  const topicScores = {};

  for (const [rId, userReelInteractions] of Object.entries(interactionsByReel)) {
    const reel = reelMap.get(rId) || {
      reelId: rId,
      title: 'Unknown Reel',
      category: 'General',
      topics: [],
    };

    const evidenceMetrics = calculateInterestEvidenceStrength(userReelInteractions, reel);

    const evidenceRecord = {
      reelId: rId,
      title: reel.title,
      category: reel.category,
      topics: reel.topics || [],
      evidenceStrength: evidenceMetrics.evidenceStrength,
      evidenceLevel: evidenceMetrics.evidenceLevel,
      signals: {
        viewCount: evidenceMetrics.viewCount,
        avgCompletionRate: evidenceMetrics.avgCompletionRate,
        likes: evidenceMetrics.likes,
        saves: evidenceMetrics.saves,
        shares: evidenceMetrics.shares,
        skips: evidenceMetrics.skips,
        totalEngagementScore: evidenceMetrics.totalEngagementScore,
      },
    };

    evidenceItems.push(evidenceRecord);

    // Aggregate topic affinities
    if (evidenceMetrics.evidenceStrength > 0.15) {
      (reel.topics || []).forEach((topic) => {
        topicScores[topic] = (topicScores[topic] || 0) + evidenceMetrics.evidenceStrength;
      });
    }
  }

  // Sort evidence by strength descending
  evidenceItems.sort((a, b) => b.evidenceStrength - a.evidenceStrength);

  // Normalize topic affinities
  const sortedTopics = Object.entries(topicScores)
    .map(([topic, score]) => ({ topic, score: Number(score.toFixed(3)) }))
    .sort((a, b) => b.score - a.score);

  return {
    userId,
    totalInteractions: interactions.length,
    distinctReelsInteracted: evidenceItems.length,
    strongestEvidence: evidenceItems,
    topTopicAffinities: sortedTopics,
    analyzedAt: new Date().toISOString(),
  };
};

module.exports = {
  WEIGHTS,
  calculateEngagementScore,
  calculateInterestEvidenceStrength,
  extractUserInterestEvidence,
};
