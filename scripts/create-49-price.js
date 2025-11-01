require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createPrice() {
  try {
    const price = await stripe.prices.create({
      product: 'prod_TI9F9M0ivz8IBJ', // Standard product
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

createPrice();
