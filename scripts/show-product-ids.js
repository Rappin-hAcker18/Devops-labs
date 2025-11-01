#!/usr/bin/env node

console.log('🔍 CloudCrew Academy - Stripe Product ID Finder');
console.log('===============================================\n');

console.log('📋 How to Find Your Product IDs in Stripe Dashboard:');
console.log('----------------------------------------------------\n');

console.log('1. 🌐 Go to: https://dashboard.stripe.com/test/products\n');

console.log('2. 📦 You should see your CloudCrew Academy products:\n');

console.log('   ┌─────────────────────────────────────────┐');
console.log('   │ 🎯 CloudCrew Academy Standard - $297    │');
console.log('   │    Product ID: prod_XXXXXXXXXX          │');
console.log('   │    Price ID: price_XXXXXXXXXX           │');
console.log('   └─────────────────────────────────────────┘');
console.log('');
console.log('   ┌─────────────────────────────────────────┐');
console.log('   │ 💎 CloudCrew Academy Premium - $597     │');
console.log('   │    Product ID: prod_YYYYYYYYYY          │');
console.log('   │    Price ID: price_YYYYYYYYYY           │');
console.log('   └─────────────────────────────────────────┘\n');

console.log('3. 📝 To get the exact IDs:');
console.log('   - Click on each product');
console.log('   - The Product ID will be in the URL: .../products/prod_XXXXXXXXXX');
console.log('   - The Price ID will be shown in the pricing section\n');

console.log('4. 📋 Copy these IDs:');
console.log('   Standard Product ID: prod_____________');
console.log('   Standard Price ID:   price___________');
console.log('   Premium Product ID:  prod_____________');
console.log('   Premium Price ID:    price___________\n');

console.log('💡 Need the Price IDs? Those are what we use in the code!');
console.log('   The Price IDs (starting with "price_") are what you need for:');
console.log('   - NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID');
console.log('   - NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID\n');

console.log('🔧 Once you have them, update your .env.local file or let me know!');