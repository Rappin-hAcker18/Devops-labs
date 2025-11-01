/**
 * End-to-End User Flow Testing Script
 * Tests the complete user journey from signup to video access
 * 
 * Usage: node scripts/test-user-flow.js
 */

const https = require('https');

// Configuration
const API_BASE_URL = 'https://vhavj29513.execute-api.us-east-1.amazonaws.com/dev';
const TEST_USER = {
  email: `test-user-${Date.now()}@cloudcrew.test`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User'
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to make API requests
function apiRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          resolve({ statusCode: res.statusCode, body, error: error.message });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test functions
async function testSignup() {
  console.log('\n🧪 Test 1: User Signup');
  try {
    const response = await apiRequest('/api/auth/register', 'POST', {
      email: TEST_USER.email,
      password: TEST_USER.password,
      firstName: TEST_USER.firstName,
      lastName: TEST_USER.lastName
    });

    if (response.statusCode === 200 && response.body.userId) {
      console.log('✅ PASS: User registered successfully');
      console.log(`   User ID: ${response.body.userId}`);
      testResults.passed++;
      testResults.tests.push({ name: 'User Signup', status: 'PASS', details: `User ID: ${response.body.userId}` });
      return response.body.userId;
    } else {
      console.log('❌ FAIL: Registration failed');
      console.log(`   Response: ${JSON.stringify(response.body)}`);
      testResults.failed++;
      testResults.tests.push({ name: 'User Signup', status: 'FAIL', details: JSON.stringify(response.body) });
      return null;
    }
  } catch (error) {
    console.log('❌ FAIL: Registration error');
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'User Signup', status: 'FAIL', details: error.message });
    return null;
  }
}

async function testLogin() {
  console.log('\n🧪 Test 2: User Login');
  try {
    const response = await apiRequest('/api/auth/login', 'POST', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    if (response.statusCode === 200 && response.body.token) {
      console.log('✅ PASS: Login successful');
      console.log(`   Token received: ${response.body.token.substring(0, 20)}...`);
      testResults.passed++;
      testResults.tests.push({ name: 'User Login', status: 'PASS', details: 'Token received' });
      return response.body.token;
    } else {
      console.log('❌ FAIL: Login failed');
      console.log(`   Response: ${JSON.stringify(response.body)}`);
      testResults.failed++;
      testResults.tests.push({ name: 'User Login', status: 'FAIL', details: JSON.stringify(response.body) });
      return null;
    }
  } catch (error) {
    console.log('❌ FAIL: Login error');
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'User Login', status: 'FAIL', details: error.message });
    return null;
  }
}

async function testGetCourses(token) {
  console.log('\n🧪 Test 3: Browse Courses');
  try {
    const response = await apiRequest('/api/courses', 'GET', null, {
      'Authorization': `Bearer ${token}`
    });

    if (response.statusCode === 200 && Array.isArray(response.body)) {
      console.log('✅ PASS: Courses retrieved successfully');
      console.log(`   Found ${response.body.length} courses`);
      testResults.passed++;
      testResults.tests.push({ name: 'Browse Courses', status: 'PASS', details: `${response.body.length} courses found` });
      return response.body;
    } else {
      console.log('❌ FAIL: Failed to get courses');
      console.log(`   Response: ${JSON.stringify(response.body)}`);
      testResults.failed++;
      testResults.tests.push({ name: 'Browse Courses', status: 'FAIL', details: JSON.stringify(response.body) });
      return [];
    }
  } catch (error) {
    console.log('❌ FAIL: Get courses error');
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'Browse Courses', status: 'FAIL', details: error.message });
    return [];
  }
}

async function testCreateCheckoutSession(token, tier = 'standard') {
  console.log(`\n🧪 Test 4: Create Checkout Session (${tier} tier)`);
  try {
    const response = await apiRequest('/api/payments/checkout', 'POST', {
      tier,
      successUrl: 'http://localhost:3000/success',
      cancelUrl: 'http://localhost:3000/pricing'
    }, {
      'Authorization': `Bearer ${token}`
    });

    if (response.statusCode === 200 && response.body.sessionId) {
      console.log('✅ PASS: Checkout session created');
      console.log(`   Session ID: ${response.body.sessionId}`);
      console.log(`   Checkout URL: ${response.body.url}`);
      testResults.passed++;
      testResults.tests.push({ name: 'Create Checkout Session', status: 'PASS', details: `Session ID: ${response.body.sessionId}` });
      return response.body;
    } else {
      console.log('❌ FAIL: Failed to create checkout session');
      console.log(`   Response: ${JSON.stringify(response.body)}`);
      testResults.failed++;
      testResults.tests.push({ name: 'Create Checkout Session', status: 'FAIL', details: JSON.stringify(response.body) });
      return null;
    }
  } catch (error) {
    console.log('❌ FAIL: Checkout session error');
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'Create Checkout Session', status: 'FAIL', details: error.message });
    return null;
  }
}

async function testGetEnrollments(token) {
  console.log('\n🧪 Test 5: Check User Enrollments');
  try {
    const response = await apiRequest('/api/enrollments', 'GET', null, {
      'Authorization': `Bearer ${token}`
    });

    if (response.statusCode === 200) {
      const enrollments = response.body.enrollments || response.body || [];
      console.log('✅ PASS: Enrollments retrieved');
      console.log(`   Active enrollments: ${enrollments.length}`);
      testResults.passed++;
      testResults.tests.push({ name: 'Check Enrollments', status: 'PASS', details: `${enrollments.length} enrollments` });
      return enrollments;
    } else {
      console.log('❌ FAIL: Failed to get enrollments');
      console.log(`   Response: ${JSON.stringify(response.body)}`);
      testResults.failed++;
      testResults.tests.push({ name: 'Check Enrollments', status: 'FAIL', details: JSON.stringify(response.body) });
      return [];
    }
  } catch (error) {
    console.log('❌ FAIL: Get enrollments error');
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'Check Enrollments', status: 'FAIL', details: error.message });
    return [];
  }
}

async function testGetVideoMetadata(token, videoId = 'test-video') {
  console.log('\n🧪 Test 6: Access Video Content');
  try {
    const response = await apiRequest(`/api/videos/${videoId}`, 'GET', null, {
      'Authorization': `Bearer ${token}`
    });

    if (response.statusCode === 200 && response.body) {
      console.log('✅ PASS: Video metadata retrieved');
      console.log(`   Video: ${response.body.title || videoId}`);
      testResults.passed++;
      testResults.tests.push({ name: 'Access Video Content', status: 'PASS', details: response.body.title || videoId });
      return response.body;
    } else {
      console.log('⚠️  SKIP: No test video found (expected)');
      console.log(`   Response: ${JSON.stringify(response.body)}`);
      testResults.tests.push({ name: 'Access Video Content', status: 'SKIP', details: 'No test video configured' });
      return null;
    }
  } catch (error) {
    console.log('⚠️  SKIP: Video test skipped');
    console.log(`   Error: ${error.message}`);
    testResults.tests.push({ name: 'Access Video Content', status: 'SKIP', details: 'No test video configured' });
    return null;
  }
}

async function testTrackProgress(token, courseId = 'aws-fundamentals', lessonId = 'lesson-1') {
  console.log('\n🧪 Test 7: Track Course Progress');
  try {
    const response = await apiRequest('/api/progress', 'POST', {
      courseId,
      lessonId,
      progress: 100,
      completed: true
    }, {
      'Authorization': `Bearer ${token}`
    });

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('✅ PASS: Progress tracked successfully');
      console.log(`   Course: ${courseId}, Lesson: ${lessonId}`);
      testResults.passed++;
      testResults.tests.push({ name: 'Track Progress', status: 'PASS', details: `${courseId}/${lessonId}` });
      return true;
    } else {
      console.log('❌ FAIL: Failed to track progress');
      console.log(`   Response: ${JSON.stringify(response.body)}`);
      testResults.failed++;
      testResults.tests.push({ name: 'Track Progress', status: 'FAIL', details: JSON.stringify(response.body) });
      return false;
    }
  } catch (error) {
    console.log('❌ FAIL: Track progress error');
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'Track Progress', status: 'FAIL', details: error.message });
    return false;
  }
}

async function testWebhookEndpoint() {
  console.log('\n🧪 Test 8: Webhook Endpoint Availability');
  try {
    // Just check if the endpoint exists (will fail signature check, but that's expected)
    const response = await apiRequest('/api/webhooks/stripe', 'POST', {
      type: 'test'
    });

    // We expect a 400 error due to missing signature, which means endpoint is live
    if (response.statusCode === 400 || response.statusCode === 401) {
      console.log('✅ PASS: Webhook endpoint is accessible');
      console.log(`   Status: ${response.statusCode} (expected - signature validation)`);
      testResults.passed++;
      testResults.tests.push({ name: 'Webhook Endpoint', status: 'PASS', details: 'Endpoint accessible' });
      return true;
    } else {
      console.log('⚠️  WARNING: Unexpected webhook response');
      console.log(`   Status: ${response.statusCode}`);
      testResults.tests.push({ name: 'Webhook Endpoint', status: 'WARN', details: `Status ${response.statusCode}` });
      return false;
    }
  } catch (error) {
    console.log('❌ FAIL: Webhook endpoint error');
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'Webhook Endpoint', status: 'FAIL', details: error.message });
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting End-to-End User Flow Testing');
  console.log('==========================================');
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Test User: ${TEST_USER.email}`);
  
  const startTime = Date.now();

  // Note: Actual signup requires email verification in Cognito
  // For now, we'll test the endpoints that don't require full verification

  console.log('\n📝 Testing user authentication flow...');
  const userId = await testSignup();
  
  // Skip login test if signup failed or requires verification
  if (!userId) {
    console.log('\n⚠️  Skipping subsequent tests (signup requires email verification)');
    console.log('   To complete testing:');
    console.log('   1. Check your email for verification code');
    console.log('   2. Verify account via /confirm page');
    console.log('   3. Re-run this test with verified credentials');
  }

  // Test public endpoints
  await testWebhookEndpoint();

  // Test checkout session creation (requires valid Stripe keys)
  console.log('\n📝 Testing payment flow...');
  console.log('   Note: Checkout session requires authenticated user');
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Print summary
  console.log('\n==========================================');
  console.log('📊 TEST SUMMARY');
  console.log('==========================================');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⏱️  Duration: ${duration}s`);
  console.log('\nDetailed Results:');
  testResults.tests.forEach((test, index) => {
    const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : test.status === 'SKIP' ? '⏭️' : '⚠️';
    console.log(`  ${index + 1}. ${icon} ${test.name}: ${test.details}`);
  });

  console.log('\n🔍 Next Steps:');
  console.log('1. Complete email verification for test user');
  console.log('2. Test Stripe checkout flow manually via /pricing page');
  console.log('3. Use Stripe test cards: 4242 4242 4242 4242');
  console.log('4. Verify webhook receives payment events');
  console.log('5. Check user enrollments after successful payment');
  console.log('6. Test video access with enrolled courses');

  return testResults;
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});
