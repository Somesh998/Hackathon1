const assert = require('assert');
const inferenceEngine = require('../services/interest/inferenceEngine');

async function runInferenceTests() {
  console.log('🧪 Starting Phase 5: Interest Inference Engine Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
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

  // --- Scenario 1: Java-heavy behavior ---
  await test('Scenario 1: Java-heavy behavior -> Infers Specialized Java Development', async () => {
    const mockEvidence = {
      totalInteractions: 5,
      strongestEvidence: [
        { reelId: 'reel_java_01', title: 'Java Memory Model', topics: ['java', 'jvm', 'multithreading-java'], evidenceStrength: 0.95, evidenceLevel: 'VERY_HIGH' },
        { reelId: 'reel_java_02', title: 'Spring Boot 3 Microservices', topics: ['java', 'spring-boot', 'backend'], evidenceStrength: 0.90, evidenceLevel: 'VERY_HIGH' },
        { reelId: 'reel_java_03', title: 'Java Garbage Collection Deep Dive', topics: ['java', 'jvm', 'garbage-collection'], evidenceStrength: 0.88, evidenceLevel: 'VERY_HIGH' },
        { reelId: 'reel_java_04', title: 'Hibernate N+1 Query Optimization', topics: ['java', 'hibernate', 'spring'], evidenceStrength: 0.85, evidenceLevel: 'HIGH' },
      ],
    };

    const profile = await inferenceEngine.inferStudentInterestProfile('user_java_dev', { evidenceReport: mockEvidence });

    assert.strictEqual(profile.primaryInterest, 'Specialized Java Development');
    assert.ok(profile.confidence >= 0.90, 'Confidence should be >= 0.90');
    assert.ok(profile.dominanceFactor >= 0.70, 'Dominance factor should be high');
    assert.ok(profile.reasoning.includes('Java dominance ratio'), 'Reasoning should cite dominance ratio');
    console.log('      [Inferred]:', profile.primaryInterest, `(Confidence: ${profile.confidence})`);
  });

  // --- Scenario 2: Broad software engineering behavior (The Trap Test) ---
  await test('Scenario 2: Broad software engineering behavior -> Infers Software Engineering and Technology (NOT Java)', async () => {
    const mockEvidence = {
      totalInteractions: 4,
      strongestEvidence: [
        { reelId: 'reel_java_meme_01', title: 'Java NullPointerException Meme', topics: ['java', 'jvm', 'debugging'], evidenceStrength: 0.67, evidenceLevel: 'HIGH' },
        { reelId: 'reel_swe_lifestyle_02', title: 'A Realistic Day in the Life of a Remote SWE', topics: ['software-engineering', 'developer-lifestyle', 'productivity'], evidenceStrength: 0.83, evidenceLevel: 'VERY_HIGH' },
        { reelId: 'reel_coding_interview_03', title: 'Coding Interview Joke: O(1) Space', topics: ['algorithms', 'dsa', 'leetcode'], evidenceStrength: 0.65, evidenceLevel: 'HIGH' },
        { reelId: 'reel_laptop_comparison_04', title: 'M3 Max vs ThinkPad RTX 4090 Workstation', topics: ['hardware', 'workstations', 'docker'], evidenceStrength: 1.0, evidenceLevel: 'VERY_HIGH' },
      ],
    };

    const profile = await inferenceEngine.inferStudentInterestProfile('user_broad_swe', { evidenceReport: mockEvidence });

    assert.strictEqual(profile.primaryInterest, 'Software Engineering and Technology');
    assert.notStrictEqual(profile.primaryInterest, 'Java');
    assert.notStrictEqual(profile.primaryInterest, 'Specialized Java Development');
    assert.ok(profile.confidence >= 0.88, 'Confidence should be >= 0.88');
    assert.ok(profile.supportingTopics.includes('Software Engineering') || profile.supportingTopics.includes('Programming'));
    assert.ok(profile.supportingTopics.includes('Hardware'));
    assert.ok(profile.reasoning.includes('cross-domain'), 'Reasoning should mention cross-domain synthesis');
    console.log('      [Inferred]:', profile.primaryInterest, `(Confidence: ${profile.confidence})`);
    console.log('      [Supporting Topics]:', profile.supportingTopics.join(', '));
  });

  // --- Scenario 3: Gaming-heavy behavior ---
  await test('Scenario 3: Gaming-heavy behavior -> Infers Game Development & Computer Graphics', async () => {
    const mockEvidence = {
      totalInteractions: 3,
      strongestEvidence: [
        { reelId: 'reel_ue5_01', title: 'Unreal Engine 5 Nanite Mesh Shaders', topics: ['gaming', 'game-development', 'unreal-engine', 'shaders'], evidenceStrength: 0.92, evidenceLevel: 'VERY_HIGH' },
        { reelId: 'reel_ue5_02', title: 'Real-time Ray Tracing in Vulkan', topics: ['computer-graphics', 'shaders', 'gpu', 'rendering'], evidenceStrength: 0.88, evidenceLevel: 'VERY_HIGH' },
      ],
    };

    const profile = await inferenceEngine.inferStudentInterestProfile('user_gamer', { evidenceReport: mockEvidence });

    assert.strictEqual(profile.primaryInterest, 'Game Development & Computer Graphics');
    assert.ok(profile.confidence >= 0.85);
    console.log('      [Inferred]:', profile.primaryInterest, `(Confidence: ${profile.confidence})`);
  });

  // --- Scenario 4: Mixed entertainment and technology behavior ---
  await test('Scenario 4: Mixed entertainment and technology behavior -> Infers Technology Culture & Career', async () => {
    const mockEvidence = {
      totalInteractions: 4,
      strongestEvidence: [
        { reelId: 'reel_standup_01', title: 'Standup Monday Humor', topics: ['standup', 'agile', 'memes', 'developer-lifestyle'], evidenceStrength: 0.80, evidenceLevel: 'VERY_HIGH' },
        { reelId: 'reel_jira_02', title: 'When PM moves ticket to in-progress', topics: ['career', 'productivity', 'programming-humor'], evidenceStrength: 0.75, evidenceLevel: 'HIGH' },
      ],
    };

    const profile = await inferenceEngine.inferStudentInterestProfile('user_culture', { evidenceReport: mockEvidence });

    assert.strictEqual(profile.primaryInterest, 'Technology Culture & Career');
    console.log('      [Inferred]:', profile.primaryInterest, `(Confidence: ${profile.confidence})`);
  });

  // --- Scenario 5: Weak / noisy behavior ---
  await test('Scenario 5: Weak / noisy behavior -> Withholds inference (Exploratory / Insufficient Evidence)', async () => {
    const mockEvidence = {
      totalInteractions: 2,
      strongestEvidence: [
        { reelId: 'reel_skip_01', title: 'Random Video 1', topics: ['random'], evidenceStrength: 0.10, evidenceLevel: 'NEGATIVE' },
        { reelId: 'reel_skip_02', title: 'Random Video 2', topics: ['random'], evidenceStrength: 0.05, evidenceLevel: 'NEGATIVE' },
      ],
    };

    const profile = await inferenceEngine.inferStudentInterestProfile('user_noisy', { evidenceReport: mockEvidence });

    assert.strictEqual(profile.primaryInterest, 'Exploratory / Insufficient Evidence');
    assert.ok(profile.confidence < 0.35, 'Confidence should be low (< 0.35)');
    console.log('      [Inferred]:', profile.primaryInterest, `(Confidence: ${profile.confidence})`);
  });

  console.log('\n======================================================');
  console.log(`📊 Phase 5 Inference Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runInferenceTests();
