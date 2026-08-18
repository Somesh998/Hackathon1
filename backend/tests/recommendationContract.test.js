const assert = require('assert');
const {
  validateRecommendationContract,
  canonicalizeCategory,
  canonicalizeDifficulty,
  canonicalizeConfidence,
  ALLOWED_CATEGORIES,
} = require('../services/recommendation/contractValidator');
const recommendationEngine = require('../services/recommendation/engine');

async function runContractTests() {
  console.log('🧪 Starting Phase 7 & 8: Recommendation Contract & Validation Tests...\n');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // --- 1. Contract Field Completeness & Enums ---
  test('validateRecommendationContract should accept full 8 conceptual fields with valid enums', () => {
    const samplePayload = {
      currentReel: 'When NullPointerException hits in production at 5 PM on Friday',
      interestDetected: 'Software Engineering and Technology',
      why: 'Student showed high engagement with programming culture and developer hardware.',
      recommendedTechReel: 'How SQL Injection Works (and How Parameterized Queries Prevent It)',
      category: 'Cybersecurity',
      whyThisRecommendation: 'High educational value (10/10) covering database defense in production.',
      difficulty: 'Intermediate',
      confidence: 'High',
    };

    const result = validateRecommendationContract(samplePayload);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.sanitized.category, 'Cybersecurity');
    assert.strictEqual(result.sanitized.difficulty, 'Intermediate');
    assert.strictEqual(result.sanitized.confidence, 'High');
  });

  test('canonicalizeCategory should safely map variations to allowed categories', () => {
    assert.strictEqual(canonicalizeCategory('Cybersecurity & AppSec'), 'Cybersecurity');
    assert.strictEqual(canonicalizeCategory('Machine Learning & AI'), 'AI');
    assert.strictEqual(canonicalizeCategory('Algorithms & LeetCode'), 'DSA');
    assert.strictEqual(canonicalizeCategory('Distributed System Design'), 'HLD');
  });

  test('canonicalizeDifficulty should normalize to Beginner, Intermediate, or Advanced', () => {
    assert.strictEqual(canonicalizeDifficulty('All Levels'), 'Beginner');
    assert.strictEqual(canonicalizeDifficulty('Expert Level Deep Code'), 'Advanced');
    assert.strictEqual(canonicalizeDifficulty('Intermediate'), 'Intermediate');
  });

  test('validateRecommendationContract should reject payloads with missing fields', () => {
    const brokenPayload = {
      currentReel: 'Some title',
      // missing interestDetected, why, etc.
    };

    const result = validateRecommendationContract(brokenPayload);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.length >= 3);
  });

  // --- 2. Live Engine Output Contract Compliance ---
  await asyncTest('recommendationEngine.generateContractRecommendation should output compliant contract', async () => {
    const mockProfile = {
      primaryInterest: 'Software Engineering and Technology',
      confidence: 0.91,
      dominanceFactor: 0.22,
      supportingTopics: ['Programming', 'Software Engineering', 'Hardware'],
      reasoning: 'Synthesized across multiple engineering lifestyle and hardware signals.',
    };

    const contractResult = await recommendationEngine.generateContractRecommendation('user_contract_test', {
      profile: mockProfile,
    });

    assert.ok(contractResult.currentReel, 'Must have currentReel');
    assert.ok(contractResult.interestDetected, 'Must have interestDetected');
    assert.ok(contractResult.why, 'Must have why');
    assert.ok(contractResult.recommendedTechReel, 'Must have recommendedTechReel');
    assert.ok(ALLOWED_CATEGORIES.includes(contractResult.category), `Category ${contractResult.category} must be in allowed list`);
    assert.ok(contractResult.whyThisRecommendation, 'Must have whyThisRecommendation');
    assert.ok(['Beginner', 'Intermediate', 'Advanced'].includes(contractResult.difficulty));
    assert.ok(['High', 'Medium', 'Low'].includes(contractResult.confidence));

    console.log('      [Current Reel]:', contractResult.currentReel);
    console.log('      [Interest Detected]:', contractResult.interestDetected);
    console.log('      [Recommended Reel]:', contractResult.recommendedTechReel);
    console.log('      [Category]:', contractResult.category);
    console.log('      [Difficulty]:', contractResult.difficulty);
    console.log('      [Confidence]:', contractResult.confidence);
  });

  console.log('\n======================================================');
  console.log(`📊 Phase 7 & 8 Contract Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runContractTests();
