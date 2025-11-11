'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isPWA);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for install prompt event (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Don't show if already dismissed
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed && !isPWA) {
        setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed
  if (isStandalone) return null;

  // iOS Install Instructions
  if (isIOS && showPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl animate-slide-up">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-4 pr-8">
            <Smartphone className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Install CloudCrew Academy</h3>
              <p className="text-sm mb-3 text-white/90">
                Install our app for the best mobile experience:
              </p>
              <ol className="text-sm space-y-1 text-white/90">
                <li>1. Tap the Share button <span className="inline-block">📤</span></li>
                <li>2. Scroll down and tap "Add to Home Screen"</li>
                <li>3. Tap "Add" to install</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Android/Chrome Install Prompt
  if (deferredPrompt && showPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl animate-slide-up">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-between gap-4 pr-8">
            <div className="flex items-center gap-4">
              <Download className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">Install CloudCrew Academy</h3>
                <p className="text-sm text-white/90">
                  Install our app for faster access and offline learning
                </p>
              </div>
            </div>
            <button
              onClick={handleInstallClick}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
