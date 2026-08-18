const assert = require('assert');
const scoringService = require('../services/interest/scoringService');
const inferenceEngine = require('../services/interest/inferenceEngine');
const recommendationEngine = require('../services/recommendation/engine');
const { ALLOWED_CATEGORIES } = require('../services/recommendation/contractValidator');

async function runEndToEndTrapTest() {
  console.log('🧪 Starting Phase 10: Complete End-to-End Integration & Trap Test...\n');

  const userId = 'e2e_student_trap_tester';

  // Step 1 & 2: Simulate 4 Student Interactions on the Trap Set
  const interactions = [
    {
      userId,
      reelId: 'reel_java_meme_01',
      title: 'When NullPointerException hits in production at 5 PM on Friday',
      interactionType: 'LIKE',
      watchDuration: 22,
      completionRate: 1.0,
      liked: true,
      category: 'Software Engineering Culture',
      topics: ['java', 'debugging', 'memes'],
    },
    {
      userId,
      reelId: 'reel_swe_lifestyle_02',
      title: 'A Realistic Day in the Life of a Remote Software Engineer',
      interactionType: 'SAVE',
      watchDuration: 35,
      completionRate: 1.0,
      saved: true,
      category: 'Career & Lifestyle',
      topics: ['software-engineering', 'developer-lifestyle', 'productivity'],
    },
    {
      userId,
      reelId: 'reel_coding_interview_03',
      title: 'FAANG Interview: Reverse Linked List in O(1) Space',
      interactionType: 'LIKE',
      watchDuration: 28,
      completionRate: 0.95,
      liked: true,
      category: 'Interview & Algorithms',
      topics: ['algorithms', 'dsa', 'leetcode'],
    },
    {
      userId,
      reelId: 'reel_laptop_comparison_04',
      title: 'M3 Max MacBook Pro vs ThinkPad RTX 4090 Workstation Benchmark',
      interactionType: 'SHARE',
      watchDuration: 48,
      completionRate: 1.0,
      liked: true,
      saved: true,
      shared: true,
      category: 'Hardware & Engineering Setup',
      topics: ['hardware', 'workstations', 'docker'],
    },
  ];

  console.log('1. Ingested 4 Student Interactions:');
  interactions.forEach((i, idx) => console.log(`   ${idx + 1}. [${i.interactionType}] ${i.title}`));

  // Step 3 & 4: Behavioral Telemetry Evidence Scoring
  const evidenceReport = {
    userId,
    totalInteractions: 4,
    strongestEvidence: interactions.map((item) => {
      const metrics = scoringService.calculateInterestEvidenceStrength([item], item);
      return {
        reelId: item.reelId,
        title: item.title,
        category: item.category,
        topics: item.topics,
        evidenceStrength: metrics.evidenceStrength,
        evidenceLevel: metrics.evidenceLevel,
      };
    }),
  };

  console.log('\n2. Computed Behavioral Evidence Strengths:');
  evidenceReport.strongestEvidence.forEach((e) => {
    console.log(`   - ${e.title} -> ${e.evidenceLevel} (${e.evidenceStrength})`);
  });

  // Step 5 & 6: Interest Inference Engine Execution
  const profile = await inferenceEngine.inferStudentInterestProfile(userId, { evidenceReport });

  console.log('\n3. Inferred Interest Profile:');
  console.log('   Primary Interest:', profile.primaryInterest);
  console.log('   Confidence:', profile.confidence);
  console.log('   Dominance Factor:', profile.dominanceFactor);
  console.log('   Supporting Topics:', profile.supportingTopics.join(', '));
  console.log('   Reasoning:', profile.reasoning);

  // Assertions on Inference
  assert.strictEqual(profile.primaryInterest, 'Software Engineering and Technology');
  assert.notStrictEqual(profile.primaryInterest, 'Java');
  assert.ok(profile.dominanceFactor < 0.35, 'Dominance factor must be low (< 0.35)');

  // Step 7, 8, 9 & 10: 10-Factor Candidate Recommendation & Hype Filtering
  const recommendation = await recommendationEngine.generateContractRecommendation(userId, { profile });

  console.log('\n4. Generated Contract-Compliant Recommendation:');
  console.log('   Current Reel:', recommendation.currentReel);
  console.log('   Interest Detected:', recommendation.interestDetected);
  console.log('   Recommended Tech Reel:', recommendation.recommendedTechReel);
  console.log('   Category:', recommendation.category);
  console.log('   Why This Recommendation:', recommendation.whyThisRecommendation);
  console.log('   Difficulty:', recommendation.difficulty);
  console.log('   Confidence:', recommendation.confidence);

  // Step 11: Schema Contract Assertions
  assert.ok(recommendation.currentReel.length > 5);
  assert.strictEqual(recommendation.interestDetected, 'Software Engineering and Technology');
  assert.ok(recommendation.why.length > 20);
  assert.ok(recommendation.recommendedTechReel.length > 5);
  assert.ok(ALLOWED_CATEGORIES.includes(recommendation.category));
  assert.ok(['Beginner', 'Intermediate', 'Advanced'].includes(recommendation.difficulty));
  assert.ok(['High', 'Medium', 'Low'].includes(recommendation.confidence));

  // TRAP VERIFICATION: Recommended reel must NOT be the same repetitive Java meme
  assert.notStrictEqual(recommendation.recommendedTechReel, 'When NullPointerException hits in production at 5 PM on Friday');
  console.log('\n✅ TRAP DEFENSE VERIFIED: System avoided single-topic Java spam and surfaced high-value technology content!\n');

  console.log('======================================================');
  console.log('🎉 12-STEP END-TO-END INTEGRATION TEST PASSED 100%!');
  console.log('======================================================\n');
}

runEndToEndTrapTest();
