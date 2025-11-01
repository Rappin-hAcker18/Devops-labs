'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, AuthUser } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string }>;
  confirmSignUp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateSubscriptionTier: (tier: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const { user: currentUser, isAuthenticated: authenticated } = await authService.getCurrentUserSession();
      setUser(currentUser);
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.signIn({ email, password });
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Track login event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'login', {
            method: 'cognito'
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Sign in failed:', error);
      return { success: false, error: 'Sign in failed' };
    }
  };

  const signUp = async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      const result = await authService.signUp(userData);
      
      if (result.success) {
        // Track sign up event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'sign_up', {
            method: 'cognito'
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Sign up failed:', error);
      return { success: false, error: 'Sign up failed' };
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    try {
      const result = await authService.confirmSignUp(email, code);
      return result;
    } catch (error) {
      console.error('Confirmation failed:', error);
      return { success: false, error: 'Confirmation failed' };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
      
      // Track logout event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'logout');
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const updateSubscriptionTier = async (tier: string) => {
    try {
      const result = await authService.updateUserAttribute('custom:subscription_tier', tier);
      
      if (result.success && user) {
        setUser({ ...user, subscription_tier: tier });
        
        // Track subscription change
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'purchase', {
            transaction_id: `sub_${Date.now()}`,
            value: tier === 'premium' ? 597 : tier === 'standard' ? 297 : 0,
            currency: 'USD',
            items: [{
              item_id: `cloudcrew_${tier}`,
              item_name: `CloudCrew Academy ${tier} Subscription`,
              category: 'subscription',
              quantity: 1,
            }]
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Subscription update failed:', error);
      return { success: false, error: 'Subscription update failed' };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    confirmSignUp,
    signOut,
    updateSubscriptionTier,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for checking subscription access
export function useSubscriptionAccess() {
  const { user, isAuthenticated } = useAuth();
  
  const hasAccess = (requiredTier: 'free' | 'standard' | 'premium') => {
    if (!isAuthenticated || !user) return requiredTier === 'free';
    
    const userTier = user.subscription_tier || 'free';
    
    const tierLevels = {
      free: 0,
      standard: 1,
      premium: 2
    };
    
    return tierLevels[userTier as keyof typeof tierLevels] >= tierLevels[requiredTier];
  };
  
  return {
    user,
    isAuthenticated,
    hasAccess,
    currentTier: user?.subscription_tier || 'free'
  };
}