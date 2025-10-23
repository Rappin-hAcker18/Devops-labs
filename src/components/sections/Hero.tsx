"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Star, Users, Award } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Modern Dark Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Animated background elements with neon glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float neon-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float delay-75" />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-neon-cyan/10 rounded-full blur-2xl animate-float delay-100" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-8">
          {/* Badge with neon accent */}
          <div className="inline-flex items-center gap-2 bg-primary-500/30 border border-neon-cyan/40 rounded-full px-4 py-2 text-neon-cyan text-sm font-medium backdrop-blur-sm">
            <Star className="w-4 h-4" />
            #1 Urban Cloud Engineering Platform
          </div>

          {/* Main headline with modern gradients */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight">
            <span className="neon-text">Master Cloud Engineering</span>
            <br />
            <span className="text-dark-text-primary">Built for the Streets</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl lg:text-2xl text-dark-text-secondary max-w-3xl mx-auto leading-relaxed">
            Real cloud skills for real opportunities. Learn AWS, serverless architecture, and modern cloud practices through hands-on projects designed for urban professionals.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary-400">10K+</div>
              <div className="text-sm text-text-secondary">Students</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary-400">95%</div>
              <div className="text-sm text-text-secondary">Job Placement</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary-400">$85K</div>
              <div className="text-sm text-text-secondary">Avg Salary</div>
            </div>
          </div>

          {/* CTAs with modern buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup" className="btn-neon text-lg px-8 py-4">
              Start Learning Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <button className="flex items-center gap-3 text-dark-text-secondary hover:text-neon-cyan transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center group-hover:from-neon-cyan/30 group-hover:to-neon-purple/30 transition-all duration-300 backdrop-blur-sm border border-primary-500/30">
                <Play className="w-5 h-5 ml-1" />
              </div>
              <span className="text-lg font-medium">Watch Demo</span>
            </button>
          </div>

          {/* Social proof */}
          <div className="pt-8">
            <p className="text-text-secondary text-sm mb-4">Trusted by students from</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-text-secondary font-semibold">NYC</div>
              <div className="text-text-secondary font-semibold">Chicago</div>
              <div className="text-text-secondary font-semibold">Atlanta</div>
              <div className="text-text-secondary font-semibold">LA</div>
              <div className="text-text-secondary font-semibold">Houston</div>
            </div>
          </div>
        </div>

        {/* Feature cards preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="card text-left space-y-3">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-400" />
            </div>
            <h3 className="font-display font-semibold text-text">Community-Driven</h3>
            <p className="text-text-secondary text-sm">Learn alongside peers from your community with mentorship and support.</p>
          </div>

          <div className="card text-left space-y-3">
            <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-accent-400" />
            </div>
            <h3 className="font-display font-semibold text-text">Hands-On Learning</h3>
            <p className="text-text-secondary text-sm">Build real projects with AWS services, not just theory.</p>
          </div>

          <div className="card text-left space-y-3">
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-success" />
            </div>
            <h3 className="font-display font-semibold text-text">Career Ready</h3>
            <p className="text-text-secondary text-sm">Get job placement assistance and industry connections.</p>
          </div>
        </div>
      </div>
    </section>
  );
}