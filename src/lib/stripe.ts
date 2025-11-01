import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('Stripe publishable key not found');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free Tier',
    price: 0,
    priceId: null,
    features: [
      'AWS Cloud Fundamentals course',
      'Basic community access',
      'Course completion certificates',
      'Mobile learning app',
      'Progress tracking'
    ],
    limits: {
      courses: ['aws-fundamentals'],
      supportLevel: 'community',
      downloadableResources: false
    },
    popular: false,
    description: 'Perfect for getting started with cloud engineering'
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    price: 49,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID || 'price_standard_placeholder',
    features: [
      'All Free Tier features',
      'Serverless Development course',
      'Hands-on labs and projects',
      'Code review and feedback',
      'Career guidance resources',
      'Priority community support',
      'Downloadable resources'
    ],
    limits: {
      courses: ['aws-fundamentals', 'serverless-development'],
      supportLevel: 'priority',
      downloadableResources: true
    },
    popular: true,
    description: 'Most popular choice for serious learners'
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 597,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || 'price_premium_placeholder',
    features: [
      'All Standard Tier features',
      'Cloud Architecture & DevOps course',
      '1-on-1 mentoring sessions',
      'Job placement assistance',
      'Resume and LinkedIn optimization',
      'Interview preparation',
      'Direct access to industry experts',
      'Lifetime course updates'
    ],
    limits: {
      courses: ['aws-fundamentals', 'serverless-development', 'cloud-architecture'],
      supportLevel: 'premium',
      downloadableResources: true,
      mentoring: true,
      careerServices: true
    },
    popular: false,
    description: 'Complete career transformation package'
  }
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;

// Payment Service Class
class StripePaymentService {
  private stripe: Promise<Stripe | null>;

  constructor() {
    this.stripe = getStripe();
  }

  // Create payment intent for one-time purchases
  async createPaymentIntent(amount: number, currency = 'usd', metadata = {}) {
    try {
      const response = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Create subscription checkout session
  async createSubscriptionCheckout(priceId: string, tier: SubscriptionTier, successUrl?: string, cancelUrl?: string) {
    try {
      console.log('Creating checkout session for tier:', tier);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          successUrl: successUrl || `${window.location.origin}/success?plan=${tier}`,
          cancelUrl: cancelUrl || `${window.location.origin}/pricing`,
        }),
      });

      console.log('Checkout response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Checkout error response:', errorData);
        throw new Error(errorData.error || `Failed to create checkout session (HTTP ${response.status})`);
      }

      const responseData = await response.json();
      console.log('Checkout response data:', responseData);
      
      const sessionId = responseData.sessionId || responseData.id;
      const checkoutUrl = responseData.checkoutUrl || responseData.url;
      
      // If we have a checkout URL, open it in the same tab
      if (checkoutUrl) {
        console.log('✅ Redirecting to Stripe checkout URL:', checkoutUrl);
        
        // Use window.location.assign for better compatibility
        try {
          window.location.assign(checkoutUrl);
          return;
        } catch (err) {
          console.error('Error redirecting to checkout:', err);
          // Fallback: try opening in new window
          window.open(checkoutUrl, '_self');
          return;
        }
      }
      
      // Otherwise use sessionId with Stripe.js
      if (!sessionId) {
        console.error('No sessionId or checkoutUrl in response:', responseData);
        throw new Error('Invalid response from checkout API - missing sessionId');
      }
      
      const stripe = await this.stripe;
      
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Process payment with Elements
  async processPayment(clientSecret: string, paymentMethodId: string) {
    try {
      const stripe = await this.stripe;
      
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const result = await stripe.confirmPayment({
        clientSecret,
        redirect: 'if_required',
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.paymentIntent;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Get subscription plan details
  getSubscriptionPlan(tier: SubscriptionTier) {
    return SUBSCRIPTION_PLANS[tier];
  }

  // Get all subscription plans
  getAllPlans() {
    return Object.values(SUBSCRIPTION_PLANS);
  }

  // Calculate savings compared to higher tiers
  calculateSavings(tier: SubscriptionTier) {
    const currentPlan = SUBSCRIPTION_PLANS[tier];
    const premiumPlan = SUBSCRIPTION_PLANS.premium;
    
    if (tier === 'premium') return 0;
    
    return premiumPlan.price - currentPlan.price;
  }

  // Check if user has access to specific course
  hasAccessToCourse(userTier: SubscriptionTier, courseId: string) {
    const plan = SUBSCRIPTION_PLANS[userTier];
    return (plan.limits.courses as readonly string[]).includes(courseId);
  }

  // Get feature comparison for pricing table
  getFeatureComparison() {
    return {
      features: [
        {
          name: 'AWS Fundamentals Course',
          free: true,
          standard: true,
          premium: true
        },
        {
          name: 'Serverless Development Course',
          free: false,
          standard: true,
          premium: true
        },
        {
          name: 'Cloud Architecture Course',
          free: false,
          standard: false,
          premium: true
        },
        {
          name: 'Hands-on Labs',
          free: false,
          standard: true,
          premium: true
        },
        {
          name: '1-on-1 Mentoring',
          free: false,
          standard: false,
          premium: true
        },
        {
          name: 'Job Placement Assistance',
          free: false,
          standard: false,
          premium: true
        },
        {
          name: 'Career Services',
          free: false,
          standard: false,
          premium: true
        },
        {
          name: 'Priority Support',
          free: false,
          standard: true,
          premium: true
        }
      ]
    };
  }
}

// Export singleton instance
export const stripeService = new StripePaymentService();
export default stripeService;
