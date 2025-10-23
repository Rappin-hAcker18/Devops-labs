"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, Gift, Users, Trophy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState("standard");

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam) setPlan(planParam);
  }, [searchParams]);

  const planDetails = {
    free: { name: "Free Tier", color: "text-success-400" },
    standard: { name: "Standard Plan", color: "text-primary-400" },
    premium: { name: "Premium Plan", color: "text-warning-400" }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.standard;

  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16 pb-20">
        <section className="section-padding">
          <div className="max-w-3xl mx-auto text-center">
            {/* Success Icon */}
            <div className="inline-flex p-6 bg-success-500/20 rounded-full mb-8">
              <CheckCircle className="w-16 h-16 text-success-400" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-display font-bold text-dark-text-primary mb-4">
              Welcome to CloudCrew Academy!
            </h1>
            <p className="text-lg text-dark-text-secondary mb-2">
              Your payment was successful and your account has been activated.
            </p>
            <p className={`text-xl font-semibold ${currentPlan.color} mb-8`}>
              {currentPlan.name} - Active Now
            </p>

            {/* What's Next */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="card text-center">
                <div className="inline-flex p-4 bg-primary-500/20 rounded-full mb-4">
                  <Gift className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="font-display font-semibold text-dark-text-primary mb-3">
                  Access Your Courses
                </h3>
                <p className="text-dark-text-secondary text-sm">
                  Start learning with our comprehensive cloud engineering curriculum
                </p>
              </div>

              <div className="card text-center">
                <div className="inline-flex p-4 bg-warning-500/20 rounded-full mb-4">
                  <Users className="w-8 h-8 text-warning-400" />
                </div>
                <h3 className="font-display font-semibold text-dark-text-primary mb-3">
                  Join the Community
                </h3>
                <p className="text-dark-text-secondary text-sm">
                  Connect with fellow urban professionals on the same journey
                </p>
              </div>

              <div className="card text-center">
                <div className="inline-flex p-4 bg-success-500/20 rounded-full mb-4">
                  <Trophy className="w-8 h-8 text-success-400" />
                </div>
                <h3 className="font-display font-semibold text-dark-text-primary mb-3">
                  Track Your Progress
                </h3>
                <p className="text-dark-text-secondary text-sm">
                  Monitor your advancement and earn achievements along the way
                </p>
              </div>
            </div>

            {/* Quick Start Tips */}
            <div className="bg-dark-bg-secondary rounded-lg p-8 mb-8 text-left">
              <h2 className="text-xl font-display font-semibold text-dark-text-primary mb-4">
                Quick Start Guide
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-dark-text-primary">Complete your profile</p>
                    <p className="text-sm text-dark-text-secondary">Help us personalize your learning experience</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-dark-text-primary">Start with AWS Fundamentals</p>
                    <p className="text-sm text-dark-text-secondary">Build a strong foundation in cloud computing</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-dark-text-primary">Join our Discord community</p>
                    <p className="text-sm text-dark-text-secondary">Get support and network with peers</p>
                  </div>
                </li>
                {plan === "premium" && (
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-warning-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-dark-text-primary">Schedule your first mentoring session</p>
                      <p className="text-sm text-dark-text-secondary">Book 1-on-1 time with our industry experts</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-urban-gradient text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push("/courses")}
                className="btn-outline"
              >
                Browse Courses
              </button>
            </div>

            {/* Contact Support */}
            <div className="mt-12 p-6 bg-dark-bg-secondary/50 rounded-lg border border-dark-border">
              <p className="text-dark-text-secondary mb-4">
                Need help getting started? Our support team is here for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@cloudcrew.academy"
                  className="text-primary-400 hover:text-primary-300 font-medium"
                >
                  Email Support
                </a>
                <span className="hidden sm:inline text-dark-text-muted">•</span>
                <a 
                  href="https://discord.gg/cloudcrew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 font-medium"
                >
                  Join Discord
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}