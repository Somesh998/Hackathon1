/**
 * Request validation middlewares
 */

const validateReelCreation = (req, res, next) => {
  const { reelId, title, url, difficulty, technicalDepth, entertainmentLevel, educationalValue, careerValue, hypeScore } = req.body;

  const errors = [];

  if (!reelId || typeof reelId !== 'string' || !reelId.trim()) {
    errors.push('reelId is required and must be a non-empty string.');
  }

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('title is required and must be a non-empty string.');
  }

  if (!url || typeof url !== 'string' || !url.trim()) {
    errors.push('url is required and must be a valid string URL.');
  }

  if (difficulty && !['Beginner', 'Intermediate', 'Advanced', 'All Levels'].includes(difficulty)) {
    errors.push("difficulty must be one of: 'Beginner', 'Intermediate', 'Advanced', 'All Levels'.");
  }

  const scoreFields = { technicalDepth, entertainmentLevel, educationalValue, careerValue, hypeScore };
  for (const [key, value] of Object.entries(scoreFields)) {
    if (value !== undefined && (typeof value !== 'number' || value < 1 || value > 10)) {
      errors.push(`${key} must be a number between 1 and 10.`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for Reel creation.',
      errors,
    });
  }

  next();
};

const validateInteractionCreation = (req, res, next) => {
  const { userId, reelId, interactionType, completionRate, watchDuration } = req.body;

  const errors = [];
  const validTypes = ['VIEW', 'LIKE', 'SAVE', 'SHARE', 'SKIP'];

  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    errors.push('userId is required and must be a non-empty string.');
  }

  if (!reelId || typeof reelId !== 'string' || !reelId.trim()) {
    errors.push('reelId is required and must be a non-empty string.');
  }

  if (!interactionType || !validTypes.includes(interactionType)) {
    errors.push(`interactionType is required and must be one of: ${validTypes.join(', ')}.`);
  }

  if (completionRate !== undefined && (typeof completionRate !== 'number' || completionRate < 0 || completionRate > 1)) {
    errors.push('completionRate must be a number between 0.0 and 1.0.');
  }

  if (watchDuration !== undefined && (typeof watchDuration !== 'number' || watchDuration < 0)) {
    errors.push('watchDuration must be a non-negative number.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for Interaction recording.',
      errors,
    });
  }

  next();
};

module.exports = {
  validateReelCreation,
  validateInteractionCreation,
};
