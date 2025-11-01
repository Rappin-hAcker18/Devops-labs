#!/usr/bin/env node

console.log('🎯 CloudCrew Academy - Stripe Configuration Helper');
console.log('==================================================\n');

console.log('✅ You\'ve successfully created both products in Stripe Dashboard!');
console.log('\nNext steps to complete your Stripe setup:\n');

console.log('📋 STEP 1: Get Your Price IDs');
console.log('-----------------------------');
console.log('1. Go to https://dashboard.stripe.com/test/products');
console.log('2. Click on "CloudCrew Academy Standard" product');
console.log('3. Copy the Price ID (starts with price_)');
console.log('4. Click on "CloudCrew Academy Premium" product'); 
console.log('5. Copy the Price ID (starts with price_)\n');

console.log('🔑 STEP 2: Get Your API Keys');
console.log('----------------------------');
console.log('1. Go to https://dashboard.stripe.com/test/apikeys');
console.log('2. Copy your Publishable key (pk_test_...)');
console.log('3. Copy your Secret key (sk_test_...)\n');

console.log('📝 STEP 3: Update Your .env.local File');
console.log('--------------------------------------');
console.log('Add these lines to your .env.local file:\n');

console.log('# Stripe Keys');
console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key');
console.log('STRIPE_SECRET_KEY=sk_test_your_actual_secret_key');
console.log('');
console.log('# Price IDs');
console.log('NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID=price_your_standard_price_id');
console.log('NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id');
console.log('');
console.log('# Webhook Secret (get this after setting up webhooks)');
console.log('STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret\n');

console.log('🔗 STEP 4: Set Up Webhooks');
console.log('--------------------------');
console.log('1. Go to https://dashboard.stripe.com/test/webhooks');
console.log('2. Click "Add endpoint"');
console.log('3. URL: https://vhavj29513.execute-api.us-east-1.amazonaws.com/dev/api/webhook/stripe');
console.log('4. Select these events:');
console.log('   - checkout.session.completed');
console.log('   - customer.subscription.created');
console.log('   - customer.subscription.updated'); 
console.log('   - customer.subscription.deleted');
console.log('   - invoice.payment_succeeded');
console.log('   - invoice.payment_failed');
console.log('5. Copy the webhook signing secret\n');

console.log('✅ STEP 5: Validate Configuration');
console.log('---------------------------------');
console.log('After adding all credentials, run:');
console.log('npm run stripe:validate\n');

console.log('🚀 Ready to test payments with CloudCrew Academy!');
console.log('Pricing: Free ($0) | Standard ($297) | Premium ($597)');