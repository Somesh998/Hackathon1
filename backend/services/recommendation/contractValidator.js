/**
 * Recommendation Output Contract Validator & Safe Sanitizer (Phase 8)
 * Strictly enforces schema fields and whitelisted enums
 */

const ALLOWED_CATEGORIES = [
  'AI',
  'DSA',
  'Java',
  'HLD',
  'Cybersecurity',
  'Cloud',
  'Hardware',
  'Career',
  'Web Development',
  'Databases',
  'DevOps',
  'Other',
];

const ALLOWED_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const ALLOWED_CONFIDENCES = ['High', 'Medium', 'Low'];

/**
 * Normalizes and maps raw category string to the allowed enum whitelist
 */
const canonicalizeCategory = (raw) => {
  if (!raw || typeof raw !== 'string') return 'Other';
  const clean = raw.trim().toLowerCase();

  if (clean.includes('cyber') || clean.includes('security') || clean.includes('appsec') || clean.includes('infosec')) return 'Cybersecurity';
  if (clean.includes('ai') || clean.includes('artificial intelligence') || clean.includes('machine learning') || clean.includes('llm') || clean.includes('rag')) return 'AI';
  if (clean.includes('dsa') || clean.includes('algorithm') || clean.includes('leetcode') || clean.includes('data structure')) return 'DSA';
  if (clean.includes('hld') || clean.includes('system design') || clean.includes('distributed')) return 'HLD';
  if (clean.includes('cloud') || clean.includes('kubernetes') || clean.includes('docker') || clean.includes('aws')) return 'Cloud';
  if (clean.includes('hardware') || clean.includes('laptop') || clean.includes('gpu') || clean.includes('workstation')) return 'Hardware';
  if (clean.includes('career') || clean.includes('lifestyle') || clean.includes('standup') || clean.includes('interview')) return 'Career';
  if (clean.includes('web') || clean.includes('frontend') || clean.includes('css') || clean.includes('react')) return 'Web Development';
  if (clean.includes('database') || clean.includes('sql') || clean.includes('mongo')) return 'Databases';
  if (clean.includes('devops') || clean.includes('ci/cd') || clean.includes('pipeline')) return 'DevOps';
  if (clean.includes('java') || clean.includes('jvm') || clean.includes('spring')) return 'Java';

  const exact = ALLOWED_CATEGORIES.find((c) => c.toLowerCase() === clean);
  return exact || 'Other';
};

/**
 * Normalizes difficulty to 'Beginner', 'Intermediate', or 'Advanced'
 */
const canonicalizeDifficulty = (raw) => {
  if (!raw || typeof raw !== 'string') return 'Intermediate';
  const clean = raw.trim().toLowerCase();
  if (clean.includes('begin') || clean.includes('easy') || clean.includes('all')) return 'Beginner';
  if (clean.includes('adv') || clean.includes('hard') || clean.includes('deep')) return 'Advanced';
  return 'Intermediate';
};

/**
 * Normalizes confidence to 'High', 'Medium', or 'Low'
 */
const canonicalizeConfidence = (raw) => {
  if (typeof raw === 'number') {
    if (raw >= 0.8) return 'High';
    if (raw >= 0.5) return 'Medium';
    return 'Low';
  }
  if (!raw || typeof raw !== 'string') return 'Medium';
  const clean = raw.trim().toLowerCase();
  if (clean.includes('high') || clean.includes('9') || clean.includes('8')) return 'High';
  if (clean.includes('low') || clean.includes('1') || clean.includes('2') || clean.includes('3')) return 'Low';
  return 'Medium';
};

/**
 * Validates the recommendation payload against the Phase 8 output contract
 * @param {Object} payload
 * @returns {{ isValid: boolean, errors: string[], sanitized: Object|null }}
 */
const validateRecommendationContract = (payload) => {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      errors: ['Recommendation output must be a non-null JSON object.'],
      sanitized: null,
    };
  }

  // 1. currentReel
  if (!payload.currentReel || typeof payload.currentReel !== 'string' || !payload.currentReel.trim()) {
    errors.push("Missing or invalid 'currentReel' (must be a non-empty string).");
  }

  // 2. interestDetected
  if (!payload.interestDetected || typeof payload.interestDetected !== 'string' || !payload.interestDetected.trim()) {
    errors.push("Missing or invalid 'interestDetected' (must be a non-empty string).");
  }

  // 3. why
  if (!payload.why || typeof payload.why !== 'string' || !payload.why.trim()) {
    errors.push("Missing or invalid 'why' reasoning (must be a non-empty string).");
  }

  // 4. recommendedTechReel
  if (!payload.recommendedTechReel || typeof payload.recommendedTechReel !== 'string' || !payload.recommendedTechReel.trim()) {
    errors.push("Missing or invalid 'recommendedTechReel' (must be a non-empty string).");
  }

  // 5. whyThisRecommendation
  if (!payload.whyThisRecommendation || typeof payload.whyThisRecommendation !== 'string' || !payload.whyThisRecommendation.trim()) {
    errors.push("Missing or invalid 'whyThisRecommendation' (must be a non-empty string).");
  }

  // Sanitize enums
  const sanitizedCategory = canonicalizeCategory(payload.category);
  const sanitizedDifficulty = canonicalizeDifficulty(payload.difficulty);
  const sanitizedConfidence = canonicalizeConfidence(payload.confidence);

  if (!ALLOWED_CATEGORIES.includes(sanitizedCategory)) {
    errors.push(`Invalid category '${payload.category}'. Allowed: ${ALLOWED_CATEGORIES.join(', ')}`);
  }
  if (!ALLOWED_DIFFICULTIES.includes(sanitizedDifficulty)) {
    errors.push(`Invalid difficulty '${payload.difficulty}'. Allowed: ${ALLOWED_DIFFICULTIES.join(', ')}`);
  }
  if (!ALLOWED_CONFIDENCES.includes(sanitizedConfidence)) {
    errors.push(`Invalid confidence '${payload.confidence}'. Allowed: ${ALLOWED_CONFIDENCES.join(', ')}`);
  }

  const isValid = errors.length === 0;

  const sanitized = isValid
    ? {
        currentReel: String(payload.currentReel).trim(),
        interestDetected: String(payload.interestDetected).trim(),
        why: String(payload.why).trim(),
        recommendedTechReel: String(payload.recommendedTechReel).trim(),
        category: sanitizedCategory,
        whyThisRecommendation: String(payload.whyThisRecommendation).trim(),
        difficulty: sanitizedDifficulty,
        confidence: sanitizedConfidence,
      }
    : null;

  return {
    isValid,
    errors,
    sanitized,
  };
};

module.exports = {
  ALLOWED_CATEGORIES,
  ALLOWED_DIFFICULTIES,
  ALLOWED_CONFIDENCES,
  canonicalizeCategory,
  canonicalizeDifficulty,
  canonicalizeConfidence,
  validateRecommendationContract,
};
