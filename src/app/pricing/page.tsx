"use client";

import { PaymentTiers } from "@/components/sections/PaymentTiers";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

const faqData = [
  {
    question: "Can I switch plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated."
  },
  {
    question: "Is there a student discount?",
    answer: "Absolutely! Students get 50% off the Pro plan with valid student ID verification."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and offer monthly or annual billing options."
  },
  {
    question: "Do you offer a money-back guarantee?",
    answer: "Yes, we offer a 30-day money-back guarantee on all paid plans, no questions asked."
  }
];

const comparisonFeatures = [
  { feature: "Course Access", free: "AWS Fundamentals", pro: "Full Cloud Engineering path" },
  { feature: "Hands-on Labs", free: "Guided demos", pro: "Unlimited AWS labs" },
  { feature: "Projects", free: "Intro projects", pro: "Career-ready capstones" },
  { feature: "Community", free: "Open forums", pro: "Private Discord + events" },
  { feature: "Mentorship", free: false, pro: "Weekly office hours" },
  { feature: "Career Coaching", free: false, pro: "Resume + interview prep" },
  { feature: "Certificates", free: "Course completion", pro: "Industry-recognized" },
  { feature: "Support", free: "Email", pro: "Priority response" }
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="section-padding bg-hero-gradient">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">Choose Your Plan</span>
            </h1>
            <p className="text-lg sm:text-xl text-dark-text-secondary max-w-3xl mx-auto mb-8">
              Start free, upgrade when ready. Every plan is designed to get you hired in cloud engineering.
            </p>
            
            {/* Pricing Toggle */}
            <div className="inline-flex items-center bg-dark-bg-card rounded-full p-1 mb-8">
              <button className="px-6 py-2 rounded-full bg-primary-500 text-white font-medium">
                Monthly
              </button>
              <button className="px-6 py-2 rounded-full text-dark-text-secondary font-medium">
                Annual <span className="text-neon-green text-sm">(Save 20%)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Payment Tiers */}
        <PaymentTiers />

        {/* Detailed Comparison */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center text-dark-text-primary mb-12">
              Feature Comparison
            </h2>
            
            <div className="card-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border-primary">
                      <th className="text-left py-4 px-6 font-display font-semibold text-dark-text-primary">Features</th>
                      <th className="text-center py-4 px-6 font-display font-semibold text-dark-text-primary">Free</th>
                      <th className="text-center py-4 px-6 font-display font-semibold text-dark-text-primary">Pro (All Access)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((item, index) => (
                      <tr key={index} className="border-b border-dark-border-primary/50">
                        <td className="py-4 px-6 font-medium text-dark-text-primary">{item.feature}</td>
                        <td className="py-4 px-6 text-center text-dark-text-secondary">
                          {typeof item.free === 'boolean' ? (
                            item.free ? <Check className="w-5 h-5 text-neon-green mx-auto" /> : <X className="w-5 h-5 text-error mx-auto" />
                          ) : (
                            item.free
                          )}
                        </td>
                        <td className="py-4 px-6 text-center text-dark-text-secondary">
                          {typeof item.pro === 'boolean' ? (
                            item.pro ? <Check className="w-5 h-5 text-neon-green mx-auto" /> : <X className="w-5 h-5 text-error mx-auto" />
                          ) : (
                            item.pro
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-dark-bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center text-dark-text-primary mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="card-elevated">
                  <h3 className="font-display font-semibold text-dark-text-primary mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-dark-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card bg-urban-gradient p-12">
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of urban professionals who&apos;ve made the leap into cloud engineering.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => router.push('/pricing#plans')}
                  className="bg-white text-primary-600 hover:bg-white/90 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                >
                  Get Pro Access
                </button>
                <button 
                  onClick={() => router.push('/contact')}
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                >
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}
