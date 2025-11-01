# End-to-End User Flow Testing Checklist

## Overview
This checklist covers the complete user journey from signup to accessing premium video content.

**Testing Date:** _____________  
**Tester:** _____________  
**Environment:** Development (localhost:3000 + AWS dev stack)

---

## 1. User Signup & Verification ✅

### Test 1.1: New User Registration
- [ ] Navigate to `/signup`
- [ ] Fill out registration form:
  - First Name: `Test`
  - Last Name: `User`
  - Email: Use a real email you can access
  - Password: `TestPassword123!`
  - Confirm Password: `TestPassword123!`
- [ ] Click "Create Account"
- [ ] Verify success message appears
- [ ] Check email inbox for verification code

**Expected Result:** User receives verification email from AWS Cognito

**Actual Result:** ________________________________

---

### Test 1.2: Email Verification
- [ ] Open verification email
- [ ] Copy verification code
- [ ] Navigate to `/confirm` (should redirect automatically)
- [ ] Enter email and verification code
- [ ] Click "Verify Account"
- [ ] Verify redirect to login or dashboard

**Expected Result:** Account verified successfully, redirect to appropriate page

**Actual Result:** ________________________________

---

## 2. User Login ✅

### Test 2.1: Login with Verified Account
- [ ] Navigate to `/login`
- [ ] Enter verified email
- [ ] Enter password
- [ ] Click "Sign In"
- [ ] Verify redirect to `/dashboard` or `/courses`

**Expected Result:** Successful login, JWT token stored in localStorage

**Actual Result:** ________________________________

**Auth Token (first 20 chars):** ________________________________

---

## 3. Browse Courses ✅

### Test 3.1: View Course Catalog
- [ ] Navigate to `/courses`
- [ ] Verify course cards display:
  - [ ] AWS Fundamentals
  - [ ] Serverless Development
  - [ ] Cloud Architecture
- [ ] Check tier badges (Free, Standard, Premium)
- [ ] Click on a course card

**Expected Result:** Course listing page shows all available courses

**Actual Result:** ________________________________

---

### Test 3.2: View Course Details (Locked Content)
- [ ] View a Standard or Premium tier course
- [ ] Verify "locked" state for premium content
- [ ] Look for "Upgrade to Access" or paywall message
- [ ] Click "Upgrade" or "Purchase" button

**Expected Result:** Premium content shows locked state, prompts for upgrade

**Actual Result:** ________________________________

---

## 4. Payment Flow ✅

### Test 4.1: View Pricing Page
- [ ] Navigate to `/pricing`
- [ ] Verify 3 tiers display:
  - [ ] Free ($0)
  - [ ] Standard ($297)
  - [ ] Premium ($597)
- [ ] Review tier features
- [ ] Click "Choose Standard" or "Choose Premium"

**Expected Result:** Pricing page shows all tier options clearly

**Actual Result:** ________________________________

---

### Test 4.2: Stripe Checkout Session
- [ ] Verify redirect to Stripe Checkout page
- [ ] Check that email is pre-filled
- [ ] Verify correct tier and price display
- [ ] Use Stripe test card:
  - Card: `4242 4242 4242 4242`
  - Expiry: Any future date (e.g., `12/25`)
  - CVC: Any 3 digits (e.g., `123`)
  - ZIP: Any 5 digits (e.g., `12345`)
- [ ] Complete payment
- [ ] Wait for redirect to success page

**Expected Result:** Successful payment, redirect to `/success`

**Actual Result:** ________________________________

**Checkout Session ID:** ________________________________

---

### Test 4.3: Webhook Processing (Backend Check)
- [ ] Open CloudWatch logs for `stripeWebhook` Lambda
- [ ] Look for `checkout.session.completed` event
- [ ] Verify webhook payload contains:
  - [ ] `userId`
  - [ ] `tier` (standard/premium)
  - [ ] `amount_total`
- [ ] Check DynamoDB `payments` table for new record
- [ ] Check DynamoDB `enrollments` table for new enrollments

**Expected Result:** Webhook processes payment, creates enrollments

**Webhook Event ID:** ________________________________

**Enrollments Created:** ________________________________

---

## 5. Access Premium Content ✅

### Test 5.1: Verify Course Access
- [ ] Navigate back to `/courses`
- [ ] Click on a course you purchased access to
- [ ] Verify course detail page shows "unlocked" state
- [ ] Check that lessons are accessible (not locked)
- [ ] Click on first lesson

**Expected Result:** Course shows unlocked, lessons accessible

**Actual Result:** ________________________________

---

### Test 5.2: Lesson Navigation
- [ ] Verify lesson content displays
- [ ] Check lesson components:
  - [ ] Video player visible
  - [ ] Lesson description
  - [ ] Navigation buttons (Next/Previous)
- [ ] Try navigating between lessons

**Expected Result:** Can navigate through course lessons

**Actual Result:** ________________________________

---

## 6. Video Playback ✅

### Test 6.1: Video Player Functionality
- [ ] Verify video player loads
- [ ] Check CloudFront URL in network tab
- [ ] Test video controls:
  - [ ] Play button
  - [ ] Pause button
  - [ ] Volume control
  - [ ] Seek/scrub timeline
  - [ ] Fullscreen mode
- [ ] Watch for at least 30 seconds

**Expected Result:** Video plays smoothly from CloudFront CDN

**Actual Result:** ________________________________

**CloudFront Domain:** `d2f6ofuxhmqty1.cloudfront.net`

---

### Test 6.2: Progress Tracking
- [ ] Watch video for 30+ seconds
- [ ] Open browser DevTools > Network tab
- [ ] Look for POST request to `/api/videos/progress`
- [ ] Verify progress payload contains:
  - [ ] `videoId`
  - [ ] `courseId`
  - [ ] `progress` (seconds watched)
  - [ ] `userId`
- [ ] Refresh page and verify video resumes at last position

**Expected Result:** Progress auto-saves every 5 seconds

**Actual Result:** ________________________________

**Last Progress Saved:** ________________ seconds

---

## 7. User Dashboard ✅

### Test 7.1: View Learning Progress
- [ ] Navigate to `/dashboard`
- [ ] Verify enrolled courses display
- [ ] Check progress indicators (% complete)
- [ ] Review recent activity
- [ ] Click "Continue Learning" on a course

**Expected Result:** Dashboard shows all enrolled courses and progress

**Actual Result:** ________________________________

---

### Test 7.2: Profile Information
- [ ] View user profile section
- [ ] Verify subscription tier displays correctly
- [ ] Check that email and name are correct
- [ ] Look for "Manage Subscription" link (if applicable)

**Expected Result:** Profile shows correct user info and tier

**Current Tier:** ________________________________

---

## 8. Edge Cases & Error Handling ✅

### Test 8.1: Attempt to Access Locked Content
- [ ] Log out
- [ ] Navigate to a Premium course URL directly
- [ ] Verify redirect to login or paywall
- [ ] Log in with Free tier account
- [ ] Attempt to access Premium lesson
- [ ] Verify "Upgrade Required" message

**Expected Result:** Access denied, clear upgrade prompt

**Actual Result:** ________________________________

---

### Test 8.2: Video Error Handling
- [ ] Try accessing a video that doesn't exist
- [ ] Verify error message displays
- [ ] Check that player shows "Video not found" state
- [ ] Verify no console errors crash the app

**Expected Result:** Graceful error handling, user-friendly message

**Actual Result:** ________________________________

---

### Test 8.3: Payment Failure
- [ ] Return to `/pricing`
- [ ] Start checkout for a tier
- [ ] Use Stripe test card for decline: `4000 0000 0000 0002`
- [ ] Complete form
- [ ] Verify payment fails
- [ ] Check error message from Stripe
- [ ] Verify no enrollment is created

**Expected Result:** Payment fails gracefully, no access granted

**Actual Result:** ________________________________

---

## 9. Mobile Responsiveness ✅

### Test 9.1: Mobile Navigation
- [ ] Open site on mobile device or resize browser to 375px width
- [ ] Test mobile menu functionality
- [ ] Navigate through pages
- [ ] Verify video player works on mobile
- [ ] Test touch controls (play, volume, seek)

**Expected Result:** Full functionality on mobile devices

**Actual Result:** ________________________________

---

## 10. Performance & UX ✅

### Test 10.1: Page Load Times
- [ ] Open DevTools > Network tab
- [ ] Clear cache
- [ ] Reload `/courses` page
- [ ] Check load time: __________ ms
- [ ] Test video playback start time: __________ ms

**Expected Result:** Pages load in < 3 seconds, videos start in < 2 seconds

**Actual Result:** ________________________________

---

## Summary

**Total Tests:** _______  
**Passed:** _______  
**Failed:** _______  
**Notes/Issues:**

_______________________________________________
_______________________________________________
_______________________________________________

---

## Critical Issues Found

1. ____________________________________________
2. ____________________________________________
3. ____________________________________________

---

## Recommendations

1. ____________________________________________
2. ____________________________________________
3. ____________________________________________

---

**Testing Completed:** ✅ / ❌  
**Ready for Production:** ✅ / ❌  
**Sign-off:** ________________________  **Date:** __________
