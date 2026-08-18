const assert = require('assert');
const { runCompleteEvaluation } = require('../services/evaluation/evaluationFramework');

async function runEvaluationTests() {
  console.log('🧪 Starting Phase 11: 10-Persona Benchmark & Evaluation Test Suite...\n');

  const report = await runCompleteEvaluation();

  console.log(`Evaluated ${report.totalScenarios} Distinct Student Interaction Scenarios:\n`);
  report.comparisons.forEach((c, idx) => {
    console.log(`${idx + 1}. [${c.personaName}]`);
    console.log(`   - Baseline Inferred: ${c.baseline.inferredInterest} | Category: ${c.baseline.recommendedCategory}`);
    console.log(`   - AI Agent Inferred: ${c.aiSystem.inferredInterest} | Category: ${c.aiSystem.recommendedCategory} (Confidence: ${c.aiSystem.confidence})`);
    if (c.isTrapCase) {
      console.log(`   - 🛡️ TRAP CASE RESULT: Baseline = ${c.baseline.trapAvoided ? 'PASS' : 'FAIL (Overfit)'} | AI Agent = ${c.aiSystem.trapAvoided ? 'PASS (Protected)' : 'FAIL'}`);
    }
  });

  console.log('\n--- 📊 Executive Metrics Summary ---');
  console.log('Interest Inference Accuracy:', report.summaryMetrics.interestInferenceAccuracy);
  console.log('Recommendation Relevance:   ', report.summaryMetrics.recommendationRelevance);
  console.log('Category Diversity Score:   ', report.summaryMetrics.categoryDiversity);
  console.log('Hype Rejection Rate:        ', report.summaryMetrics.hypeRejectionRate);
  console.log('Trap Defense Success:       ', report.summaryMetrics.trapDefenseSuccess);
  console.log('-------------------------------------\n');

  // Assertions
  assert.strictEqual(report.totalScenarios, 10, 'Must evaluate 10 personas');
  const trapCase = report.comparisons.find((c) => c.isTrapCase);
  assert.strictEqual(trapCase.aiSystem.trapAvoided, true, 'AI Agent must avoid the Java trap');
  assert.strictEqual(trapCase.baseline.trapAvoided, false, 'Baseline must fall for the Java trap');

  console.log('======================================================');
  console.log('🎉 PHASE 11 EVALUATION BENCHMARK VERIFIED 100%!');
  console.log('======================================================\n');
}

runEvaluationTests();
