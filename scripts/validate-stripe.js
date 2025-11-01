#!/usr/bin/env node

/**
 * CloudCrew Academy - Stripe Configuration Validator
 * Validates required environment variables, Stripe prices, webhooks, and basic API access.
 */

const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Missing STRIPE_SECRET_KEY in .env.local.');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

function logCheck(label, passed, message) {
  const status = passed ? '✔' : '✘';
  console.log(`  ${status} ${label}${message ? `: ${message}` : ''}`);
}

async function validateStripeConfiguration() {
  console.log('CloudCrew Academy - Stripe Configuration Validator\n');

  try {
    console.log('1. Validating API key');
    const account = await stripe.accounts.retrieve();
    logCheck('Account', true, account.display_name || account.id);
    logCheck('Mode', !account.livemode, account.livemode ? 'LIVE MODE' : 'Test mode');
    console.log();

    console.log('2. Checking environment variables');
    const requiredVars = [
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID',
    ];

    requiredVars.forEach((varName) => {
      const value = process.env[varName];
      logCheck(varName, Boolean(value), value ? value.slice(0, 12) + '…' : 'missing');
    });

    const premiumVar = 'NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID';
    if (process.env[premiumVar]) {
      logCheck(premiumVar, true, process.env[premiumVar].slice(0, 12) + '…');
    } else {
      console.log('  • Premium price not configured (skipping)');
    }
    console.log();

    console.log('3. Validating product prices');
    const standardPriceId = process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID;
    const premiumPriceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID;

    if (standardPriceId && standardPriceId !== 'price_standard_placeholder') {
      try {
        const price = await stripe.prices.retrieve(standardPriceId);
        const product = await stripe.products.retrieve(price.product);
        logCheck('Standard plan', true, `${product.name} • $${(price.unit_amount / 100).toFixed(2)} ${price.currency.toUpperCase()} (${price.recurring?.interval || 'one-time'})`);
      } catch (error) {
        logCheck('Standard plan', false, error.message);
      }
    } else {
      console.log('  • Standard plan price not configured');
    }

    if (premiumPriceId && premiumPriceId !== 'price_premium_placeholder') {
      try {
        const price = await stripe.prices.retrieve(premiumPriceId);
        const product = await stripe.products.retrieve(price.product);
        logCheck('Premium plan', true, `${product.name} • $${(price.unit_amount / 100).toFixed(2)} ${price.currency.toUpperCase()} (${price.recurring?.interval || 'one-time'})`);
      } catch (error) {
        logCheck('Premium plan', false, error.message);
      }
    } else if (premiumPriceId) {
      logCheck('Premium plan', false, 'price ID placeholder in use');
    } else {
      console.log('  • Premium plan validation skipped');
    }
    console.log();

    console.log('4. Checking webhook endpoints');
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });

    if (webhooks.data.length === 0) {
      logCheck('Webhook endpoints', false, 'none configured');
    } else {
      webhooks.data.forEach((endpoint, index) => {
        const header = `Endpoint ${index + 1}: ${endpoint.url}`;
        logCheck(header, endpoint.status === 'enabled', endpoint.status);
        const requiredEvents = [
          'checkout.session.completed',
          'customer.subscription.created',
          'customer.subscription.updated',
          'customer.subscription.deleted',
          'invoice.payment_succeeded',
          'invoice.payment_failed',
        ];
        const missing = requiredEvents.filter((event) => !endpoint.enabled_events.includes(event));
        if (missing.length > 0) {
          console.log(`    • Missing events: ${missing.join(', ')}`);
        }
      });
    }
    console.log();

    console.log('5. Testing payment intent creation');
    try {
      const intent = await stripe.paymentIntents.create({
        amount: 100,
        currency: 'usd',
        metadata: { test: 'CloudCrew Academy validation' },
      });
      logCheck('Payment intent', true, intent.id);
      await stripe.paymentIntents.cancel(intent.id);
      console.log('  • Test intent cancelled');
    } catch (error) {
      logCheck('Payment intent', false, error.message);
    }
    console.log();

    console.log('Stripe validation complete.');
    console.log('Next steps:');
    console.log('  1. Verify products in Stripe Dashboard if any checks failed.');
    console.log('  2. Create a webhook endpoint pointing to /api/webhook/stripe.');
    console.log('  3. Run npm run dev and test checkout via /pricing with Stripe test cards.');
  } catch (error) {
    console.error('Validation failed:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('Check STRIPE_SECRET_KEY and ensure it is a valid test key.');
    }
    process.exit(1);
  }
}

validateStripeConfiguration();
