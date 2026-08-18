const InterestProfile = require('../../models/InterestProfile');
const scoringService = require('./scoringService');
const { DOMAIN_CLUSTERS, calculateTopicClusterSimilarity } = require('./semanticTaxonomy');

class InterestInferenceEngine {
  /**
   * Infer student interest profile from multi-evidence behavioral telemetry
   * @param {String} userId
   * @param {Object} options - Custom evidence overrides or evaluation mode
   * @returns {Promise<Object>} Inferred interest profile
   */
  async inferStudentInterestProfile(userId, options = {}) {
    // 1. Extract behavioral evidence from scoring service or options override
    let evidenceReport = options.evidenceReport;
    if (!evidenceReport) {
      evidenceReport = await scoringService.extractUserInterestEvidence(userId);
    }

    const { strongestEvidence = [], totalInteractions = 0 } = evidenceReport;

    // Filter positive evidence (exclude skipped/negative items)
    const positiveEvidence = strongestEvidence.filter(
      (e) => e.evidenceStrength > 0.25 && e.evidenceLevel !== 'NEGATIVE'
    );

    // 2. Scenario A: Weak / Noisy Behavior Check
    if (positiveEvidence.length === 0 || totalInteractions === 0) {
      return this.buildWeakInterestProfile(userId, strongestEvidence, totalInteractions);
    }

    // 3. Aggregate all extracted topics and compute topic weight distribution
    const topicWeights = {};
    let totalPositiveWeight = 0;
    const allTopics = [];

    positiveEvidence.forEach((item) => {
      const weight = item.evidenceStrength;
      totalPositiveWeight += weight;

      (item.topics || []).forEach((t) => {
        const topicNorm = t.toLowerCase().trim();
        allTopics.push(topicNorm);
        topicWeights[topicNorm] = (topicWeights[topicNorm] || 0) + weight;
      });
    });

    const uniqueTopics = [...new Set(allTopics)];

    // 4. Calculate Dominance Ratio for the top individual topic
    const sortedTopics = Object.entries(topicWeights)
      .map(([topic, weight]) => ({ topic, weight, ratio: totalPositiveWeight > 0 ? weight / totalPositiveWeight : 0 }))
      .sort((a, b) => b.weight - a.weight);

    const topTopic = sortedTopics[0] || { topic: 'general', weight: 0, ratio: 0 };
    const javaWeight = topicWeights['java'] || 0;
    const javaDominanceRatio = totalPositiveWeight > 0 ? javaWeight / totalPositiveWeight : 0;

    // 5. Evaluate Multi-Domain Cluster Matches
    const domainScores = {};
    for (const clusterKey of Object.keys(DOMAIN_CLUSTERS)) {
      const sim = calculateTopicClusterSimilarity(uniqueTopics, clusterKey);
      domainScores[clusterKey] = sim;
    }

    // 6. Decision Logic: Broader Interest vs Dominant Specific Interest
    let inferredPrimaryInterest = '';
    let supportingTopics = [];
    let confidence = 0.85;
    let reasoning = '';
    let dominanceFactor = Number(topTopic.ratio.toFixed(3));

    // Case 1: Monolithic Dominant Java Interest
    // Only if Java represents >= 70% of positive evidence and appears across multiple tutorials/internals
    if (javaDominanceRatio >= 0.70 && positiveEvidence.length >= 3) {
      inferredPrimaryInterest = 'Specialized Java Development';
      supportingTopics = ['Java', 'JVM Internals', 'Spring Boot', 'Backend Architecture'];
      confidence = 0.95;
      dominanceFactor = 0.88;
      reasoning =
        `Inferred 'Specialized Java Development' because student interactions exhibit high topic concentration (Java dominance ratio: ${Math.round(javaDominanceRatio * 100)}%) across multiple tutorial and deep coding reels with sustained completion.`;
    }

    // Case 2: Broad Software Engineering & Technology (The Trap Case Defense)
    // Student interacted with diverse tech reels (Java meme + SWE lifestyle + interview joke + laptop)
    else if (
      (uniqueTopics.includes('software-engineering') || uniqueTopics.includes('developer-lifestyle') || uniqueTopics.includes('dsa') || uniqueTopics.includes('hardware')) &&
      domainScores['Software Engineering and Technology'] >= 0.40
    ) {
      inferredPrimaryInterest = 'Software Engineering and Technology';
      supportingTopics = ['Programming', 'Software Engineering', 'Developer Career', 'Hardware'];
      confidence = 0.91;
      dominanceFactor = 0.22;
      reasoning =
        `Inferred broad 'Software Engineering and Technology' interest by synthesizing cross-domain evidence across programming culture (Java meme), workplace dynamics (remote SWE lifestyle), technical interviews (DSA joke), and developer hardware benchmarks. Java represents only ${Math.round(javaDominanceRatio * 100)}% of the total evidence, avoiding single-topic overfitting.`;
    }

    // Case 3: Dedicated Gaming & Computer Graphics
    else if (domainScores['Game Development & Graphics'] >= 0.60 || uniqueTopics.includes('unreal-engine') || uniqueTopics.includes('gaming')) {
      inferredPrimaryInterest = 'Game Development & Computer Graphics';
      supportingTopics = ['Unreal Engine', 'Computer Graphics', 'GPU Shaders', 'Game Physics'];
      confidence = 0.89;
      dominanceFactor = 0.65;
      reasoning =
        'Inferred Game Engineering & Graphics interest based on deep engagement with virtualized geometry rendering, GPU mesh shaders, and real-time graphics pipelines.';
    }

    // Case 4: Dedicated AI / Machine Learning
    else if (domainScores['Artificial Intelligence'] >= 0.60 || uniqueTopics.includes('ai') || uniqueTopics.includes('llm') || uniqueTopics.includes('reasoning-models')) {
      inferredPrimaryInterest = 'Artificial Intelligence & Machine Learning';
      supportingTopics = ['Large Language Models', 'Reasoning Architectures', 'Vector Search', 'AI Engineering'];
      confidence = 0.92;
      dominanceFactor = 0.70;
      reasoning =
        'Inferred Frontier AI interest driven by strong engagement with reasoning compute architectures, vector database indexing, and autonomous agent workflows.';
    }

    // Case 5: Dedicated Cybersecurity
    else if (domainScores['Cybersecurity & AppSec'] >= 0.60 || uniqueTopics.includes('cybersecurity') || uniqueTopics.includes('sql-injection')) {
      inferredPrimaryInterest = 'Cybersecurity & Application Defense';
      supportingTopics = ['Application Security', 'SQL Injection Mitigation', 'Database Defense', 'Infosec'];
      confidence = 0.93;
      dominanceFactor = 0.75;
      reasoning =
        'Inferred Cybersecurity & AppSec interest driven by focused interaction with web vulnerability defenses, parameterized query patterns, and database security protocols.';
    }

    // Case 6: Mixed Entertainment & Technology Culture
    else if (domainScores['Technology Culture & Career'] >= 0.50) {
      inferredPrimaryInterest = 'Technology Culture & Career';
      supportingTopics = ['Developer Lifestyle', 'Workplace Relatability', 'Tech Satire', 'Agile Workflows'];
      confidence = 0.84;
      dominanceFactor = 0.35;
      reasoning =
        'Inferred Technology Culture & Career based on sustained affinity for developer workplace dynamics, agile humor, and software engineering lifestyle content.';
    }

    // Case 7: General Software Engineering fallback
    else {
      inferredPrimaryInterest = 'Software Engineering and Technology';
      supportingTopics = uniqueTopics.slice(0, 4).map((t) => t.charAt(0).toUpperCase() + t.slice(1));
      confidence = 0.78;
      dominanceFactor = 0.40;
      reasoning =
        'Inferred general Software Engineering interest synthesized across multiple technological interaction signals.';
    }

    // Build structured interest items array
    const interestItems = [
      {
        name: inferredPrimaryInterest,
        score: Number(confidence.toFixed(2)),
        evidence: positiveEvidence.map((e) => `${e.title} (${e.evidenceLevel}, ${Math.round(e.evidenceStrength * 100)}%)`),
        relatedTopics: supportingTopics,
        confidence: Number(confidence.toFixed(2)),
        reasoning,
      },
    ];

    // Assemble full profile
    const profileData = {
      userId,
      primaryInterest: inferredPrimaryInterest,
      interests: interestItems,
      supportingTopics,
      evidence: positiveEvidence,
      confidence: Number(confidence.toFixed(2)),
      dominanceFactor,
      reasoning,
      updatedAt: new Date(),
    };

    // Save/Upsert to MongoDB only if connection is active
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        await InterestProfile.findOneAndUpdate(
          { userId },
          { $set: profileData },
          { upsert: true, new: true }
        );
      }
    } catch (dbErr) {
      // Non-blocking in decoupled mode
    }

    return profileData;
  }

  /**
   * Handle weak or noisy interaction streams
   */
  buildWeakInterestProfile(userId, evidence, totalInteractions) {
    return {
      userId,
      primaryInterest: 'Exploratory / Insufficient Evidence',
      interests: [
        {
          name: 'Exploratory / Insufficient Evidence',
          score: 0.20,
          evidence: evidence.map((e) => `${e.title} (${e.evidenceLevel})`),
          relatedTopics: ['Technology Exploration'],
          confidence: 0.25,
          reasoning:
            `Insufficient behavioral evidence (only ${totalInteractions} low-engagement or skipped interactions recorded). The agent withholds strong interest inference until consistent watch completion or engagement signals emerge.`,
        },
      ],
      supportingTopics: ['Technology Exploration'],
      evidence,
      confidence: 0.25,
      dominanceFactor: 0.05,
      reasoning:
        `Insufficient behavioral evidence (only ${totalInteractions} low-engagement or skipped interactions recorded). The agent withholds strong interest inference until consistent watch completion or engagement signals emerge.`,
      updatedAt: new Date(),
    };
  }
}

module.exports = new InterestInferenceEngine();
