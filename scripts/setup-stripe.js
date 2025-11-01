#!/usr/bin/env node

/**
 * CloudCrew Academy - Interactive Stripe Setup Helper
 * This script helps guide you through the Stripe Dashboard setup process
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupStripeConfiguration() {
  console.clear();
  colorLog('blue', '🚀 CloudCrew Academy - Interactive Stripe Setup\n');
  
  colorLog('yellow', '📋 This wizard will help you configure Stripe for CloudCrew Academy');
  colorLog('yellow', '   with our 3-tier pricing: Free ($0), Standard ($297), Premium ($597)\n');

  // Step 1: Verify Stripe account
  colorLog('bold', '1. STRIPE ACCOUNT VERIFICATION');
  colorLog('green', '   🌐 Open: https://dashboard.stripe.com');
  colorLog('green', '   ⚙️  Switch to TEST MODE (top-left toggle)');
  
  const hasAccount = await question('\n   ✅ Do you have a Stripe account in test mode? (y/n): ');
  if (hasAccount.toLowerCase() !== 'y') {
    colorLog('red', '\n   Please create a Stripe account first at https://stripe.com');
    rl.close();
    return;
  }

  // Step 2: Create products
  console.log('\n');
  colorLog('bold', '2. CREATE SUBSCRIPTION PRODUCTS');
  colorLog('yellow', '   Navigate to: https://dashboard.stripe.com/products\n');

  colorLog('blue', '   📦 STANDARD PRODUCT ($297/month)');
  console.log('   ├─ Name: CloudCrew Academy Standard');
  console.log('   ├─ Description: Full course access with hands-on labs');
  console.log('   ├─ Price: $297.00 USD');
  console.log('   └─ Billing: Monthly recurring\n');

  colorLog('blue', '   📦 PREMIUM PRODUCT ($597/month)');
  console.log('   ├─ Name: CloudCrew Academy Premium');
  console.log('   ├─ Description: Complete career transformation with mentoring');
  console.log('   ├─ Price: $597.00 USD');
  console.log('   └─ Billing: Monthly recurring\n');

  const productsCreated = await question('   ✅ Have you created both products? (y/n): ');
  if (productsCreated.toLowerCase() !== 'y') {
    colorLog('yellow', '\n   ⏸️  Please create the products first, then run this script again.');
    rl.close();
    return;
  }

  // Step 3: Get Price IDs
  console.log('\n');
  colorLog('bold', '3. CONFIGURE PRICE IDs');
  colorLog('yellow', '   Copy the Price IDs from your created products\n');

  const standardPriceId = await question('   💰 Standard Price ID (starts with price_): ');
  const premiumPriceId = await question('   💎 Premium Price ID (starts with price_): ');

  // Validate price ID format
  if (!standardPriceId.startsWith('price_') || !premiumPriceId.startsWith('price_')) {
    colorLog('red', '\n   ❌ Invalid price ID format. Price IDs should start with "price_"');
    rl.close();
    return;
  }

  // Step 4: Get API Keys
  console.log('\n');
  colorLog('bold', '4. API KEYS CONFIGURATION');
  colorLog('yellow', '   Navigate to: https://dashboard.stripe.com/apikeys\n');

  const publishableKey = await question('   🔑 Publishable Key (starts with pk_test_): ');
  const secretKey = await question('   🔐 Secret Key (starts with sk_test_): ');

  // Validate API keys
  if (!publishableKey.startsWith('pk_test_') || !secretKey.startsWith('sk_test_')) {
    colorLog('red', '\n   ❌ Invalid API key format for test mode');
    rl.close();
    return;
  }

  // Step 5: Webhook configuration
  console.log('\n');
  colorLog('bold', '5. WEBHOOK SETUP');
  colorLog('yellow', '   Navigate to: https://dashboard.stripe.com/webhooks\n');
  
  colorLog('blue', '   🔗 CREATE WEBHOOK ENDPOINT');
  console.log('   ├─ URL: http://localhost:3000/api/webhook/stripe');
  console.log('   ├─ Events: checkout.session.completed');
  console.log('   ├─       : customer.subscription.created');
  console.log('   ├─       : customer.subscription.updated');
  console.log('   ├─       : customer.subscription.deleted');
  console.log('   ├─       : invoice.payment_succeeded');
  console.log('   └─       : invoice.payment_failed\n');

  const webhookCreated = await question('   ✅ Have you created the webhook endpoint? (y/n): ');
  if (webhookCreated.toLowerCase() === 'y') {
    const webhookSecret = await question('   🔐 Webhook Signing Secret (starts with whsec_): ');
    
    if (!webhookSecret.startsWith('whsec_')) {
      colorLog('red', '\n   ❌ Invalid webhook secret format');
      rl.close();
      return;
    }

    // Step 6: Update environment file
    console.log('\n');
    colorLog('bold', '6. UPDATING ENVIRONMENT VARIABLES');
    
    const envContent = `# CloudCrew Academy Environment Variables

# API Configuration
NEXT_PUBLIC_API_URL=https://api.cloudcrew.academy
# For local development, uncomment the line below and comment the one above
# NEXT_PUBLIC_API_URL=http://localhost:3001

# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_client_id

# Stripe Configuration - UPDATED BY SETUP WIZARD
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${publishableKey}
NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID=${standardPriceId}
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=${premiumPriceId}

# Backend Stripe Configuration (for serverless deployment)
STRIPE_SECRET_KEY=${secretKey}
STRIPE_WEBHOOK_SECRET=${webhookSecret}
STRIPE_STANDARD_PRICE_ID=${standardPriceId}
STRIPE_PREMIUM_PRICE_ID=${premiumPriceId}

# AWS Cognito (Backend)
COGNITO_USER_POOL_ID=us-east-1_yourUserPoolId
COGNITO_USER_POOL_ARN=arn:aws:cognito-idp:us-east-1:123456789012:userpool/us-east-1_yourUserPoolId

# Feature Flags
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
`;

    fs.writeFileSync('.env.local', envContent);
    colorLog('green', '   ✅ Environment variables updated in .env.local');

  } else {
    colorLog('yellow', '\n   ⏸️  Please create the webhook endpoint first');
  }

  // Step 7: Summary and next steps
  console.log('\n');
  colorLog('bold', '🎉 STRIPE CONFIGURATION COMPLETE!');
  colorLog('green', '\n✅ Configuration Summary:');
  console.log(`   📦 Standard Plan: $297/month (${standardPriceId})`);
  console.log(`   💎 Premium Plan: $597/month (${premiumPriceId})`);
  console.log(`   🔑 API Keys: Configured`);
  console.log(`   🔗 Webhook: ${webhookCreated.toLowerCase() === 'y' ? 'Configured' : 'Pending'}`);

  console.log('\n');
  colorLog('bold', '🚀 NEXT STEPS:');
  console.log('1. Run validation: node scripts/validate-stripe.js');
  console.log('2. Start dev server: npm run dev');
  console.log('3. Test checkout: http://localhost:3000/pricing');
  console.log('4. Use test card: 4242 4242 4242 4242');
  console.log('5. Check webhook events in Stripe Dashboard');

  console.log('\n');
  colorLog('blue', '📚 Documentation:');
  console.log('   Setup Guide: docs/stripe-dashboard-setup.md');
  console.log('   Testing Guide: docs/stripe-setup-guide.md');

  rl.close();
}

// Error handling
process.on('uncaughtException', (error) => {
  colorLog('red', `\n❌ Error: ${error.message}`);
  rl.close();
});

process.on('SIGINT', () => {
  colorLog('yellow', '\n\n👋 Setup cancelled. Run again anytime!');
  rl.close();
});

// Run setup
setupStripeConfiguration();