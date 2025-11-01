#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testPaymentFlow() {
  console.log('🧪 CloudCrew Academy - Payment Flow Testing');
  console.log('==========================================\n');

  console.log('🎯 Test Environment Setup:');
  console.log('---------------------------');
  console.log(`Frontend: http://localhost:3001`);
  console.log(`Backend API: ${process.env.NEXT_PUBLIC_API_URL}`);
  console.log(`Stripe Mode: Test`);
  console.log('');

  console.log('💳 Test Payment Information:');
  console.log('-----------------------------');
  console.log('Use these Stripe test cards:');
  console.log('');
  console.log('✅ SUCCESSFUL PAYMENTS:');
  console.log('   Card: 4242 4242 4242 4242');
  console.log('   Expiry: Any future date (e.g., 12/28)');
  console.log('   CVC: Any 3 digits (e.g., 123)');
  console.log('   ZIP: Any ZIP code (e.g., 12345)');
  console.log('');
  console.log('❌ FAILED PAYMENTS (for testing error handling):');
  console.log('   Declined: 4000 0000 0000 0002');
  console.log('   Insufficient funds: 4000 0000 0000 9995');
  console.log('   Expired card: 4000 0000 0000 0069');
  console.log('');

  console.log('🔄 Test Flow Steps:');
  console.log('-------------------');
  console.log('1. 🌐 Open: http://localhost:3001/pricing');
  console.log('2. 💎 Click "Get Started" on Standard ($297) or Premium ($597)');
  console.log('3. 🔐 You\'ll be redirected to Stripe Checkout');
  console.log('4. 💳 Enter test card information');
  console.log('5. ✅ Complete the payment');
  console.log('6. 🎉 Verify success redirect');
  console.log('');

  console.log('📊 What to Check:');
  console.log('-----------------');
  console.log('✅ Pricing page displays correctly');
  console.log('✅ Standard plan shows $297/month');
  console.log('✅ Premium plan shows $597/month');
  console.log('✅ "Get Started" buttons work');
  console.log('✅ Stripe Checkout loads properly');
  console.log('✅ Payment processes successfully');
  console.log('✅ User redirected to success page');
  console.log('✅ Check Stripe Dashboard for payment');
  console.log('');

  console.log('🎯 CloudCrew Academy Pricing:');
  console.log('------------------------------');
  console.log('🆓 FREE TIER: $0');
  console.log('   • AWS Fundamentals course');
  console.log('   • Basic community access');
  console.log('   • Course certificates');
  console.log('');
  console.log('🎯 STANDARD TIER: $297/month');
  console.log('   • All Free Tier features');
  console.log('   • Serverless Development course');
  console.log('   • Hands-on labs and projects');
  console.log('   • Priority community support');
  console.log('');
  console.log('💎 PREMIUM TIER: $597/month');
  console.log('   • All Standard Tier features');
  console.log('   • Cloud Architecture course');
  console.log('   • 1-on-1 mentoring sessions');
  console.log('   • Job placement assistance');
  console.log('   • Interview preparation');
  console.log('');

  console.log('🔍 Troubleshooting:');
  console.log('-------------------');
  console.log('• If checkout doesn\'t load: Check browser console for errors');
  console.log('• If payment fails: Verify Stripe keys in .env.local');
  console.log('• If API errors: Check backend deployment status');
  console.log('• If redirect fails: Check success page exists');
  console.log('');

  console.log('📈 Success Metrics:');
  console.log('-------------------');
  console.log('✅ Payment intent created successfully');
  console.log('✅ Checkout session initiated');
  console.log('✅ User redirected to Stripe');
  console.log('✅ Payment processed');
  console.log('✅ User returned to success page');
  console.log('✅ Payment visible in Stripe Dashboard');
  console.log('');

  console.log('🚀 Ready to test! Open: http://localhost:3001/pricing');
}

testPaymentFlow();