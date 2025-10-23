"use client";

import React from 'react';
import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background-card border-t border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-urban-gradient rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">CloudCrew</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Empowering urban communities with cutting-edge cloud engineering skills for economic opportunity.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-text-secondary hover:text-primary-400 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary-400 transition-colors duration-200">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary-400 transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:hello@cloudcrew.academy" className="text-text-secondary hover:text-primary-400 transition-colors duration-200">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Learning */}
          <div>
            <h3 className="font-display font-semibold text-text mb-4">Learning</h3>
            <ul className="space-y-2">
              <li><Link href="/courses" className="text-text-secondary hover:text-text transition-colors duration-200">Courses</Link></li>
              <li><Link href="/labs" className="text-text-secondary hover:text-text transition-colors duration-200">Hands-on Labs</Link></li>
              <li><Link href="/certifications" className="text-text-secondary hover:text-text transition-colors duration-200">Certifications</Link></li>
              <li><Link href="/practice" className="text-text-secondary hover:text-text transition-colors duration-200">Practice Tests</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-display font-semibold text-text mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/community" className="text-text-secondary hover:text-text transition-colors duration-200">Discussion Forum</Link></li>
              <li><Link href="/mentorship" className="text-text-secondary hover:text-text transition-colors duration-200">Mentorship</Link></li>
              <li><Link href="/events" className="text-text-secondary hover:text-text transition-colors duration-200">Live Events</Link></li>
              <li><Link href="/success-stories" className="text-text-secondary hover:text-text transition-colors duration-200">Success Stories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-semibold text-text mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-text-secondary hover:text-text transition-colors duration-200">Help Center</Link></li>
              <li><Link href="/contact" className="text-text-secondary hover:text-text transition-colors duration-200">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-text-secondary hover:text-text transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-text-secondary hover:text-text transition-colors duration-200">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-text-secondary text-sm">
            © 2025 CloudCrew Academy. All rights reserved.
          </p>
          <p className="text-text-secondary text-sm mt-2 sm:mt-0">
            Built for the urban community 🏙️
          </p>
        </div>
      </div>
    </footer>
  );
}