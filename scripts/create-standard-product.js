require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createProductAndPrice() {
  try {
    // Create the Standard product
    const product = await stripe.products.create({
      name: 'CloudCrew Academy Standard',
      description: 'Standard tier with full course access and hands-on labs',
      metadata: {
        tier: 'standard',
        features: 'All courses, Hands-on labs, Course certificates, Downloadable resources'
      }
    });
    
    console.log('✅ Created Standard product!');
    console.log('Product ID:', product.id);
    
    // Create the $49/month price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 4900, // $49.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      nickname: 'Standard Monthly - $49/mo',
    });
    
    console.log('✅ Created $49/month price!');
    console.log('Price ID:', price.id);
    console.log('\nAdd this to your .env.local:');
    console.log(`NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID=${price.id}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createProductAndPrice();
