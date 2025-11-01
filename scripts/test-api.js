#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testStripeAPI() {
  console.log('🧪 Testing Stripe API Integration...\n');

  try {
    // Test 1: Create checkout session for Standard plan
    console.log('1️⃣ Testing Standard Plan Checkout Session Creation...');
    const standardResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token', // In real app, this would be a real JWT
      },
      body: JSON.stringify({
        planId: 'standard'
      }),
    });

    if (standardResponse.ok) {
      const standardData = await standardResponse.json();
      console.log('✅ Standard checkout session created successfully');
      console.log(`   Session ID: ${standardData.sessionId || 'N/A'}`);
      console.log(`   URL: ${standardData.url ? 'Generated' : 'Missing'}\n`);
    } else {
      const errorData = await standardResponse.json();
      console.log('❌ Standard checkout failed:', errorData.error);
      console.log('   Status:', standardResponse.status, '\n');
    }

    // Test 2: Create checkout session for Premium plan
    console.log('2️⃣ Testing Premium Plan Checkout Session Creation...');
    const premiumResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({
        planId: 'premium'
      }),
    });

    if (premiumResponse.ok) {
      const premiumData = await premiumResponse.json();
      console.log('✅ Premium checkout session created successfully');
      console.log(`   Session ID: ${premiumData.sessionId || 'N/A'}`);
      console.log(`   URL: ${premiumData.url ? 'Generated' : 'Missing'}\n`);
    } else {
      const errorData = await premiumResponse.json();
      console.log('❌ Premium checkout failed:', errorData.error);
      console.log('   Status:', premiumResponse.status, '\n');
    }

    // Test 3: Test invalid plan
    console.log('3️⃣ Testing Invalid Plan (should fail)...');
    const invalidResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({
        planId: 'invalid'
      }),
    });

    if (!invalidResponse.ok) {
      console.log('✅ Invalid plan correctly rejected');
      console.log('   Status:', invalidResponse.status, '\n');
    } else {
      console.log('❌ Invalid plan should have been rejected\n');
    }

  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }

  console.log('🎯 Manual Testing Instructions:');
  console.log('-------------------------------');
  console.log('1. Open: http://localhost:3001/pricing');
  console.log('2. Click "Get Started" on any paid plan');
  console.log('3. Use test card: 4242 4242 4242 4242');
  console.log('4. Complete payment and verify success');
  console.log('5. Check Stripe Dashboard for payment record\n');
}

testStripeAPI();