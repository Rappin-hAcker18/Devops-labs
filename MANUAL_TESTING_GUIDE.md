# Manual Testing Guide - CloudCrew Academy

## Quick Start Testing Guide

Since the automated script encountered CORS issues, follow this manual testing guide using the live application.

---

## 🚀 Quick Test (5 minutes)

### 1. Start Development Server
```bash
npm run dev
```
Navigate to: http://localhost:3000

### 2. Test Signup Flow
1. Go to http://localhost:3000/signup
2. Create account with:
   - Email: Use your real email
   - Password: `Test123456!`
   - Fill other fields
3. Check email for verification code
4. Go to http://localhost:3000/confirm
5. Enter code and verify

### 3. Test Login
1. Go to http://localhost:3000/login
2. Login with verified credentials
3. Should redirect to dashboard/courses

### 4. Test Course Access (Free Tier)
1. Go to http://localhost:3000/courses
2. Click "AWS Fundamentals" (Free tier)
3. View course details
4. Click on a lesson
5. Verify you can access free content

### 5. Test Payment Flow
1. Go to http://localhost:3000/pricing
2. Click "Choose Standard" ($297)
3. Complete Stripe checkout with test card:
   - Card: `4242 4242 4242 4242`
   - Exp: `12/25`
   - CVC: `123`
   - ZIP: `12345`
4. Complete payment

### 6. Test Premium Access
1. Return to http://localhost:3000/courses
2. Click "Serverless Development" (Standard tier)
3. Verify course is now unlocked
4. Click on a lesson
5. Verify video player loads

### 7. Test Video Playback
1. In lesson view, video should load
2. Click play button
3. Watch for 10+ seconds
4. Check browser DevTools > Network tab
5. Look for `/api/videos/progress` requests
6. Refresh page - video should resume

---

## 🔍 Backend Verification

### Check Webhook Events
```bash
cd backend
serverless logs -f stripeWebhook --tail
```

### Check DynamoDB Tables

**Payments Table:**
```bash
aws dynamodb scan --table-name cloudcrew-payments-dev --region us-east-1 --max-items 5
```

**Enrollments Table:**
```bash
aws dynamodb scan --table-name cloudcrew-enrollments-dev --region us-east-1 --max-items 5
```

**Users Table:**
```bash
aws dynamodb scan --table-name cloudcrew-users-dev --region us-east-1 --max-items 5
```

### Check CloudWatch Logs

1. Go to AWS Console > CloudWatch > Log Groups
2. Find: `/aws/lambda/cloudcrew-backend-dev-stripeWebhook`
3. View recent log streams
4. Look for "checkout.session.completed" events

---

## 🧪 Detailed Test Scenarios

### Scenario 1: Free Tier User
**Steps:**
1. Signup without payment
2. Browse courses
3. Access AWS Fundamentals (Free)
4. Try to access Serverless Dev (Standard) - should be locked

**Expected:** Free course accessible, premium locked

---

### Scenario 2: Standard Tier Purchase
**Steps:**
1. Purchase Standard tier ($297)
2. Wait for webhook processing (check logs)
3. Refresh courses page
4. Access Serverless Development

**Expected:** 
- Payment successful
- Webhook creates enrollments for:
  - aws-fundamentals
  - serverless-development
- Both courses unlocked

---

### Scenario 3: Premium Tier Purchase
**Steps:**
1. Purchase Premium tier ($597)
2. Wait for webhook processing
3. Refresh courses page
4. All 3 courses should be accessible

**Expected:**
- Payment successful
- Webhook creates enrollments for:
  - aws-fundamentals
  - serverless-development
  - cloud-architecture
- All courses unlocked

---

### Scenario 4: Video Progress Tracking
**Steps:**
1. Open a lesson with video
2. Play video for 30 seconds
3. Open DevTools > Application > Local Storage
4. Check for progress data
5. Refresh page
6. Video should resume at 30-second mark

**Expected:**
- Progress saved every 5 seconds
- Resume works correctly

---

## 🐛 Common Issues & Fixes

### Issue: "Failed to get upload URL"
**Fix:** Video upload requires admin access. Use `/admin/videos` page.

### Issue: "Forbidden" on API calls
**Fix:** Check that JWT token is in localStorage as `authToken`

### Issue: Video won't play
**Fix:** 
1. Check video exists in S3 bucket
2. Verify CloudFront distribution is deployed
3. Check video metadata in DynamoDB

### Issue: Payment successful but no access
**Fix:**
1. Check Stripe webhook is configured in dashboard
2. Verify webhook secret in backend environment
3. Check CloudWatch logs for webhook errors

---

## ✅ Testing Checklist

Use this for comprehensive testing:

- [ ] User can signup
- [ ] Email verification works
- [ ] User can login
- [ ] Free courses accessible without payment
- [ ] Premium courses locked for free users
- [ ] Stripe checkout flow works
- [ ] Payment successful message appears
- [ ] Webhook processes payment (check logs)
- [ ] Enrollments created in DynamoDB
- [ ] Premium courses unlock after payment
- [ ] Video player loads and plays
- [ ] Progress tracking works (saves & resumes)
- [ ] User dashboard shows enrolled courses
- [ ] Mobile responsive design works
- [ ] Error handling works (wrong password, etc.)

---

## 📊 Success Metrics

**User Flow Completion Rate:** ______%

**Steps Completed:**
1. Signup: ✅/❌
2. Login: ✅/❌
3. Browse Courses: ✅/❌
4. Payment: ✅/❌
5. Access Content: ✅/❌
6. Watch Video: ✅/❌
7. Progress Tracking: ✅/❌

---

## 🚨 Critical Path Test

This is the MUST-WORK user journey:

1. **New user visits site** → Homepage loads
2. **Clicks "Sign Up"** → Signup form appears
3. **Completes signup** → Email sent, confirmation page
4. **Verifies email** → Account activated
5. **Logs in** → Redirected to courses
6. **Browses courses** → Sees 3 courses (1 free, 2 paid)
7. **Clicks free course** → Can access content
8. **Wants premium content** → Clicks "Upgrade"
9. **Goes to pricing** → Sees 3 tiers clearly
10. **Chooses Standard** → Stripe checkout opens
11. **Completes payment** → Success page, email receipt
12. **Returns to courses** → Premium courses unlocked
13. **Opens premium lesson** → Video loads and plays
14. **Watches 5 minutes** → Progress auto-saved
15. **Comes back later** → Video resumes where left off

**All 15 steps must work for production readiness.**

---

## 📝 Test Results Log

**Date:** _______________  
**Tester:** _______________

**Issues Found:**
1. _________________________________
2. _________________________________
3. _________________________________

**Status:** 🟢 Ready / 🟡 Minor Issues / 🔴 Blocking Issues
