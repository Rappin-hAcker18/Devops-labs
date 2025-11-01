# Stripe Payment Integration Setup Guide

## Overview
This guide will help you configure Stripe payments for the CloudCrew Academy platform with our 3-tier subscription system:
- **Free Tier**: $0 (Basic course access)
- **Standard Tier**: $297 (Full course access + labs)
- **Premium Tier**: $597 (Everything + 1-on-1 mentoring)

## Prerequisites
1. Stripe account (https://stripe.com)
2. AWS account with deployed backend
3. Environment variables configured

## Step 1: Create Stripe Products and Prices

### 1.1 Log into Stripe Dashboard
1. Go to https://dashboard.stripe.com
2. Switch to Test mode for development

### 1.2 Create Products
Navigate to Products → Add Product for each tier:

**Standard Product:**
- Name: "CloudCrew Academy Standard"
- Description: "Full course access with hands-on labs"
- Recurring: Monthly
- Price: $297.00 USD
- Price ID: Copy this for your environment variables

**Premium Product:**
- Name: "CloudCrew Academy Premium"
- Description: "Full access plus 1-on-1 mentoring and career services"
- Recurring: Monthly
- Price: $597.00 USD
- Price ID: Copy this for your environment variables

### 1.3 Update Environment Variables
Add the Price IDs to your backend environment:

```bash
# In your backend/.env or serverless environment
STRIPE_STANDARD_PRICE_ID=price_1234567890abcdef
STRIPE_PREMIUM_PRICE_ID=price_0987654321fedcba
```

## Step 2: Configure Webhooks

### 2.1 Create Webhook Endpoint
1. In Stripe Dashboard, go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/webhook/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 2.2 Configure Webhook Secret
1. After creating the webhook, click on it
2. Copy the "Signing secret"
3. Add to your environment variables:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
```

## Step 3: Update Backend Configuration

### 3.1 Update Price IDs in Code
Edit `backend/src/handlers/payments.ts` and update the SUBSCRIPTION_PRICES:

```typescript
const SUBSCRIPTION_PRICES = {
  standard: 'price_1234567890abcdef', // Your actual Standard price ID
  premium: 'price_0987654321fedcba',  // Your actual Premium price ID
};
```

### 3.2 Deploy Backend Changes
```bash
cd backend
npm run deploy
```

## Step 4: Frontend Configuration

### 4.1 Environment Variables
Update your `.env.local` file:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.amazonaws.com/dev
```

### 4.2 Test the Integration
1. Start your development server: `npm run dev`
2. Navigate to the pricing page
3. Click "Get Started" on Standard or Premium plan
4. Complete the test checkout using Stripe test cards

## Step 5: Test Cards

Use these test card numbers in development:

### Successful Payments
- **Visa**: 4242 4242 4242 4242
- **Visa (debit)**: 4000 0566 5566 5556
- **Mastercard**: 5555 5555 5555 4444

### Failed Payments
- **Declined**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995

**Test Details:**
- Any future expiry date (e.g., 12/34)
- Any 3-digit CVC
- Any zip code

## Step 6: Production Setup

### 6.1 Switch to Live Mode
1. In Stripe Dashboard, toggle to "Live mode"
2. Create new products with live prices
3. Update webhook endpoints to production URLs
4. Update environment variables with live keys

### 6.2 Security Checklist
- [ ] Webhook endpoints use HTTPS
- [ ] Webhook signatures are verified
- [ ] API keys are stored securely
- [ ] Test mode is disabled in production
- [ ] Error handling is implemented
- [ ] Logging is configured

## Step 7: Testing Checklist

### Payment Flow Testing
- [ ] Standard subscription checkout works
- [ ] Premium subscription checkout works
- [ ] Webhook events are received and processed
- [ ] User subscription status updates in database
- [ ] Failed payments are handled gracefully
- [ ] Subscription cancellation works

### User Experience Testing
- [ ] Pricing page displays correctly
- [ ] Payment forms are mobile-responsive
- [ ] Success/error messages are clear
- [ ] User dashboard shows subscription status
- [ ] Access control works for subscription tiers

## Troubleshooting

### Common Issues

**Webhook not receiving events:**
- Check webhook URL is accessible
- Verify webhook secret is correct
- Check Stripe logs for delivery attempts

**Payment intent creation fails:**
- Verify API keys are correct
- Check backend logs for errors
- Ensure price IDs match Stripe products

**CORS errors:**
- Ensure backend API has proper CORS configuration
- Check API Gateway settings

### Support Resources
- Stripe Documentation: https://stripe.com/docs
- Stripe Test Cards: https://stripe.com/docs/testing
- CloudCrew Academy Support: support@cloudcrew.academy

## Next Steps
After completing this setup:
1. Test the complete payment flow
2. Configure user access control based on subscription tier
3. Set up email notifications for successful payments
4. Implement subscription management features
5. Add analytics tracking for conversion rates