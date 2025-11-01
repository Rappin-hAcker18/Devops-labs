require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createProductAndPrice() {
  try {
    // Create the product
    const product = await stripe.products.create({
      name: 'CloudCrew Academy Premium',
      description: 'Premium tier with 1-on-1 mentoring, career services, and certification',
      metadata: {
        tier: 'premium',
        features: 'All courses, Live mentoring, Career services, Priority support, Certification prep'
      }
    });
    
    console.log('✅ Created Premium product!');
    console.log('Product ID:', product.id);
    
    // Create the $149/month price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 14900, // $149.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      nickname: 'Premium Monthly - $149/mo',
    });
    
    console.log('✅ Created $149/month price!');
    console.log('Price ID:', price.id);
    console.log('\nAdd this to your .env.local:');
    console.log(`NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=${price.id}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createProductAndPrice();
