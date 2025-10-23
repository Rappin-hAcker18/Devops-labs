'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Check initial status
    setIsOnline(navigator.onLine);

    // Listen for connectivity changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const retryConnection = () => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      alert('Please check your internet connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="mx-auto w-32 h-32 mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              />
            </svg>
          </div>
        </div>

        {/* Status Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            {isOnline ? 'Connection Restored!' : 'You&apos;re Offline'}
          </h1>
          
          {isOnline ? (
            <p className="text-gray-300 text-lg mb-6">
              Great! Your internet connection is back. Click below to continue your learning journey.
            </p>
          ) : (
            <p className="text-gray-300 text-lg mb-6">
              No worries! You can still access some content while offline. 
              Your progress will sync when you&apos;re back online.
            </p>
          )}
        </div>

        {/* Connection Status Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div 
              className={`w-3 h-3 rounded-full ${
                isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
            ></div>
            <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={retryConnection}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              isOnline
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isOnline ? 'Continue Learning' : 'Retry Connection'}
          </button>

          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Or explore offline content:</p>
            
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/courses"
                className="py-2 px-4 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors text-sm"
              >
                📚 Courses
              </Link>
              
              <Link
                href="/dashboard"
                className="py-2 px-4 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors text-sm"
              >
                📊 Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Offline Features */}
        {!isOnline && (
          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Available Offline:</h3>
            <ul className="text-gray-300 text-sm space-y-2 text-left">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Downloaded course materials
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Previously viewed video content
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Course notes and resources
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Progress tracking (syncs when online)
              </li>
            </ul>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 text-xs text-gray-500">
          <p>💡 Tip: Download courses while connected to access them offline</p>
        </div>
      </div>
    </div>
  );
}