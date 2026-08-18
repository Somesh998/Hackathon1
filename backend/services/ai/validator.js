/**
 * AI Analysis Output Validator
 * Ensures that LLM / semantic engine responses strictly conform to the required schema
 */

const ALLOWED_DOMAINS = [
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
  'Programming',
  'DevOps',
  'Other',
];

/**
 * Validates the structured analysis JSON
 * @param {Object} data - Output from AI Analyzer
 * @returns {{ isValid: boolean, errors: string[], sanitized: Object }}
 */
const validateAIAnalysis = (data) => {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['AI response must be a non-null JSON object.'],
      sanitized: null,
    };
  }

  // 1. primaryTopic (String, required)
  if (!data.primaryTopic || typeof data.primaryTopic !== 'string' || !data.primaryTopic.trim()) {
    errors.push('primaryTopic is required and must be a non-empty string.');
  }

  // 2. secondaryTopics (Array of Strings)
  if (!Array.isArray(data.secondaryTopics)) {
    errors.push('secondaryTopics must be an array of strings.');
  }

  // 3. domain (Must be in allowed domains list)
  let domain = data.domain;
  if (!domain || typeof domain !== 'string') {
    errors.push('domain is required and must be a string.');
  } else {
    const matchedDomain = ALLOWED_DOMAINS.find(
      (d) => d.toLowerCase() === domain.trim().toLowerCase()
    );
    if (!matchedDomain) {
      domain = 'Other'; // Fallback to Other
    } else {
      domain = matchedDomain;
    }
  }

  // 4. intent (String)
  if (!data.intent || typeof data.intent !== 'string') {
    errors.push('intent is required and must be a string.');
  }

  // 5. context (String)
  if (!data.context || typeof data.context !== 'string') {
    errors.push('context is required and must be a string.');
  }

  // 6. technicalDepth (String)
  if (data.technicalDepth === undefined || data.technicalDepth === null) {
    errors.push('technicalDepth is required.');
  }

  // 7. Numeric scores (0 to 10 or 0 to 1)
  const numericFields = [
    'educationalValue',
    'careerRelevance',
    'entertainmentValue',
    'hypeScore',
    'technologyRelevance',
  ];

  for (const field of numericFields) {
    const val = Number(data[field]);
    if (isNaN(val) || val < 0 || val > 10) {
      errors.push(`${field} must be a valid number between 0 and 10.`);
    }
  }

  // 8. reasoning (String, required)
  if (!data.reasoning || typeof data.reasoning !== 'string' || !data.reasoning.trim()) {
    errors.push('reasoning is required and must explain the semantic interpretation.');
  }

  const isValid = errors.length === 0;

  const sanitized = isValid
    ? {
        primaryTopic: data.primaryTopic.trim(),
        secondaryTopics: (data.secondaryTopics || []).map((t) => String(t).trim()),
        domain,
        intent: String(data.intent).trim(),
        context: String(data.context).trim(),
        technicalDepth: String(data.technicalDepth).trim(),
        educationalValue: Number(data.educationalValue),
        careerRelevance: Number(data.careerRelevance),
        entertainmentValue: Number(data.entertainmentValue),
        hypeScore: Number(data.hypeScore),
        technologyRelevance: Number(data.technologyRelevance),
        reasoning: data.reasoning.trim(),
      }
    : null;

  return {
    isValid,
    errors,
    sanitized,
  };
};

module.exports = {
  ALLOWED_DOMAINS,
  validateAIAnalysis,
};
