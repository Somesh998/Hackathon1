const assert = require('assert');
const inferenceEngine = require('../services/interest/inferenceEngine');
const recommendationEngine = require('../services/recommendation/engine');

async function runTrapEvaluationTests() {
  console.log('🧪 Starting Phase 6: Built-In Trap Evaluation Test Suite...\n');
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

  // --- Test 1: Trap Case - Broad SWE Interest ---
  await test('Trap Test 1: 4 Cross-Domain Tech Signals -> DOES NOT overfit to Java, Infers Software Engineering and Technology', async () => {
    const trapEvidence = {
      totalInteractions: 4,
      strongestEvidence: [
        { reelId: 'reel_java_meme_01', title: 'Java NullPointerException in Production Meme', topics: ['java', 'debugging', 'memes'], evidenceStrength: 0.67, evidenceLevel: 'HIGH' },
        { reelId: 'reel_swe_lifestyle_02', title: 'A Realistic Day in the Life of a Remote SWE', topics: ['software-engineering', 'developer-lifestyle', 'productivity'], evidenceStrength: 0.83, evidenceLevel: 'VERY_HIGH' },
        { reelId: 'reel_coding_interview_03', title: 'FAANG Interview: Reverse Linked List in O(1)', topics: ['algorithms', 'dsa', 'leetcode'], evidenceStrength: 0.65, evidenceLevel: 'HIGH' },
        { reelId: 'reel_laptop_comparison_04', title: 'M3 Max vs RTX 4090 Dev Machine Benchmark', topics: ['hardware', 'workstations', 'docker'], evidenceStrength: 1.0, evidenceLevel: 'VERY_HIGH' },
      ],
    };

    const profile = await inferenceEngine.inferStudentInterestProfile('student_trap_test_user', {
      evidenceReport: trapEvidence,
    });

    // Verify broad inference
    assert.strictEqual(profile.primaryInterest, 'Software Engineering and Technology');
    assert.notStrictEqual(profile.primaryInterest, 'Java');
    assert.ok(profile.dominanceFactor < 0.35, 'Dominance factor should be low (< 0.35) reflecting broad breadth');

    console.log('      [Inferred Interest]:', profile.primaryInterest);
    console.log('      [Dominance Factor]:', profile.dominanceFactor);
    console.log('      [Reasoning]:', profile.reasoning);

    // Verify recommendations are diverse (NOT just Java reels)
    const recs = await recommendationEngine.recommendReelsForStudent('student_trap_test_user', { profile });
    assert.strictEqual(recs.trapDefenseActive, true, 'Trap defense should be active');
    assert.ok(recs.recommendations.length >= 4, 'Should return candidate recommendations');

    const recommendedCategories = recs.recommendations.slice(0, 4).map((r) => r.category);
    console.log('      [Top 4 Recommended Categories]:', recommendedCategories);

    // Ensure recommendations span diverse categories (Cybersecurity, Hardware, Tutorials, DSA, etc.)
    const hasDiverseCategories = new Set(recommendedCategories).size >= 3;
    assert.ok(hasDiverseCategories, 'Recommendations must span at least 3 distinct technology categories, not single-topic Java');
  });

  // --- Test 2: Dominant Specific Interest Case ---
  await test('Trap Test 2: Monolithic Java Engagement -> CORRECTLY infers Specialized Java Development as Dominant', async () => {
    const monolithicJavaEvidence = {
      totalInteractions: 5,
      strongestEvidence: [
        { reelId: 'reel_j1', title: 'Java Stream API Performance', topics: ['java', 'jvm'], evidenceStrength: 0.9, evidenceLevel: 'VERY_HIGH' },
        { reelId: 'reel_j2', title: 'Java Concurrency & Virtual Threads', topics: ['java', 'multithreading-java'], evidenceStrength: 0.95, evidenceLevel: 'VERY_HIGH' },
        { reelId: 'reel_j3', title: 'Spring Boot Microservice Best Practices', topics: ['java', 'spring-boot'], evidenceStrength: 0.88, evidenceLevel: 'VERY_HIGH' },
        { reelId: 'reel_j4', title: 'JVM Garbage Collection Tuning', topics: ['java', 'jvm', 'garbage-collection'], evidenceStrength: 0.92, evidenceLevel: 'VERY_HIGH' },
        { reelId: 'reel_j5', title: 'Java Technical Interview Questions', topics: ['java', 'backend'], evidenceStrength: 0.85, evidenceLevel: 'HIGH' },
      ],
    };

    const profile = await inferenceEngine.inferStudentInterestProfile('student_java_specialist', {
      evidenceReport: monolithicJavaEvidence,
    });

    assert.strictEqual(profile.primaryInterest, 'Specialized Java Development');
    assert.ok(profile.dominanceFactor >= 0.70, 'Dominance factor should be high (>= 0.70)');
    console.log('      [Inferred Interest]:', profile.primaryInterest);
    console.log('      [Dominance Factor]:', profile.dominanceFactor);
    console.log('      [Reasoning]:', profile.reasoning);
  });

  console.log('\n======================================================');
  console.log(`📊 Phase 6 Trap Evaluation Summary: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runTrapEvaluationTests();
