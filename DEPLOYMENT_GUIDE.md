# CloudCrew Academy - Production Deployment Guide

## 🚀 Overview

This guide covers deploying CloudCrew Academy to production with a multi-environment setup for safe testing and updates.

## 📋 Pre-Deployment Checklist

### ✅ Code & Configuration
- [x] All features tested locally
- [x] Environment variables documented
- [x] API endpoints working
- [x] Stripe webhooks configured
- [x] AWS services configured (Cognito, DynamoDB, S3, CloudFront)
- [ ] Production environment variables ready
- [ ] Domain name purchased (optional)
- [ ] SSL certificate ready (auto-provided by Vercel/Amplify)

### ✅ AWS Resources Status
- **Cognito User Pool**: `us-east-1_eBAqIBYa1`
- **DynamoDB Tables**: 
  - `cloudcrew-users-dev`
  - `cloudcrew-enrollments-dev`
  - `cloudcrew-video-metadata-dev`
- **S3 Buckets**: Video storage configured
- **CloudFront**: `d2f6ofuxhmqty1.cloudfront.net`
- **Backend API**: `https://vhavj29513.execute-api.us-east-1.amazonaws.com/dev`

### ✅ Stripe Configuration
- **Test Mode**: Configured with webhook `whsec_bf9e3de3064c9b803a92450b24307d17a336eb3a473f2158366d2b77ef6e6240`
- **Standard Product**: `price_1SNqrV1kvg2l2Gw7mqvTMiCl` ($49/mo)
- [ ] Production mode keys ready
- [ ] Production webhook endpoint configured

---

## 🌍 Multi-Environment Setup

### Environment Strategy

| Environment | URL | Purpose | Stripe Mode | Backend |
|------------|-----|---------|-------------|---------|
| **Local** | `localhost:3000` | Development | Test | Dev |
| **Staging** | `staging.your-domain.com` | Testing | Test | Staging |
| **Production** | `your-domain.com` | Live Site | Live | Prod |

---

## 🎯 Deployment Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ Next.js optimized (built by same team)
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN included
- ✅ Preview deployments for PRs
- ✅ Zero configuration needed
- ✅ Free tier available
- ✅ One-click rollbacks

### Step-by-Step Deployment

#### 1. Create Git Repository (if not already done)

```powershell
# Initialize git if needed
git init

# Add all files
git add .

# Commit current state
git commit -m "feat: complete CloudCrew Academy platform"

# Create GitHub repository (go to github.com/new)
# Then connect local repo to GitHub
git remote add origin https://github.com/YOUR_USERNAME/cloudcrew-academy.git
git branch -M main
git push -u origin main
```

#### 2. Sign Up for Vercel

1. Go to https://vercel.com
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

#### 3. Import Project

1. Click "Add New Project"
2. Select your `cloudcrew-academy` repository
3. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

#### 4. Configure Environment Variables

In Vercel dashboard, add these environment variables:

**For Production:**
```env
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_eBAqIBYa1
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_cognito_client_id
NEXT_PUBLIC_API_URL=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod

# Stripe (Production Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENVIRONMENT=production
```

#### 5. Deploy

```powershell
# Push to main branch triggers automatic deployment
git push origin main

# Or deploy via Vercel CLI
npx vercel --prod
```

#### 6. Configure Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your domain: `cloudcrew.academy`
3. Configure DNS:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`

---

## 🎯 Deployment Option 2: AWS Amplify

### Why AWS Amplify?
- ✅ AWS-native integration
- ✅ All AWS services in one place
- ✅ Built-in CI/CD
- ✅ Automatic scaling
- ✅ CloudFront CDN included

### Step-by-Step Deployment

#### 1. Install AWS Amplify CLI

```powershell
npm install -g @aws-amplify/cli
amplify configure
```

#### 2. Initialize Amplify

```powershell
# In project root
amplify init

# Follow prompts:
# - Project name: cloudcrew-academy
# - Environment: production
# - Default editor: Visual Studio Code
# - App type: javascript
# - Framework: react
# - Source directory: src
# - Distribution directory: .next
# - Build command: npm run build
# - Start command: npm run start
```

#### 3. Add Hosting

```powershell
amplify add hosting

# Select: Amazon CloudFront and S3
# Environment: production
```

#### 4. Configure Environment Variables

Create `amplify/backend/amplify-meta.json` or use AWS console to set:
- Same environment variables as Vercel section above

#### 5. Deploy

```powershell
amplify publish

# This will:
# 1. Build your app
# 2. Upload to S3
# 3. Invalidate CloudFront cache
# 4. Provide deployment URL
```

---

## 🔧 Backend Deployment (Serverless Framework)

### Update Backend for Production

#### 1. Create Production Serverless Config

```yaml
# backend/serverless-prod.yml
service: cloudcrew-backend-prod

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: prod
  environment:
    USERS_TABLE: cloudcrew-users-prod
    ENROLLMENT_TABLE: cloudcrew-enrollments-prod
    VIDEO_METADATA_TABLE: cloudcrew-video-metadata-prod
    FRONTEND_URL: https://cloudcrew.academy
    STRIPE_SECRET_KEY: ${env:STRIPE_SECRET_KEY}
    STRIPE_WEBHOOK_SECRET: ${env:STRIPE_WEBHOOK_SECRET}
```

#### 2. Deploy Backend

```powershell
cd backend

# Deploy to production
npx serverless deploy --config serverless-prod.yml --stage prod

# Note the API Gateway URL
# Update NEXT_PUBLIC_API_URL in frontend
```

#### 3. Create Production DynamoDB Tables

```powershell
# Users table
aws dynamodb create-table `
  --table-name cloudcrew-users-prod `
  --attribute-definitions AttributeName=email,AttributeType=S `
  --key-schema AttributeName=email,KeyType=HASH `
  --billing-mode PAY_PER_REQUEST `
  --region us-east-1

# Enrollments table
aws dynamodb create-table `
  --table-name cloudcrew-enrollments-prod `
  --attribute-definitions `
    AttributeName=userId,AttributeType=S `
    AttributeName=courseId,AttributeType=S `
  --key-schema `
    AttributeName=userId,KeyType=HASH `
    AttributeName=courseId,KeyType=RANGE `
  --billing-mode PAY_PER_REQUEST `
  --region us-east-1

# Video metadata table
aws dynamodb create-table `
  --table-name cloudcrew-video-metadata-prod `
  --attribute-definitions AttributeName=videoId,AttributeType=S `
  --key-schema AttributeName=videoId,KeyType=HASH `
  --billing-mode PAY_PER_REQUEST `
  --region us-east-1
```

---

## 🔐 Stripe Production Setup

### 1. Activate Live Mode

1. Go to https://dashboard.stripe.com
2. Toggle from "Test mode" to "Live mode"
3. Complete business verification if needed

### 2. Get Production API Keys

```
Dashboard → Developers → API keys

Publishable key: pk_live_...
Secret key: sk_live_...
```

### 3. Create Production Products

```powershell
# Update scripts/create-products-api.js to use live keys
node scripts/create-products-api.js

# This creates:
# - Pro Plan: $49/mo with all courses
```

### 4. Configure Production Webhook

1. Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/webhooks/stripe`
3. Events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
4. Copy webhook signing secret → Update `STRIPE_WEBHOOK_SECRET`

---

## 🌲 Git Branch Strategy

### Branch Setup

```powershell
# Create staging branch
git checkout -b staging
git push -u origin staging

# Create development branch
git checkout -b dev
git push -u origin dev

# Back to main
git checkout main
```

### Branch Rules

- **`main`**: Production deployments only
- **`staging`**: Pre-production testing
- **`dev`**: Active development work
- **Feature branches**: `feature/certificate-pdf`, `fix/login-bug`, etc.

### Workflow Example

```powershell
# 1. Create feature branch from dev
git checkout dev
git checkout -b feature/new-course-layout

# 2. Make changes and commit
git add .
git commit -m "feat: improve course layout"

# 3. Push and create PR to dev
git push origin feature/new-course-layout

# 4. Merge to dev → test locally
# 5. Merge dev to staging → test on staging URL
# 6. Merge staging to main → deploys to production
```

---

## 📊 Monitoring & Analytics

### 1. Vercel Analytics

- Automatically enabled
- View in Vercel dashboard
- Real-time performance metrics
- Web vitals tracking

### 2. AWS CloudWatch

```powershell
# View Lambda logs
aws logs tail /aws/lambda/cloudcrew-backend-prod-webhooks --follow

# View API Gateway metrics
aws cloudwatch get-metric-statistics `
  --namespace AWS/ApiGateway `
  --metric-name Count `
  --start-time 2025-11-01T00:00:00Z `
  --end-time 2025-11-01T23:59:59Z `
  --period 3600 `
  --statistics Sum
```

### 3. Error Tracking (Optional)

Add Sentry for error monitoring:

```powershell
npm install @sentry/nextjs

npx @sentry/wizard -i nextjs
```

---

## 🔄 Post-Deployment Testing

### Checklist

```
Frontend:
[ ] Homepage loads correctly
[ ] Navigation works
[ ] Course pages display
[ ] Login/signup functional
[ ] User dashboard accessible
[ ] Admin dashboard (for admin users)
[ ] Community forum working
[ ] Certificates display

Payment Flow:
[ ] Pricing page loads
[ ] Stripe checkout opens
[ ] Test payment processes (use test card)
[ ] Webhook receives events
[ ] User tier updates
[ ] Course access granted

Backend:
[ ] API endpoints respond
[ ] Authentication works
[ ] Database reads/writes
[ ] Video URLs load
[ ] Error handling works

Performance:
[ ] Lighthouse score > 90
[ ] First contentful paint < 1.5s
[ ] Time to interactive < 3s
[ ] Page load time < 2s
```

### Test Payment in Production

**DO NOT use real cards initially!**

Use Stripe test cards even in live mode:
- Card: `4242 4242 4242 4242`
- Exp: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

---

## 🚨 Rollback Procedure

### Vercel Rollback

1. Go to Vercel dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Deployment switches in ~30 seconds

### AWS Amplify Rollback

```powershell
# List recent deployments
amplify status

# Rollback to previous version
amplify publish --previous
```

### Database Rollback

**⚠️ Databases can't be rolled back!**
- Always test in staging first
- Take DynamoDB backups before schema changes
- Use DynamoDB Point-in-Time Recovery

---

## 📈 Scaling Considerations

### Auto-Scaling (Included)

- **Vercel**: Automatic based on traffic
- **AWS Lambda**: Scales to 1000 concurrent executions
- **DynamoDB**: On-demand billing scales automatically
- **CloudFront**: Global CDN, handles millions of requests

### Cost Optimization

**Current monthly costs (estimated):**
- Vercel hosting: $0 (Pro plan $20/mo for team features)
- AWS Lambda: ~$5 for 1M requests
- DynamoDB: ~$10 for moderate traffic
- S3 + CloudFront: ~$20 for video storage/delivery
- **Total: ~$35-55/month** for small-medium traffic

**At scale (10K+ users):**
- Consider reserved DynamoDB capacity
- Implement caching with Redis
- Use Lambda reserved concurrency
- Enable CloudFront compression

---

## 🎓 Environment Variables Reference

### Frontend (.env.production)

```env
# AWS
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_eBAqIBYa1
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_client_id
NEXT_PUBLIC_API_URL=https://YOUR_API.execute-api.us-east-1.amazonaws.com/prod

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=https://cloudcrew.academy
NEXT_PUBLIC_ENVIRONMENT=production
```

### Backend (serverless-prod.yml)

```env
USERS_TABLE=cloudcrew-users-prod
ENROLLMENT_TABLE=cloudcrew-enrollments-prod
VIDEO_METADATA_TABLE=cloudcrew-video-metadata-prod
FRONTEND_URL=https://cloudcrew.academy
STRIPE_SECRET_KEY=${env:STRIPE_SECRET_KEY}
STRIPE_WEBHOOK_SECRET=${env:STRIPE_WEBHOOK_SECRET}
```

---

## ✅ Deployment Success Criteria

Your deployment is successful when:

1. ✅ Site loads at production URL
2. ✅ All pages accessible
3. ✅ Users can sign up/login
4. ✅ Payment flow completes
5. ✅ Courses are accessible after payment
6. ✅ Videos play correctly
7. ✅ No console errors
8. ✅ Lighthouse score > 85
9. ✅ Mobile responsive
10. ✅ SSL certificate valid

---

## 🆘 Troubleshooting

### Common Issues

**Issue: "Cannot connect to API"**
```
Solution: Check NEXT_PUBLIC_API_URL is set correctly
Verify: Backend is deployed and responding
```

**Issue: "Stripe webhook not firing"**
```
Solution: Verify webhook URL in Stripe dashboard
Check: Webhook secret matches environment variable
Test: Use Stripe CLI to test webhooks locally
```

**Issue: "Videos not loading"**
```
Solution: Check CloudFront distribution is active
Verify: CORS settings on S3 bucket
Test: Try video URL directly in browser
```

**Issue: "Build fails on Vercel"**
```
Solution: Check build logs for errors
Common: Missing environment variables
Fix: Add all required env vars in Vercel dashboard
```

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **AWS Amplify Docs**: https://docs.amplify.aws
- **Stripe Integration**: https://stripe.com/docs/webhooks

---

## 🎉 You're Ready!

Your CloudCrew Academy platform is production-ready. The multi-environment setup ensures you can:

1. ✅ Safely test changes in staging
2. ✅ Deploy to production with confidence
3. ✅ Rollback if issues arise
4. ✅ Monitor performance and errors
5. ✅ Scale as your user base grows

**Recommended first step**: Deploy to Vercel staging environment to test the full deployment process before going to production.
