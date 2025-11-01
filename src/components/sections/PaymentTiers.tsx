"use client";

import React, { useState, useEffect } from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { stripeService } from '@/lib/stripe';

type Tier = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limitations: string[];
  cta: string;
  popular: boolean;
  color: 'primary' | 'accent';
  icon: React.ReactNode;
};

const tiers: Tier[] = [
  {
    name: 'Free Starter',
    icon: <Zap className="w-6 h-6" />,
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with cloud engineering basics',
    features: [
      'Access to AWS Fundamentals',
      'Basic community access',
      'Course completion certificates',
      'Mobile-optimized learning',
      'Email support',
    ],
    limitations: [
      'Limited hands-on labs',
      'No 1-on-1 mentoring',
      'No career services',
    ],
    cta: 'Start Free',
    popular: false,
    color: 'primary',
  },
  {
    name: 'Pro (All Access)',
    icon: <Star className="w-6 h-6" />,
    price: '$49',
    period: '/ month',
    description:
      'Full access to master cloud engineering with hands-on experience',
    features: [
      'AWS Fundamentals course',
      'Serverless Architecture course',
      'Cloud Security Essentials course',
      'Hands-on AWS labs',
      'Private community access',
      'Live coding sessions',
      'Project-based learning',
      'Certificates of completion',
      'Priority support',
      'Mobile & desktop access',
    ],
    limitations: [],
    cta: 'Get Pro Access',
    popular: true,
    color: 'accent',
  },
];

export function PaymentTiers() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = async (tier: Tier) => {
    if (tier.price === '$0') {
      window.location.href = '/signup?plan=free';
      return;
    }

    try {
      setIsLoading(tier.name);

      const planId = 'standard';
      const priceId = process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID;

      if (!priceId) {
        throw new Error(
          'Stripe price ID missing (NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID)'
        );
      }

      await stripeService.createSubscriptionCheckout(priceId, planId);
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      alert(
        `Payment setup failed: ${errorMessage}\n\nPlease try again or contact support.`
      );
    } finally {
      setIsLoading(null);
    }
  };

  if (!mounted) {
    return (
      <section id="plans" className="section-padding bg-background-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
              <span className="gradient-text">Choose Your Path</span>
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
              Start free, upgrade when ready. Every plan designed to get you hired in cloud engineering.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="card-elevated animate-pulse h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="plans" className="section-padding bg-background-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            <span className="gradient-text">Choose Your Path</span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            Start free, upgrade when ready. Every plan designed to get you hired in cloud engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative card ${tier.popular ? 'ring-2 ring-accent-500 urban-glow scale-105' : ''} transition-all duration-300 hover:scale-105`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-4">
                  <div
                    className={`inline-flex p-3 rounded-lg ${
                      tier.color === 'primary'
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'bg-accent-500/20 text-accent-400'
                    }`}
                  >
                    {tier.icon}
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-bold text-text">{tier.name}</h3>
                    <p className="text-text-secondary text-sm mt-1">{tier.description}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-bold gradient-text">{tier.price}</span>
                    <span className="text-text-secondary text-sm">{tier.period}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.limitations.length > 0 && (
                    <div className="pt-4 border-t border-secondary-700">
                      <p className="text-text-muted text-xs mb-2">Not included:</p>
                      <ul className="space-y-1">
                        {tier.limitations.map((limitation, idx) => (
                          <li key={idx} className="text-text-muted text-xs">- {limitation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleGetStarted(tier)}
                  disabled={isLoading === tier.name}
                  className={`w-full ${tier.popular ? 'btn-primary' : 'btn-outline'} text-center disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading === tier.name ? 'Loading...' : tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-text-secondary text-sm">
            All plans include mobile access, progress tracking, and community support
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-text-muted">
            <span>- 30-day money-back guarantee</span>
            <span>- Cancel anytime</span>
            <span>- Student discounts available</span>
          </div>
        </div>
      </div>
    </section>
  );
}
