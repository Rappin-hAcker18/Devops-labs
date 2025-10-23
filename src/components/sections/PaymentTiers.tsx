"use client";

import React from 'react';
import Link from 'next/link';
import { Check, Star, Crown, Zap } from 'lucide-react';

const tiers = [
  {
    name: "Free Starter",
    icon: <Zap className="w-6 h-6" />,
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with cloud engineering basics",
    features: [
      "Access to 3 introductory courses",
      "Basic community access",
      "Course completion certificates",
      "Mobile-optimized learning",
      "Email support"
    ],
    limitations: [
      "Limited hands-on labs",
      "No 1-on-1 mentoring",
      "No career services"
    ],
    cta: "Start Free",
    popular: false,
    color: "primary"
  },
  {
    name: "Standard Pro",
    icon: <Star className="w-6 h-6" />,
    price: "$49",
    period: "/month",
    description: "Full access to master cloud engineering with hands-on experience",
    features: [
      "Complete course library (15+ courses)",
      "Unlimited hands-on AWS labs",
      "Private community access",
      "Live coding sessions",
      "Project-based learning",
      "Industry-recognized certificates",
      "Priority support",
      "Mobile & desktop access",
      "Offline content download"
    ],
    limitations: [],
    cta: "Start 7-Day Trial",
    popular: true,
    color: "accent"
  },
  {
    name: "Premium Elite",
    icon: <Crown className="w-6 h-6" />,
    price: "$149",
    period: "/month",
    description: "Everything you need for career transformation with personal guidance",
    features: [
      "Everything in Standard Pro",
      "1-on-1 mentoring sessions (4/month)",
      "Personal career coaching",
      "Resume & portfolio review",
      "Interview preparation",
      "Job placement assistance",
      "Direct employer connections",
      "Exclusive networking events",
      "Custom learning path",
      "24/7 priority support"
    ],
    limitations: [],
    cta: "Get Elite Access",
    popular: false,
    color: "warning"
  }
];

export function PaymentTiers() {
  return (
    <section className="section-padding bg-background-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            <span className="gradient-text">Choose Your Path</span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            Start free, upgrade when ready. Every plan designed to get you hired in cloud engineering.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative card ${tier.popular ? 'ring-2 ring-accent-500 urban-glow scale-105' : ''} transition-all duration-300 hover:scale-105`}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-4">
                  <div className={`inline-flex p-3 rounded-lg ${
                    tier.color === 'primary' ? 'bg-primary-500/20 text-primary-400' :
                    tier.color === 'accent' ? 'bg-accent-500/20 text-accent-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {tier.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-display font-bold text-text">{tier.name}</h3>
                    <p className="text-text-secondary text-sm mt-1">{tier.description}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-bold gradient-text">{tier.price}</span>
                    <span className="text-text-secondary">{tier.period}</span>
                  </div>
                </div>

                {/* Features */}
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
                          <li key={idx} className="text-text-muted text-xs">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={`/signup?plan=${tier.name.toLowerCase().replace(' ', '-')}`}
                  className={`w-full ${
                    tier.popular ? 'btn-primary' : 'btn-outline'
                  } text-center`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-text-secondary text-sm">
            All plans include mobile access, progress tracking, and community support
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-text-muted">
            <span>✓ 30-day money-back guarantee</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Student discounts available</span>
          </div>
        </div>
      </div>
    </section>
  );
}