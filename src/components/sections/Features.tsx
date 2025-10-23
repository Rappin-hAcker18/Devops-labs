"use client";

import React from 'react';
import { Cloud, Code, Users, Award, Smartphone, Zap } from 'lucide-react';

const features = [
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Real AWS Experience",
    description: "Learn on actual AWS infrastructure with hands-on labs and real-world scenarios."
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Project-Based Learning",
    description: "Build portfolio-worthy projects that showcase your cloud engineering skills to employers."
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Urban Community",
    description: "Connect with fellow learners from urban communities nationwide for support and networking."
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Industry Certification",
    description: "Earn recognized certifications that validate your skills with top tech employers."
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Mobile-First Design",
    description: "Learn on-the-go with our mobile-optimized platform designed for busy urban professionals."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Fast-Track Career",
    description: "Get job-ready in months, not years, with our accelerated learning approach."
  }
];

export function Features() {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            Why <span className="gradient-text">CloudCrew</span> Works
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            We understand the urban hustle. Our platform is built specifically for people who need to learn fast, learn real skills, and get hired.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card group hover:urban-glow transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="inline-flex p-3 bg-primary-500/20 rounded-lg group-hover:bg-primary-500/30 transition-colors duration-300">
                  <div className="text-primary-400">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-display font-semibold text-text group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-6 py-3 text-primary-300 text-sm font-medium">
            <Zap className="w-4 h-4" />
            Join 10,000+ students already building their cloud careers
          </div>
        </div>
      </div>
    </section>
  );
}