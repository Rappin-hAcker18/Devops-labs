/**
 * Demo subscription and access control for CloudCrew Academy
 * In a real app, this would be connected to Stripe and AWS Cognito
 */

export type SubscriptionTier = 'free' | 'standard' | 'premium';

export interface UserAccess {
  tier: SubscriptionTier;
  canAccessCourse: (courseId: string) => boolean;
  canAccessLesson: (lessonId: string, moduleIndex: number) => boolean;
  canAccessFeature: (feature: string) => boolean;
}

export async function fetchUserTier(): Promise<SubscriptionTier> {
  try {
    const token = localStorage.getItem('idToken');
    if (!token) return 'free';

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch user tier');
      return 'free';
    }

    const data = await response.json();
    const tier = data.subscriptionTier || 'free';
    
    // Cache in localStorage for quick access
    localStorage.setItem('subscriptionTier', tier);
    
    return tier as SubscriptionTier;
  } catch (error) {
    console.error('Error fetching user tier:', error);
    return 'free';
  }
}

export function getUserAccess(): UserAccess {
  // Get tier from localStorage (synced with backend)
  const tier = (typeof window !== 'undefined' 
    ? (localStorage.getItem('subscriptionTier') as SubscriptionTier) 
    : 'free') || 'free';
  
  return {
    tier,
    
    canAccessCourse: (courseId: string) => {
      // Free tier can access AWS Fundamentals
      if (tier === 'free') {
        return courseId === 'aws-fundamentals';
      }
      
      // Standard and Premium can access all courses
      return true;
    },
    
    canAccessLesson: (lessonId: string, moduleIndex: number) => {
      if (tier === 'free') {
        // Free tier can access first 2 modules (introduction content)
        return moduleIndex < 2;
      }
      
      if (tier === 'standard') {
        // Standard can access all lessons
        return true;
      }
      
      if (tier === 'premium') {
        // Premium can access everything
        return true;
      }
      
      return false;
    },
    
    canAccessFeature: (feature: string) => {
      const freeFeatures = ['courses', 'lessons', 'progress', 'analytics'];
      const standardFeatures = [...freeFeatures, 'certificates', 'downloadables'];
      const premiumFeatures = [...standardFeatures, 'mentoring', 'career-services', 'priority-support'];
      
      if (tier === 'free') {
        return freeFeatures.includes(feature);
      }
      
      if (tier === 'standard') {
        return standardFeatures.includes(feature);
      }
      
      if (tier === 'premium') {
        return premiumFeatures.includes(feature);
      }
      
      return false;
    }
  };
}

export function isAuthenticated(): boolean {
  // Only check localStorage on client side
  if (typeof window === 'undefined') {
    return false; // Server-side, assume not authenticated
  }
  return !!localStorage.getItem('authToken');
}

export function requireAuth(): boolean {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return false;
  }
  return true;
}

export function upgradeTier(newTier: SubscriptionTier) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('subscriptionTier', newTier);
  }
  // In a real app, this would trigger a Stripe checkout
  console.log(`Upgraded to ${newTier} tier`);
}