const assert = require('assert');
const { calculateEngagementScore, calculateInterestEvidenceStrength, WEIGHTS } = require('../services/interest/scoringService');
const aiService = require('../services/ai');
const { validateAIAnalysis, ALLOWED_DOMAINS } = require('../services/ai/validator');

async function runUnitTests() {
  console.log('🧪 Starting Phase 3 & 4 Unit Tests...\n');
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

  // --- 1. Behavioral Scoring Formula Tests ---
  console.log('--- Suite 1: Behavioral Scoring Engine (Phase 3) ---');

  test('Weight Constants should match specification', () => {
    assert.strictEqual(WEIGHTS.VIEW, 1);
    assert.strictEqual(WEIGHTS.HIGH_COMPLETION, 2);
    assert.strictEqual(WEIGHTS.LIKE, 3);
    assert.strictEqual(WEIGHTS.SAVE, 4);
    assert.strictEqual(WEIGHTS.SHARE, 5);
    assert.strictEqual(WEIGHTS.SKIP, -2);
  });

  test('Skip interaction should produce normalized score 0.0', () => {
    const score = calculateEngagementScore({
      interactionType: 'SKIP',
      watchDuration: 2,
      completionRate: 0.05,
      skipped: true,
    });
    assert.strictEqual(score, 0);
  });

  test('High completion + Liked + Saved + Shared should produce high normalized score >= 0.8', () => {
    const score = calculateEngagementScore({
      interactionType: 'SHARE',
      watchDuration: 45,
      completionRate: 1.0,
      liked: true,
      saved: true,
      shared: true,
    });
    assert.ok(score >= 0.8 && score <= 1.0, `Score ${score} should be between 0.8 and 1.0`);
  });

  test('calculateInterestEvidenceStrength should account for repeat views & active curation', () => {
    const interactions = [
      { interactionType: 'VIEW', completionRate: 0.95, liked: true },
      { interactionType: 'SAVE', completionRate: 1.0, saved: true },
    ];
    const evidence = calculateInterestEvidenceStrength(interactions, { reelId: 'reel_001' });
    assert.ok(evidence.evidenceStrength > 0.5, 'Multi-interaction with Save should have high strength');
    assert.strictEqual(evidence.saves, 1);
    assert.strictEqual(evidence.likes, 1);
    assert.strictEqual(evidence.viewCount, 2);
  });

  // --- 2. AI Output Validation Tests ---
  console.log('\n--- Suite 2: AI Output Schema Validation (Phase 4) ---');

  test('validateAIAnalysis should accept valid conformant payload', () => {
    const sampleValid = {
      primaryTopic: 'Software Engineer Workplace Dynamics',
      secondaryTopics: ['Remote Work', 'Agile Standup Workflows'],
      domain: 'Career',
      intent: 'Workplace Relatability',
      context: 'Daily Agile Standup',
      technicalDepth: 'Beginner / Conceptual',
      educationalValue: 6,
      careerRelevance: 8,
      entertainmentValue: 8,
      hypeScore: 7,
      technologyRelevance: 7,
      reasoning: 'Interpreted as Developer Career and Workplace dynamics rather than raw programming.',
    };

    const result = validateAIAnalysis(sampleValid);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.sanitized.domain, 'Career');
  });

  test('validateAIAnalysis should reject payload with missing reasoning or out-of-bound scores', () => {
    const sampleInvalid = {
      primaryTopic: 'Test Topic',
      domain: 'AI',
      educationalValue: 15, // Out of bounds
      // missing reasoning
    };

    const result = validateAIAnalysis(sampleInvalid);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.length > 0);
  });

  // --- 3. Semantic Understanding vs Keyword Matching Tests ---
  console.log('\n--- Suite 3: Semantic Understanding vs Keyword Matching (Phase 4) ---');

  await asyncTest('AI Analyzer: "Java developer struggles during Monday morning standup" -> Understood as Career / Workplace Context', async () => {
    const fictionalReel = {
      title: 'Java developer struggles during Monday morning standup',
      description: 'POV: You did not finish your sprint ticket before the weekend and now you have to explain it. #codinghumor #standup',
      transcript: 'Standup starts in 2 minutes. What did I do yesterday? What will I do today? Blockers: everything.',
      topics: ['java', 'standup', 'developer-memes', 'agile'],
    };

    const analysis = await aiService.analyzeReel(fictionalReel);

    assert.ok(analysis.domain === 'Career' || analysis.domain === 'Programming', `Expected Career or Programming domain, got: ${analysis.domain}`);
    assert.ok(analysis.context.toLowerCase().includes('standup') || analysis.context.toLowerCase().includes('agile') || analysis.context.toLowerCase().includes('workplace'), 'Should capture Standup/Agile context');
    assert.ok(analysis.reasoning.length > 20, 'Should provide thorough reasoning');
    console.log('      [Inferred Domain]:', analysis.domain);
    console.log('      [Inferred Context]:', analysis.context);
    console.log('      [Primary Topic]:', analysis.primaryTopic);
    console.log('      [Reasoning]:', analysis.reasoning);
  });

  await asyncTest('AI Analyzer: "5 laptops every programmer should buy" -> Understood as Hardware & Productivity (Not just coding)', async () => {
    const fictionalReel = {
      title: '5 laptops every programmer should buy in 2025',
      description: 'Top picks for web dev, mobile dev, local AI inference, and Linux compatibility.',
      transcript: 'We compare RAM, battery efficiency, thermals under heavy Docker workloads, and local LLM performance across M3, ThinkPad, and Framework laptops.',
      topics: ['laptops', 'programming', 'macbook', 'hardware', 'dev-setup'],
    };

    const analysis = await aiService.analyzeReel(fictionalReel);

    assert.strictEqual(analysis.domain, 'Hardware', `Expected Hardware domain, got: ${analysis.domain}`);
    assert.ok(analysis.primaryTopic.toLowerCase().includes('workstation') || analysis.primaryTopic.toLowerCase().includes('hardware'), 'Primary topic should reflect hardware/workstations');
    console.log('      [Inferred Domain]:', analysis.domain);
    console.log('      [Primary Topic]:', analysis.primaryTopic);
    console.log('      [Intent]:', analysis.intent);
    console.log('      [Reasoning]:', analysis.reasoning);
  });

  console.log('\n======================================================');
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runUnitTests();
