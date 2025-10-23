"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Zap, Book, Users, User, LogOut, BarChart3 } from 'lucide-react';
import { isAuthenticated, getUserAccess } from '@/lib/access';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [userTier, setUserTier] = useState<string>('free');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsAuth(isAuthenticated());
    if (isAuthenticated()) {
      const access = getUserAccess();
      setUserTier(access.tier);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('subscriptionTier');
      window.location.href = '/';
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CloudCrew</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
              <Book className="w-4 h-4" />
              Courses
            </Link>
            <Link href="/community" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Community
            </Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors duration-200">
              Pricing
            </Link>
            <Link href="/about" className="text-slate-300 hover:text-white transition-colors duration-200">
              About
            </Link>
            
            <div className="flex items-center space-x-3">
              {isAuth ? (
                <>
                  <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                      userTier === 'free' ? 'bg-yellow-500/20 text-yellow-400' :
                      userTier === 'standard' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {userTier}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition-colors duration-200">
                    Sign In
                  </Link>
                  <Link href="/signup" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-200">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300 hover:text-white transition-colors duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <Link href="/courses" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200">
                <Book className="w-4 h-4" />
                Courses
              </Link>
              <Link href="/community" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200">
                <Users className="w-4 h-4" />
                Community
              </Link>
              <Link href="/pricing" className="block text-slate-300 hover:text-white transition-colors duration-200">
                Pricing
              </Link>
              <Link href="/about" className="block text-slate-300 hover:text-white transition-colors duration-200">
                About
              </Link>
              
              {isAuth ? (
                <div className="pt-4 space-y-3 border-t border-slate-800">
                  <Link href="/dashboard" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200">
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                      userTier === 'free' ? 'bg-yellow-500/20 text-yellow-400' :
                      userTier === 'standard' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {userTier}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 space-y-3 border-t border-slate-800">
                  <Link href="/login" className="block w-full text-center px-4 py-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition-colors duration-200">
                    Sign In
                  </Link>
                  <Link href="/signup" className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-200">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}