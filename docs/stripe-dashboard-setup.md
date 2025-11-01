# CloudCrew Academy - Stripe Dashboard Configuration

## Prerequisites Checklist
- [ ] Stripe account created at https://stripe.com
- [ ] Logged into Stripe Dashboard
- [ ] Currently in **Test Mode** (toggle in top-left)

---

## Part 1: Create Products

### 1.1 Navigate to Products
1. Go to https://dashboard.stripe.com/products
2. Click "Add product"

### 1.2 Create Standard Product
**Product Details:**
```
Name: CloudCrew Academy Standard
Description: Full course access with hands-on labs and priority support
Statement descriptor: CLOUDCREW STANDARD
```

**Pricing Information:**
```
Pricing model: Recurring
Billing period: Monthly
Price: $297.00 USD
Currency: USD
```

**Advanced Settings:**
```
Tax behavior: Exclusive (tax calculated on top of price)
Trial period: 7 days (optional)
Usage type: Licensed (per-user pricing)
```

✅ Click "Save product"
📝 **IMPORTANT:** Copy the Price ID (starts with `price_`) - you'll need this!

### 1.3 Create Premium Product
**Product Details:**
```
Name: CloudCrew Academy Premium
Description: Complete career transformation with 1-on-1 mentoring and job placement
Statement descriptor: CLOUDCREW PREMIUM
```

**Pricing Information:**
```
Pricing model: Recurring
Billing period: Monthly  
Price: $597.00 USD
Currency: USD
```

**Advanced Settings:**
```
Tax behavior: Exclusive (tax calculated on top of price)
Trial period: 7 days (optional)
Usage type: Licensed (per-user pricing)
```

✅ Click "Save product"
📝 **IMPORTANT:** Copy the Price ID (starts with `price_`) - you'll need this!

---

## Part 2: Configure Webhook Endpoints

### 2.1 Navigate to Webhooks
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"

### 2.2 Create Development Webhook
**Endpoint Details:**
```
Endpoint URL: http://localhost:3000/api/webhook/stripe
Description: CloudCrew Academy Development Webhook
```

**Events to Send:**
Select these specific events:
- [x] `checkout.session.completed`
- [x] `customer.subscription.created`
- [x] `customer.subscription.updated`
- [x] `customer.subscription.deleted`
- [x] `invoice.payment_succeeded`
- [x] `invoice.payment_failed`
- [x] `customer.created`
- [x] `customer.updated`

✅ Click "Add endpoint"
📝 **IMPORTANT:** Copy the Signing Secret (starts with `whsec_`) - you'll need this!

### 2.3 Create Production Webhook (For Later)
**Endpoint Details:**
```
Endpoint URL: https://your-production-domain.com/api/webhook/stripe
Description: CloudCrew Academy Production Webhook
```
(Use same events as development)

---

## Part 3: Configure Customer Portal

### 3.1 Enable Customer Portal
1. Go to https://dashboard.stripe.com/settings/billing/portal
2. Click "Activate test link"

### 3.2 Configure Portal Settings
**Business Information:**
```
Business name: CloudCrew Academy
Support email: support@cloudcrew.academy
Support phone: +1 (555) 123-4567
Privacy policy URL: https://cloudcrew.academy/privacy
Terms of service URL: https://cloudcrew.academy/terms
```

**Customer Information:**
- [x] Allow customers to update email address
- [x] Allow customers to update billing address
- [x] Allow customers to update payment methods

**Subscription Features:**
- [x] Allow customers to cancel subscriptions
- [x] Allow customers to pause subscriptions
- [x] Allow customers to update subscriptions
- [x] Show proration preview

---

## Part 4: Tax Configuration (Optional but Recommended)

### 4.1 Enable Stripe Tax
1. Go to https://dashboard.stripe.com/settings/tax
2. Click "Enable Stripe Tax"

### 4.2 Configure Tax Settings
```
Default tax behavior: Exclusive
Collect tax in: United States (add more countries as needed)
```

---

## Part 5: Update Environment Variables

### 5.1 Get Your API Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 5.2 Update .env.local
```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret

# Product Price IDs (from steps 1.2 and 1.3)
NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID=price_your_standard_price_id
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id
```

### 5.3 Update Backend Environment
Add to your serverless deployment environment:
```bash
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
STRIPE_STANDARD_PRICE_ID=price_your_standard_price_id
STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id
```

---

## Part 6: Test Configuration

### 6.1 Test Cards
Use these in your test environment:
```
✅ Successful payment: 4242 4242 4242 4242
❌ Declined payment: 4000 0000 0000 0002
💳 Requires 3D Secure: 4000 0025 0000 3155
```
**For all test cards:**
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any valid ZIP (e.g., 12345)

### 6.2 Test Checkout Flow
1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/pricing`
3. Click "Get Started" on Standard or Premium
4. Complete checkout with test card
5. Verify webhook receives events

---

## Part 7: Security Best Practices

### 7.1 Webhook Security
- [x] Always verify webhook signatures
- [x] Use HTTPS in production
- [x] Keep webhook secrets secure
- [x] Log webhook events for debugging

### 7.2 API Key Management
- [x] Never commit API keys to version control
- [x] Use different keys for test/live environments
- [x] Rotate keys periodically
- [x] Restrict API key permissions

---

## Verification Checklist

After completing setup, verify:
- [ ] Can create Standard subscription ($297)
- [ ] Can create Premium subscription ($597)
- [ ] Webhook receives `checkout.session.completed`
- [ ] Customer portal accessible
- [ ] Payment methods can be updated
- [ ] Subscriptions can be cancelled
- [ ] Failed payments handled gracefully

---

## Next Steps After Configuration

1. **Test Payment Flow** - Complete end-to-end testing
2. **Deploy Backend** - Update serverless with new environment variables
3. **Production Setup** - Switch to live keys when ready
4. **Monitor Analytics** - Track conversion rates and customer lifecycle

---

## Troubleshooting

**Webhook not receiving events?**
- Check endpoint URL is accessible
- Verify webhook secret matches
- Check Stripe Dashboard > Webhooks > Attempts

**Payment intent creation fails?**
- Verify API keys are correct
- Check price IDs match created products
- Review browser console for errors

**CORS issues?**
- Ensure API routes have proper CORS headers
- Check network tab for failed requests

## Support
- Stripe Documentation: https://stripe.com/docs
- CloudCrew Academy: support@cloudcrew.academy