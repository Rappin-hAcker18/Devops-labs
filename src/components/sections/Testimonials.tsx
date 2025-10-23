"use client";

import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Marcus Johnson",
    role: "Cloud Engineer at AWS",
    location: "Atlanta, GA",
    image: "/avatars/marcus.jpg",
    rating: 5,
    quote: "CloudCrew changed my life. Went from working retail to landing a $95K cloud engineering job in 8 months. The community support was everything."
  },
  {
    name: "Priya Patel",
    role: "DevOps Engineer at Microsoft",
    location: "Chicago, IL", 
    image: "/avatars/priya.jpg",
    rating: 5,
    quote: "The hands-on AWS labs were incredible. I built real projects that I still show in interviews. The mobile app let me learn during my commute."
  },
  {
    name: "Jamal Williams",
    role: "Solutions Architect at Spotify",
    location: "Brooklyn, NY",
    image: "/avatars/jamal.jpg",
    rating: 5,
    quote: "Coming from a non-tech background, I was nervous. But the mentorship program connected me with someone who looked like me and understood my journey."
  },
  {
    name: "Isabella Rodriguez",
    role: "Cloud Security Engineer at Netflix",
    location: "Los Angeles, CA",
    image: "/avatars/isabella.jpg",
    rating: 5,
    quote: "The career coaching was next level. They helped me negotiate my salary and I ended up making $20K more than I expected. Worth every penny."
  }
];

export function Testimonials() {
  return (
    <section className="section-padding bg-background-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            <span className="gradient-text">Real Stories</span> from Real People
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            See how CloudCrew is transforming careers in urban communities across the country.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card space-y-6 hover:urban-glow transition-all duration-300"
            >
              {/* Quote */}
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-primary-400 opacity-60" />
                <p className="text-text leading-relaxed text-lg">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-urban-gradient flex items-center justify-center text-white font-display font-bold text-lg">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-text">{testimonial.name}</h4>
                  <p className="text-text-secondary text-sm">{testimonial.role}</p>
                  <p className="text-text-muted text-xs">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-display font-bold gradient-text">95%</div>
            <div className="text-text-secondary text-sm">Job Placement Rate</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-display font-bold gradient-text">$85K</div>
            <div className="text-text-secondary text-sm">Average Starting Salary</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-display font-bold gradient-text">6 Months</div>
            <div className="text-text-secondary text-sm">Average Time to Hire</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-display font-bold gradient-text">4.9/5</div>
            <div className="text-text-secondary text-sm">Student Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}