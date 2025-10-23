"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Check, CreditCard, Shield, Users } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const router = useRouter();

  const plans = {
    free: {
      name: "Free Tier",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for getting started",
      popular: false,
      features: [
        "Course previews and overviews",
        "Community forum access",
        "Basic learning resources",
        "Mobile-friendly platform"
      ]
    },
    standard: {
      name: "Standard",
      price: { monthly: 49, yearly: 490 },
      description: "Full course access for serious learners",
      popular: true,
      features: [
        "Complete course library access",
        "Hands-on AWS labs and exercises",
        "Downloadable resources and guides",
        "Email support",
        "Progress tracking and certificates",
        "Mobile offline capabilities"
      ]
    },
    premium: {
      name: "Premium", 
      price: { monthly: 149, yearly: 1490 },
      description: "Complete career transformation package",
      popular: false,
      features: [
        "Everything in Standard",
        "1-on-1 mentoring sessions (monthly)",
        "Career coaching and resume review",
        "Job placement assistance",
        "Industry networking events",
        "Priority support",
        "Advanced certification tracks"
      ]
    }
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans];
  const currentPrice = currentPlan.price[billingCycle];
  const yearlyDiscount = billingCycle === "yearly" ? Math.round(((currentPlan.price.monthly * 12) - currentPlan.price.yearly) / (currentPlan.price.monthly * 12) * 100) : 0;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      if (selectedPlan === "free") {
        // Free plan - no payment needed
        setTimeout(() => {
          router.push(`/success?plan=${selectedPlan}`);
        }, 1000);
        return;
      }

      // Simulate payment processing
      setTimeout(() => {
        router.push(`/success?plan=${selectedPlan}`);
      }, 2000);
      
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16 pb-20">
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-display font-bold text-dark-text-primary mb-4">
                Choose Your Learning Plan
              </h1>
              <p className="text-dark-text-secondary max-w-2xl mx-auto">
                Invest in your future with CloudCrew Academy. Start your cloud engineering career with the plan that fits your goals.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <div className="bg-dark-bg-secondary rounded-lg p-1 inline-flex">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    billingCycle === "monthly"
                      ? "bg-primary-500 text-white"
                      : "text-dark-text-secondary hover:text-dark-text-primary"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    billingCycle === "yearly"
                      ? "bg-primary-500 text-white"
                      : "text-dark-text-secondary hover:text-dark-text-primary"
                  }`}
                >
                  Yearly
                  <span className="ml-2 text-xs bg-success-500 text-white px-2 py-1 rounded">
                    Save {yearlyDiscount}%
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {Object.entries(plans).map(([planKey, plan]) => (
                <div
                  key={planKey}
                  className={`card cursor-pointer transition-all duration-300 relative ${
                    selectedPlan === planKey
                      ? "ring-2 ring-primary-400 bg-primary-500/10"
                      : "hover:border-primary-500/50"
                  } ${plan.popular ? "border-primary-400" : ""}`}
                  onClick={() => setSelectedPlan(planKey)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-urban-gradient text-white text-xs font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="font-display font-semibold text-dark-text-primary mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-dark-text-primary">
                        ${plan.price[billingCycle]}
                      </span>
                      {planKey !== "free" && (
                        <span className="text-dark-text-secondary">
                          /{billingCycle}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-dark-text-secondary">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-success-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-dark-text-secondary">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <div className={`w-4 h-4 rounded-full border-2 mx-auto ${
                      selectedPlan === planKey
                        ? "bg-primary-400 border-primary-400"
                        : "border-dark-border"
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Section */}
            <div className="max-w-md mx-auto">
              <div className="card">
                <h3 className="text-xl font-display font-semibold text-dark-text-primary mb-6">
                  Complete Your Purchase
                </h3>

                {/* Order Summary */}
                <div className="bg-dark-bg-secondary rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-dark-text-secondary">Plan</span>
                    <span className="text-dark-text-primary font-medium">
                      {currentPlan.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-dark-text-secondary">Billing</span>
                    <span className="text-dark-text-primary">
                      {billingCycle === "yearly" ? "Yearly" : "Monthly"}
                    </span>
                  </div>
                  {billingCycle === "yearly" && yearlyDiscount > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-success-400">Discount</span>
                      <span className="text-success-400">-{yearlyDiscount}%</span>
                    </div>
                  )}
                  <hr className="border-dark-border my-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-dark-text-primary font-semibold">Total</span>
                    <span className="text-2xl font-bold text-dark-text-primary">
                      ${currentPrice}
                      {selectedPlan !== "free" && (
                        <span className="text-sm font-normal text-dark-text-secondary">
                          /{billingCycle === "yearly" ? "year" : "month"}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Payment Form */}
                {selectedPlan !== "free" && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-dark-text-primary mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full pl-10 pr-4 py-3 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-text-primary mb-2">
                          Expiry
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-text-primary mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 mb-6 text-sm text-dark-text-secondary">
                  <Shield className="w-4 h-4" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-urban-gradient text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : selectedPlan === "free" ? (
                    "Start Free Account"
                  ) : (
                    `Complete Purchase - $${currentPrice}`
                  )}
                </button>

                {/* Money Back Guarantee */}
                {selectedPlan !== "free" && (
                  <p className="text-center text-sm text-dark-text-secondary mt-4">
                    30-day money-back guarantee. Cancel anytime.
                  </p>
                )}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center mt-12">
              <div className="flex items-center justify-center gap-8 text-dark-text-secondary">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Join 10,000+ students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Secure payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>30-day guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}