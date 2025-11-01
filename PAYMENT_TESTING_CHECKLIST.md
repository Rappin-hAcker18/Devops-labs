## 🧪 CloudCrew Academy - Manual Payment Testing Checklist

### ✅ **Environment Verification**
- [x] Development server running on http://localhost:3001
- [x] Backend deployed with payment endpoints
- [x] Stripe products created and configured
- [x] Environment variables properly set

### 🎯 **Test Scenarios**

#### **Test 1: Pricing Page Verification**
□ **Navigate to**: http://localhost:3001/pricing
□ **Verify pricing displays correctly**:
  - □ Free Tier: $0 forever
  - □ Standard Tier: $297/month (marked as popular)
  - □ Premium Tier: $597/month
□ **Check UI elements**:
  - □ All three pricing cards visible
  - □ Feature lists complete
  - □ "Get Started" buttons present
  - □ Popular badge on Standard plan

#### **Test 2: Standard Plan Checkout ($297)**
□ **Click**: "Get Started" on Standard Pro plan
□ **Expected behavior**:
  - □ Button shows "Loading..." during processing
  - □ Page redirects to Stripe Checkout
  - □ Stripe form loads with correct amount ($297.00)
□ **Enter test payment info**:
  - □ Card: `4242 4242 4242 4242`
  - □ Expiry: `12/28` (any future date)
  - □ CVC: `123` (any 3 digits)
  - □ ZIP: `12345` (any ZIP code)
□ **Complete payment**:
  - □ Click "Pay" button
  - □ Payment processes successfully
  - □ Redirected to success page

#### **Test 3: Premium Plan Checkout ($597)**
□ **Click**: "Get Started" on Premium Elite plan
□ **Expected behavior**:
  - □ Button shows "Loading..." during processing
  - □ Page redirects to Stripe Checkout
  - □ Stripe form loads with correct amount ($597.00)
□ **Enter test payment info**:
  - □ Use same test card: `4242 4242 4242 4242`
□ **Complete payment**:
  - □ Payment processes successfully
  - □ Redirected to success page

#### **Test 4: Free Plan Access**
□ **Click**: "Start Free" on Free Starter plan
□ **Expected behavior**:
  - □ Redirects to signup page with plan=free
  - □ No payment processing required

#### **Test 5: Error Handling**
□ **Test declined card**: `4000 0000 0000 0002`
□ **Expected behavior**:
  - □ Stripe shows decline message
  - □ User can try again
  - □ No charges processed
□ **Test insufficient funds**: `4000 0000 0000 9995`
□ **Expected behavior**:
  - □ Stripe shows insufficient funds message
  - □ User can try different card

### 🔍 **Verification Steps**

#### **Frontend Verification**
□ **Browser Console**: Check for any JavaScript errors
□ **Network Tab**: Verify API calls to backend
□ **Payment Flow**: Smooth user experience
□ **Loading States**: Buttons show loading during processing

#### **Stripe Dashboard Verification**
□ **Navigate to**: https://dashboard.stripe.com/test/payments
□ **Check for payments**:
  - □ Standard payment: $297.00 USD
  - □ Premium payment: $597.00 USD
  - □ Payment status: Succeeded
  - □ Customer information captured

#### **Backend Verification**
□ **API Endpoints Working**:
  - □ `/api/payments/checkout` responding
  - □ Price IDs correctly configured
  - □ Environment variables loaded

### 💳 **Test Cards Reference**

**✅ Successful Payments:**
- `4242 4242 4242 4242` - Standard Visa
- `4000 0566 5566 5556` - Visa Debit
- `5555 5555 5555 4444` - Mastercard

**❌ Test Failures:**
- `4000 0000 0000 0002` - Card Declined
- `4000 0000 0000 9995` - Insufficient Funds
- `4000 0000 0000 0069` - Expired Card

### 🚨 **Troubleshooting Guide**

**If checkout doesn't load:**
1. Check browser console for errors
2. Verify Stripe publishable key in .env.local
3. Check network tab for failed API calls

**If payment processing fails:**
1. Verify backend environment variables
2. Check CloudWatch logs for backend errors
3. Confirm Price IDs match Stripe products

**If redirects fail:**
1. Check success page exists at /success
2. Verify return URLs in Stripe configuration

### 📊 **Success Criteria**

✅ **All Tests Pass If:**
- Pricing page loads without errors
- Payment buttons are functional
- Stripe Checkout opens correctly
- Test payments process successfully
- Users are redirected after payment
- Payments appear in Stripe Dashboard
- No console errors during flow

### 🎉 **Next Steps After Testing**

Once manual testing is successful:
1. Set up webhook endpoints for payment events
2. Configure user subscription management
3. Add email notifications for payments
4. Implement subscription cancellation
5. Deploy to production environment

---

**Ready to start testing!** 🚀
**Primary test URL**: http://localhost:3001/pricing