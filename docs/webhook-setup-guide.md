# Stripe Webhook Setup Guide

## ✅ Backend Webhook Handler Created

The webhook handler (`backend/src/handlers/webhooks.ts`) has been created and will handle:

- `checkout.session.completed` - Processes successful payments
- `payment_intent.succeeded` - Confirms payment success  
- `payment_intent.payment_failed` - Handles failed payments
- `customer.subscription.created/updated` - Manages subscription changes
- `customer.subscription.deleted` - Handles cancellations

## 📝 Setup Steps

### 1. Get Your Stripe Webhook Secret

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Go to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter your webhook URL: 
   ```
   https://vhavj29513.execute-api.us-east-1.amazonaws.com/dev/api/webhooks/stripe
   ```
5. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

6. Click **Add endpoint**
7. Copy the **Signing secret** (starts with `whsec_`)

### 2. Update Environment Variables

Add to `backend/.env` (create if doesn't exist):
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Deploy Backend (After fixing TypeScript issue)

The webhook handler is ready but needs TypeScript version compatibility fix:

**Option A: Update Stripe package**
```bash
cd backend
npm install stripe@latest
```

**Option B: Use type assertion (quick fix)**
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any
});
```

Then deploy:
```bash
cd backend
serverless deploy --force
```

### 4. Test Webhook

Use Stripe CLI to test locally:
```bash
stripe listen --forward-to https://vhavj29513.execute-api.us-east-1.amazonaws.com/dev/api/webhooks/stripe

# In another terminal, trigger test events:
stripe trigger checkout.session.completed
```

## 🔄 How It Works

1. **User completes checkout** → Stripe sends `checkout.session.completed` event
2. **Webhook handler receives event** → Verifies signature for security
3. **Updates DynamoDB tables**:
   - Saves payment record to `cloudcrew-payments-dev`
   - Updates user subscription tier in `cloudcrew-users-dev`  
   - Creates enrollment records in `cloudcrew-enrollments-dev`
4. **Grants course access** based on tier:
   - **Free**: Intro courses only
   - **Standard**: AWS Fundamentals + Serverless Development
   - **Premium**: All courses + Advanced Topics

## 🎯 What Happens After Payment

- User's `subscriptionTier` is updated to their purchased tier
- User's `subscriptionStatus` is set to `'active'`
- Enrollment records are created for all courses in their tier
- User can immediately access premium content

## 🧪 Testing Checklist

- [ ] Webhook endpoint is accessible (returns 200)
- [ ] Stripe signature verification works
- [ ] Payment records are saved to DynamoDB
- [ ] User subscription tier is updated  
- [ ] Course enrollments are created
- [ ] User can access premium courses after payment

## 🔐 Security

- Webhook signature verification prevents unauthorized requests
- Only Stripe can send valid webhook events
- Metadata includes `userId` and `tier` for proper attribution

## 📊 Next Steps After Webhook Setup

1. Test complete payment flow (signup → pay → access courses)
2. Add email notifications for successful payments
3. Build admin dashboard to view payments and enrollments
4. Implement subscription renewal handling (if using recurring billing)
