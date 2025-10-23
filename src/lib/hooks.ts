"use client";

import { useState, useEffect, useCallback } from 'react';
import { api, User, CourseProgress, Enrollment, ApiResponse } from './api';

// Auth hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Mock authentication check for development
      const token = localStorage.getItem('authToken');
      if (token) {
        const mockUser: User = {
          userId: 'demo-user-123',
          email: 'demo@cloudcrew.academy',
          firstName: 'Demo',
          lastName: 'User',
          subscriptionTier: 'free',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          profile: {
            totalStudyHours: 24,
            overallProgress: 0.68
          }
        };
        setUser(mockUser);
      }
    } catch (err) {
      setError('Failed to check authentication status');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock login for development
      if (email && password.length >= 6) {
        const mockToken = 'mock-auth-token-' + Date.now();
        localStorage.setItem('authToken', mockToken);
        await checkAuthStatus();
        return { success: true };
      } else {
        setError('Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (err) {
      const errorMessage = 'Login failed - please try again';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    tier?: 'free' | 'standard' | 'premium';
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock registration for development
      if (userData.email && userData.password && userData.firstName && userData.lastName) {
        const mockToken = 'mock-auth-token-' + Date.now();
        localStorage.setItem('authToken', mockToken);
        await checkAuthStatus();
        return { success: true };
      } else {
        setError('All fields are required');
        return { success: false, error: 'All fields are required' };
      }
    } catch (err) {
      const errorMessage = 'Registration failed - please try again';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setError(null);
  };

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };
}

// Course progress hook
export function useCourseProgress(courseId: string) {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    try {
      const response = await api.getCourseProgress(courseId);
      if (response.data) {
        setProgress(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to load course progress');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchProgress();
    }
  }, [courseId, fetchProgress]);

  const updateProgress = async (lessonId: string, completed: boolean, timeSpent?: number) => {
    try {
      const response = await api.updateCourseProgress(courseId, {
        lessonId,
        completed,
        timeSpent,
      });
      
      if (response.data) {
        setProgress(response.data);
        
        // Track analytics
        if (completed) {
          api.trackLessonCompletion(courseId, lessonId, timeSpent || 0);
        } else {
          api.trackLessonView(courseId, lessonId);
        }
        
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to update progress' };
    }
  };

  return {
    progress,
    isLoading,
    error,
    updateProgress,
    refetch: fetchProgress,
  };
}

// User enrollments hook
export function useUserEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.getUserEnrollments();
      if (response.data) {
        setEnrollments(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to load enrollments');
    } finally {
      setIsLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string, tier: 'free' | 'standard' | 'premium') => {
    try {
      const response = await api.enrollInCourse(courseId, tier);
      if (response.data) {
        setEnrollments(prev => [...prev, response.data!]);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to enroll in course' };
    }
  };

  return {
    enrollments,
    isLoading,
    error,
    enrollInCourse,
    refetch: fetchEnrollments,
  };
}

// Dashboard data hook with mock data
export function useDashboard() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [recentProgress, setRecentProgress] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock dashboard data for development
    setTimeout(() => {
      const mockEnrollments = [
        {
          courseId: 'aws-fundamentals',
          courseTitle: 'AWS Cloud Fundamentals',
          progressPercentage: 75,
          timeSpent: 12
        },
        {
          courseId: 'docker-containers',
          courseTitle: 'Docker & Containerization', 
          progressPercentage: 45,
          timeSpent: 8
        },
        {
          courseId: 'kubernetes-basics',
          courseTitle: 'Kubernetes Essentials',
          progressPercentage: 20,
          timeSpent: 4
        }
      ];

      const mockAchievements = [
        {
          id: '1',
          title: 'First Course Started',
          description: 'Welcome to your cloud engineering journey!'
        },
        {
          id: '2', 
          title: 'AWS Certified',
          description: 'Completed AWS Fundamentals with flying colors'
        },
        {
          id: '3',
          title: 'Container Champion', 
          description: 'Mastered Docker containerization'
        }
      ];

      const mockRecommendations = [
        {
          id: '1',
          title: 'Advanced AWS Services',
          description: 'Dive deeper into Lambda, ECS, and more'
        },
        {
          id: '2',
          title: 'DevOps Pipeline Mastery',
          description: 'Learn CI/CD with GitHub Actions'
        }
      ];

      setEnrollments(mockEnrollments);
      setAchievements(mockAchievements);
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    enrollments,
    recentProgress,
    achievements,
    recommendations,
    isLoading,
    error,
    refetch: () => {}
  };
}

// Generic API hook for any endpoint
export function useAPI<T>(apiCall: () => Promise<ApiResponse<T>>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.data) {
        setData(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('API request failed');
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

// Subscription management hook
export function useSubscription() {
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await api.getSubscriptionStatus();
      if (response.data) {
        setSubscription(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to load subscription status');
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckoutSession = async (tier: 'standard' | 'premium') => {
    try {
      const response = await api.createCheckoutSession(tier);
      if (response.data) {
        // Redirect to Stripe checkout
        window.location.href = response.data.checkoutUrl;
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to create checkout session' };
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = await api.cancelSubscription();
      if (response.data) {
        await fetchSubscriptionStatus(); // Refresh status
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to cancel subscription' };
    }
  };

  return {
    subscription,
    isLoading,
    error,
    createCheckoutSession,
    cancelSubscription,
    refetch: fetchSubscriptionStatus,
  };
}