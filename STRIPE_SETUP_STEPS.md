# 🎯 CloudCrew Academy Stripe Setup - Step by Step

## ✅ Step 1: Products Created (DONE!)
You've successfully created both products in Stripe Dashboard. Great job! 

## 📋 Step 2: Get Your Price IDs

### In your Stripe Dashboard:

1. **Navigate to Products**:
   - Go to https://dashboard.stripe.com/test/products
   - You should see your two CloudCrew Academy products

2. **Copy Price IDs**:
   
   **For "CloudCrew Academy Standard" ($297):**
   - Click on the Standard product
   - Copy the Price ID (starts with `price_`)
   - It should look like: `price_1A2B3C4D5E6F7G8H`

   **For "CloudCrew Academy Premium" ($597):**
   - Click on the Premium product  
   - Copy the Price ID (starts with `price_`)
   - It should look like: `price_9I8H7G6F5E4D3C2B`

## 🔧 Step 3: Update Environment Variables

### Add to your `.env.local` file:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key

# Price IDs (replace with your actual Price IDs)
NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID=price_your_standard_price_id
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id
```

### Get your Stripe Keys:
1. In Stripe Dashboard, go to **Developers → API Keys**
2. Copy your **Publishable key** (pk_test_...)
3. Copy your **Secret key** (sk_test_...)

## 🎯 Step 4: Test the Configuration

After adding your keys and Price IDs, run:
```bash
npm run stripe:validate
```

This will verify your Stripe configuration is working correctly.

## 📝 Step 5: Update Backend Environment

Add the same environment variables to your backend deployment:
```bash
cd backend
# Add to serverless environment or .env file
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_STANDARD_PRICE_ID=price_your_standard_price_id  
STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id
```

## 🔗 Step 6: Set Up Webhooks

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://your-api-gateway-url.com/dev/api/webhook/stripe`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created` 
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Copy the **Webhook signing secret** (starts with `whsec_`)
6. Add to environment: `STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret`

## ✅ Ready to Test!

Once you've completed these steps, you'll be ready to:
- Test the payment flow
- Deploy the backend with Stripe integration
- Process real subscription payments

---

**Need Help?** 
- Run `npm run stripe:setup` for an interactive setup guide
- Check the console for any configuration errors
- Refer to `docs/stripe-setup-guide.md` for detailed instructions