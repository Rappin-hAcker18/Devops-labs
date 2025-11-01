#!/usr/bin/env node

console.log('🏗️  CloudCrew Academy - Create Stripe Products');
console.log('===============================================\n');

console.log('❌ Products not visible? Let\'s create them step by step!\n');

console.log('📋 STEP 1: Verify You\'re in Test Mode');
console.log('-------------------------------------');
console.log('1. Go to: https://dashboard.stripe.com');
console.log('2. Make sure you see "Test mode" toggle in the top right');
console.log('3. If it says "Live mode", click to switch to "Test mode"\n');

console.log('🎯 STEP 2: Create Standard Product ($297)');
console.log('-----------------------------------------');
console.log('1. Go to: https://dashboard.stripe.com/test/products');
console.log('2. Click "Add product" button');
console.log('3. Fill in the details:');
console.log('   ┌─────────────────────────────────────────────┐');
console.log('   │ Name: CloudCrew Academy Standard            │');
console.log('   │ Description: Full course access + labs      │');
console.log('   │ Price: $297.00 USD                         │');
console.log('   │ Billing: Recurring → Monthly               │');
console.log('   └─────────────────────────────────────────────┘');
console.log('4. Click "Save product"\n');

console.log('💎 STEP 3: Create Premium Product ($597)');
console.log('----------------------------------------');
console.log('1. Click "Add product" again');
console.log('2. Fill in the details:');
console.log('   ┌─────────────────────────────────────────────┐');
console.log('   │ Name: CloudCrew Academy Premium             │');
console.log('   │ Description: Everything + 1-on-1 mentoring │');
console.log('   │ Price: $597.00 USD                         │');
console.log('   │ Billing: Recurring → Monthly               │');
console.log('   └─────────────────────────────────────────────┘');
console.log('3. Click "Save product"\n');

console.log('🔍 STEP 4: Verify Products Created');
console.log('----------------------------------');
console.log('1. Go back to: https://dashboard.stripe.com/test/products');
console.log('2. You should now see 2 products listed');
console.log('3. Click on each one to get the Price IDs\n');

console.log('💡 TROUBLESHOOTING:');
console.log('-------------------');
console.log('• Make sure you\'re in TEST mode (not Live mode)');
console.log('• Try refreshing the products page');
console.log('• Check if you have the right Stripe account');
console.log('• Clear browser cache if needed\n');

console.log('🚨 Still having issues?');
console.log('Let me know and I can help you create them via API instead!');