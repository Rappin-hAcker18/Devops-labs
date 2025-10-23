"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export function CTA() {
  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto text-center">
        <div className="card bg-urban-gradient p-12 space-y-8">
          {/* Icon */}
          <div className="inline-flex p-4 bg-white/20 rounded-2xl">
            <Zap className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Join thousands of urban professionals who've already made the leap into cloud engineering. Your future in tech starts today.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup" className="bg-white text-primary-600 hover:bg-white/90 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-lg">
              Start Learning Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link href="/demo" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg transition-all duration-200 text-lg">
              Book a Demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
            <span>✓ No credit card required</span>
            <span>✓ 7-day free trial</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}