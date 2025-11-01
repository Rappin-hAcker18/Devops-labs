require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function listProducts() {
  try {
    const products = await stripe.products.list({ limit: 10 });
    
    console.log('\n🎯 Your Stripe Products:\n');
    for (const product of products.data) {
      console.log(`📦 ${product.name}`);
      console.log(`   Product ID: ${product.id}`);
      
      // Get prices for this product
      const prices = await stripe.prices.list({ product: product.id });
      if (prices.data.length > 0) {
        console.log('   Prices:');
        prices.data.forEach(price => {
          const amount = price.unit_amount / 100;
          const interval = price.recurring ? `/${price.recurring.interval}` : ' (one-time)';
          console.log(`     - $${amount}${interval} (${price.id})`);
        });
      }
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listProducts();
