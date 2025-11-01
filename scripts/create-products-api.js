#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createCloudCrewProducts() {
  console.log('🚀 Creating CloudCrew Academy products via Stripe API...\n');

  try {
    // Create Standard Product
    console.log('📦 Creating Standard product...');
    const standardProduct = await stripe.products.create({
      name: 'CloudCrew Academy Standard',
      description: 'Full course access with hands-on labs and priority support',
      metadata: {
        tier: 'standard',
        features: 'aws-fundamentals,serverless-development,labs,support'
      }
    });

    const standardPrice = await stripe.prices.create({
      product: standardProduct.id,
      unit_amount: 29700, // $297.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        tier: 'standard'
      }
    });

    console.log('✅ Standard Product Created:');
    console.log(`   Product ID: ${standardProduct.id}`);
    console.log(`   Price ID: ${standardPrice.id}`);
    console.log(`   Amount: $${standardPrice.unit_amount / 100}\n`);

    // Create Premium Product
    console.log('💎 Creating Premium product...');
    const premiumProduct = await stripe.products.create({
      name: 'CloudCrew Academy Premium',
      description: 'Everything in Standard plus 1-on-1 mentoring and career services',
      metadata: {
        tier: 'premium',
        features: 'all-courses,mentoring,career-services,priority-support'
      }
    });

    const premiumPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 59700, // $597.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        tier: 'premium'
      }
    });

    console.log('✅ Premium Product Created:');
    console.log(`   Product ID: ${premiumProduct.id}`);
    console.log(`   Price ID: ${premiumPrice.id}`);
    console.log(`   Amount: $${premiumPrice.unit_amount / 100}\n`);

    console.log('🎯 CONFIGURATION FOR .env.local:');
    console.log('================================');
    console.log(`NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID=${standardPrice.id}`);
    console.log(`NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=${premiumPrice.id}`);

  } catch (error) {
    console.error('❌ Error creating products:', error.message);
    console.log('\n💡 Make sure you have STRIPE_SECRET_KEY in your .env.local file');
  }
}

if (!process.env.STRIPE_SECRET_KEY) {
  console.log('❌ Missing STRIPE_SECRET_KEY environment variable');
  console.log('Add your Stripe secret key to .env.local first:');
  console.log('STRIPE_SECRET_KEY=sk_test_your_actual_secret_key');
} else {
  createCloudCrewProducts();
}