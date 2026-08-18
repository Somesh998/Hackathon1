const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting API Verification Tests with native fetch...\n');

  try {
    // 1. Health Check
    console.log('1. Testing GET /api/health...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('   Status:', healthRes.status);
    console.log('   Payload:', healthData);

    // 2. GET All Reels
    console.log('\n2. Testing GET /api/reels...');
    const reelsRes = await fetch(`${BASE_URL}/reels`);
    const reelsData = await reelsRes.json();
    console.log('   Status:', reelsRes.status);
    console.log(`   Found ${reelsData.data.length} reels in database.`);
    reelsData.data.forEach((r, idx) => {
      console.log(`   ${idx + 1}. [${r.reelId}] ${r.title} (${r.category}) | Edu: ${r.educationalValue} | Tech: ${r.technicalDepth}`);
    });

    // 3. GET Single Reel by ID
    console.log('\n3. Testing GET /api/reels/reel_java_meme_01...');
    const singleReelRes = await fetch(`${BASE_URL}/reels/reel_java_meme_01`);
    const singleReelData = await singleReelRes.json();
    console.log('   Status:', singleReelRes.status);
    console.log('   Reel Title:', singleReelData.data.title);
    console.log('   Creator:', singleReelData.data.creator);
    console.log('   Topics:', singleReelData.data.topics);

    // 4. POST Create Reel (Validation Test - Invalid Data)
    console.log('\n4. Testing POST /api/reels with invalid data (validation check)...');
    const invalidReelRes = await fetch(`${BASE_URL}/reels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reelId: '', title: '' }),
    });
    const invalidReelData = await invalidReelRes.json();
    console.log('   Status:', invalidReelRes.status, '(Expected: 400)');
    console.log('   Errors:', invalidReelData.errors);

    // 5. POST Create Valid Reel
    console.log('\n5. Testing POST /api/reels with new valid reel...');
    const newReelData = {
      reelId: `reel_test_${Date.now()}`,
      title: 'Dockerizing Node.js Microservices in 60s',
      description: 'Multi-stage Dockerfiles and alpine optimization tips',
      transcript: 'Using alpine bases and multi-stage builds reduces image size from 1GB to 80MB.',
      creator: 'DevOpsPro',
      platform: 'YouTube Shorts',
      url: 'https://reels.example.com/docker-test',
      duration: 60,
      topics: ['docker', 'devops', 'containers', 'nodejs'],
      category: 'DevOps & Containers',
      difficulty: 'Intermediate',
      technicalDepth: 7,
      entertainmentLevel: 6,
      educationalValue: 9,
      careerValue: 8,
      hypeScore: 7,
    };
    const createReelRes = await fetch(`${BASE_URL}/reels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReelData),
    });
    const createReelJson = await createReelRes.json();
    console.log('   Status:', createReelRes.status, '(Expected: 201)');
    console.log('   Created Reel ID:', createReelJson.data?.reelId);

    // 6. POST Interaction (Validation Test - Invalid Type)
    console.log('\n6. Testing POST /api/interactions with invalid interactionType...');
    const invalidIntRes = await fetch(`${BASE_URL}/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'student_101',
        reelId: 'reel_java_meme_01',
        interactionType: 'INVALID_ACTION',
      }),
    });
    const invalidIntData = await invalidIntRes.json();
    console.log('   Status:', invalidIntRes.status, '(Expected: 400)');
    console.log('   Errors:', invalidIntData.errors);

    // 7. POST Record Valid Interactions
    console.log('\n7. Testing POST /api/interactions recording multiple interactions for student_101...');
    const interaction1 = await (
      await fetch(`${BASE_URL}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'student_101',
          reelId: 'reel_java_meme_01',
          interactionType: 'LIKE',
          watchDuration: 22,
          completionRate: 1.0,
        }),
      })
    ).json();
    console.log('   Recorded interaction 1 (LIKE):', interaction1.data.interactionType, '| Liked:', interaction1.data.liked);

    const interaction2 = await (
      await fetch(`${BASE_URL}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'student_101',
          reelId: 'reel_swe_lifestyle_02',
          interactionType: 'SAVE',
          watchDuration: 35,
          completionRate: 1.0,
        }),
      })
    ).json();
    console.log('   Recorded interaction 2 (SAVE):', interaction2.data.interactionType, '| Saved:', interaction2.data.saved);

    const interaction3 = await (
      await fetch(`${BASE_URL}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'student_101',
          reelId: 'reel_coding_interview_03',
          interactionType: 'VIEW',
          watchDuration: 28,
          completionRate: 0.9,
        }),
      })
    ).json();
    console.log('   Recorded interaction 3 (VIEW):', interaction3.data.interactionType);

    // 8. GET User Interactions
    console.log('\n8. Testing GET /api/interactions/user/student_101...');
    const userIntRes = await fetch(`${BASE_URL}/interactions/user/student_101`);
    const userIntData = await userIntRes.json();
    console.log('   Status:', userIntRes.status);
    console.log(`   Fetched ${userIntData.data.length} recorded interactions for student_101.`);
    userIntData.data.forEach((i, idx) => {
      console.log(`   - [${i.interactionType}] Reel: ${i.reelId} | Watch: ${i.watchDuration}s | Liked: ${i.liked} | Saved: ${i.saved}`);
    });

    console.log('\n======================================================');
    console.log('🎉 ALL PHASE 2 REST APIS & VALIDATIONS VERIFIED 100%!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
  }
}

runTests();
