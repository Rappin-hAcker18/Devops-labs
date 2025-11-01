# Quick Deployment Commands

## Initial Setup (One-time)

### 1. Install Vercel CLI
```powershell
npm i -g vercel
```

### 2. Login to Vercel
```powershell
vercel login
```

### 3. Link Project
```powershell
vercel link
```

---

## Deploy to Production

### Option 1: Git Push (Recommended)
```powershell
# Commit your changes
git add .
git commit -m "feat: ready for production"

# Push to main branch (auto-deploys to production)
git push origin main
```

### Option 2: Vercel CLI
```powershell
# Deploy to production
vercel --prod

# Or deploy with specific environment
vercel --prod --env NEXT_PUBLIC_ENVIRONMENT=production
```

---

## Deploy to Staging

### Create staging branch
```powershell
git checkout -b staging
git push origin staging
```

### Configure in Vercel Dashboard
1. Go to Project Settings → Git
2. Add "staging" branch
3. Set as "Preview" environment

---

## Environment Variables Setup

### Add to Vercel Dashboard
1. Go to Project Settings → Environment Variables
2. Add each variable from `.env.production.template`
3. Select environment: Production, Preview, or Development

### Or use Vercel CLI
```powershell
# Add production variable
vercel env add NEXT_PUBLIC_API_URL production

# Pull environment variables
vercel env pull .env.local
```

---

## Useful Commands

### Check deployment status
```powershell
vercel ls
```

### View logs
```powershell
vercel logs
```

### Promote preview to production
```powershell
vercel promote <deployment-url>
```

### Rollback to previous deployment
```powershell
# Go to Vercel dashboard → Deployments
# Click on working deployment → "Promote to Production"
```

### Remove deployment
```powershell
vercel rm <deployment-name>
```

---

## Backend Deployment

### Deploy serverless backend to production
```powershell
cd backend

# Set environment variables
$env:STRIPE_SECRET_KEY="sk_live_..."
$env:STRIPE_WEBHOOK_SECRET="whsec_..."

# Deploy
npx serverless deploy --config serverless-prod.yml --stage prod

# Note the API Gateway URL and update frontend .env
```

### View backend logs
```powershell
npx serverless logs -f webhooks --stage prod --tail
```

---

## Post-Deployment Checklist

```
[ ] Frontend deployed successfully
[ ] Backend API deployed
[ ] Environment variables configured
[ ] Custom domain connected (if applicable)
[ ] SSL certificate active
[ ] Test user signup
[ ] Test login flow
[ ] Test payment (use test card)
[ ] Test video playback
[ ] Check admin dashboard
[ ] Verify Stripe webhook receives events
[ ] Monitor error logs
[ ] Check Lighthouse performance score
```

---

## Monitoring

### Vercel Analytics
```
Dashboard → Analytics
```

### AWS CloudWatch
```powershell
# API Gateway logs
aws logs tail /aws/apigateway/cloudcrew-backend-prod --follow

# Lambda logs
aws logs tail /aws/lambda/cloudcrew-backend-prod-webhooks --follow
```

### Stripe Dashboard
```
Dashboard → Developers → Webhooks → View events
```

---

## Troubleshooting

### Build fails
```powershell
# Test build locally
npm run build

# Check build logs in Vercel dashboard
vercel logs --build
```

### Environment variables not loading
```powershell
# Verify variables are set
vercel env ls

# Re-deploy to pick up new variables
vercel --prod --force
```

### API not responding
```powershell
# Check backend is deployed
cd backend
npx serverless info --stage prod

# Test endpoint directly
curl https://YOUR_API.execute-api.us-east-1.amazonaws.com/prod/health
```

---

## Quick Links

- Vercel Dashboard: https://vercel.com/dashboard
- AWS Console: https://console.aws.amazon.com
- Stripe Dashboard: https://dashboard.stripe.com
- GitHub Repo: https://github.com/YOUR_USERNAME/cloudcrew-academy
