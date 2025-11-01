"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

export default function PricingTestPage() {
  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16 section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Pricing Test Page
          </h1>
          <p className="text-dark-text-secondary">
            This is a simplified test page to check if the basic layout works.
          </p>
          
          <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-dark-bg-card border border-dark-border-primary rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Standard Plan</h3>
              <p className="text-3xl font-bold text-primary mb-4">$297 <span className="text-sm text-dark-text-secondary">one-time</span></p>
              <button className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                Get Started
              </button>
            </div>
            
            <div className="bg-dark-bg-card border border-dark-border-primary rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Premium Plan</h3>
              <p className="text-3xl font-bold text-primary mb-4">$597 <span className="text-sm text-dark-text-secondary">one-time</span></p>
              <button className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}