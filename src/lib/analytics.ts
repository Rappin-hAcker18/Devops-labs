// Analytics service for tracking user behavior and course progress
'use client';

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  courseId?: string;
  lessonId?: string;
  timestamp?: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

interface UserProperties {
  userId: string;
  email?: string;
  tier?: 'free' | 'standard' | 'premium';
  registrationDate?: string;
  lastActiveDate?: string;
  totalCoursesEnrolled?: number;
  totalLessonsCompleted?: number;
  totalTimeSpent?: number;
}

interface CourseAnalytics {
  courseId: string;
  courseName: string;
  enrollmentDate: string;
  lastAccessedDate: string;
  progressPercentage: number;
  lessonsCompleted: number;
  totalLessons: number;
  timeSpentMinutes: number;
  completionDate?: string;
  certificateIssued?: boolean;
}

class AnalyticsService {
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean;
  private eventQueue: AnalyticsEvent[] = [];
  private isOnline: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = typeof window !== 'undefined';
    
    if (this.isEnabled) {
      this.initializeAnalytics();
      this.setupOfflineHandling();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeAnalytics() {
    // Initialize Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    // Set up event listeners for automatic tracking
    this.setupAutomaticTracking();
  }

  private setupOfflineHandling() {
    if (typeof window === 'undefined') return;

    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushOfflineEvents();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private setupAutomaticTracking() {
    if (typeof window === 'undefined') return;

    // Track page views
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      analytics.trackPageView();
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      analytics.trackPageView();
    };

    window.addEventListener('popstate', () => {
      analytics.trackPageView();
    });

    // Track session duration
    let sessionStart = Date.now();
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - sessionStart;
      analytics.trackEvent({
        event: 'session_end',
        category: 'engagement',
        action: 'session_duration',
        value: Math.floor(sessionDuration / 1000), // Convert to seconds
      });
    });

    // Track user engagement
    let lastActivity = Date.now();
    const activityEvents = ['click', 'scroll', 'keypress', 'mousemove'];
    
    const updateActivity = () => {
      lastActivity = Date.now();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check for inactivity every 5 minutes (reduced frequency)
    setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > 300000) { // 5 minutes of inactivity (reduced from 30 seconds)
        this.trackEvent({
          event: 'user_inactive',
          category: 'engagement',
          action: 'inactivity',
          value: Math.floor(inactiveTime / 1000),
        });
      }
    }, 300000); // Check every 5 minutes instead of 30 seconds
  }

  setUserId(userId: string) {
    this.userId = userId;
    
    // Set user ID in Google Analytics
    if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        user_id: userId,
      });
    }
  }

  setUserProperties(properties: UserProperties) {
    // Send user properties to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', {
        user_properties: {
          tier: properties.tier,
          registration_date: properties.registrationDate,
          total_courses: properties.totalCoursesEnrolled,
          total_lessons: properties.totalLessonsCompleted,
        }
      });
    }

    // Store user properties locally
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_analytics_properties', JSON.stringify(properties));
    }
  }

  trackEvent(event: Omit<AnalyticsEvent, 'sessionId' | 'timestamp'>) {
    // Skip if event is invalid or empty
    if (!event || !event.event || !event.category || !event.action) {
      console.warn('Invalid analytics event skipped:', event);
      return;
    }

    const fullEvent: AnalyticsEvent = {
      ...event,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      userId: this.userId,
    };

    // Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameters: {
          course_id: event.courseId,
          lesson_id: event.lessonId,
          user_id: this.userId,
          ...event.metadata,
        },
      });
    }

    // Store event for our own analytics
    if (this.isOnline) {
      this.sendEventToBackend(fullEvent);
    } else {
      this.eventQueue.push(fullEvent);
      this.storeEventOffline(fullEvent);
    }
  }

  trackPageView(path?: string) {
    const page = path || (typeof window !== 'undefined' ? window.location.pathname : '');
    
    this.trackEvent({
      event: 'page_view',
      category: 'navigation',
      action: 'page_view',
      label: page,
    });

    // Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: page,
      });
    }
  }

  trackCourseEnrollment(courseId: string, courseName: string, tier: string) {
    this.trackEvent({
      event: 'course_enrollment',
      category: 'course',
      action: 'enroll',
      label: courseName,
      courseId,
      metadata: { tier },
    });
  }

  trackLessonStart(courseId: string, lessonId: string, lessonTitle: string) {
    this.trackEvent({
      event: 'lesson_start',
      category: 'learning',
      action: 'lesson_start',
      label: lessonTitle,
      courseId,
      lessonId,
    });
  }

  trackLessonComplete(courseId: string, lessonId: string, lessonTitle: string, timeSpentSeconds: number) {
    this.trackEvent({
      event: 'lesson_complete',
      category: 'learning',
      action: 'lesson_complete',
      label: lessonTitle,
      value: timeSpentSeconds,
      courseId,
      lessonId,
    });
  }

  trackVideoProgress(courseId: string, lessonId: string, progress: number, duration: number) {
    // Only track at 25%, 50%, 75%, and 100% completion
    const milestones = [0.25, 0.5, 0.75, 1.0];
    const currentMilestone = milestones.find(m => progress >= m && progress < m + 0.1);
    
    if (currentMilestone) {
      this.trackEvent({
        event: 'video_progress',
        category: 'learning',
        action: 'video_milestone',
        label: `${Math.round(currentMilestone * 100)}%`,
        value: Math.round(progress * duration),
        courseId,
        lessonId,
        metadata: {
          milestone: currentMilestone,
          total_duration: duration,
        },
      });
    }
  }

  trackQuizAttempt(courseId: string, lessonId: string, score: number, maxScore: number) {
    this.trackEvent({
      event: 'quiz_attempt',
      category: 'assessment',
      action: 'quiz_complete',
      label: `${score}/${maxScore}`,
      value: Math.round((score / maxScore) * 100),
      courseId,
      lessonId,
      metadata: {
        score,
        max_score: maxScore,
        percentage: Math.round((score / maxScore) * 100),
      },
    });
  }

  trackCourseCompletion(courseId: string, courseName: string, timeSpentMinutes: number) {
    this.trackEvent({
      event: 'course_complete',
      category: 'achievement',
      action: 'course_complete',
      label: courseName,
      value: timeSpentMinutes,
      courseId,
    });
  }

  trackCertificateDownload(courseId: string, courseName: string) {
    this.trackEvent({
      event: 'certificate_download',
      category: 'achievement',
      action: 'certificate_download',
      label: courseName,
      courseId,
    });
  }

  trackPayment(tier: string, amount: number, currency: string = 'USD') {
    this.trackEvent({
      event: 'purchase',
      category: 'ecommerce',
      action: 'payment_success',
      label: tier,
      value: amount,
      metadata: {
        currency,
        tier,
      },
    });

    // Send purchase event to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: `${Date.now()}_${this.userId}`,
        value: amount,
        currency: currency,
        items: [{
          item_id: tier,
          item_name: `CloudCrew Academy ${tier} Tier`,
          category: 'subscription',
          quantity: 1,
          price: amount,
        }],
      });
    }
  }

  trackSearch(query: string, results: number) {
    this.trackEvent({
      event: 'search',
      category: 'search',
      action: 'search_query',
      label: query,
      value: results,
      metadata: {
        query,
        results_count: results,
      },
    });
  }

  trackError(error: string, context: string) {
    this.trackEvent({
      event: 'error',
      category: 'error',
      action: 'javascript_error',
      label: error,
      metadata: {
        error_message: error,
        context,
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : '',
        url: typeof window !== 'undefined' ? window.location.href : '',
      },
    });
  }

  private async sendEventToBackend(event: AnalyticsEvent) {
    try {
      // Validate event before sending
      if (!event || !event.event || !event.category || !event.action) {
        console.warn('Invalid event not sent to backend:', event);
        return;
      }

      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send analytics event:', error);
      // Store in offline queue for retry
      this.eventQueue.push(event);
      this.storeEventOffline(event);
    }
  }

  private storeEventOffline(event: AnalyticsEvent) {
    if (typeof window === 'undefined') return;

    try {
      const offlineEvents = JSON.parse(localStorage.getItem('offline_analytics_events') || '[]');
      offlineEvents.push(event);
      
      // Keep only last 1000 events to prevent storage overflow
      if (offlineEvents.length > 1000) {
        offlineEvents.splice(0, offlineEvents.length - 1000);
      }
      
      localStorage.setItem('offline_analytics_events', JSON.stringify(offlineEvents));
    } catch (error) {
      console.error('Failed to store offline analytics event:', error);
    }
  }

  private async flushOfflineEvents() {
    if (typeof window === 'undefined') return;

    try {
      const offlineEvents = JSON.parse(localStorage.getItem('offline_analytics_events') || '[]');
      
      if (offlineEvents.length === 0) return;

      // Send events in batches of 10
      const batchSize = 10;
      for (let i = 0; i < offlineEvents.length; i += batchSize) {
        const batch = offlineEvents.slice(i, i + batchSize);
        
        try {
          await fetch('/api/analytics/events/batch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ events: batch }),
          });
        } catch (error) {
          console.error('Failed to send batch analytics events:', error);
          break; // Stop sending if network fails
        }
      }

      // Clear offline events after successful sync
      localStorage.removeItem('offline_analytics_events');
    } catch (error) {
      console.error('Failed to flush offline analytics events:', error);
    }
  }

  // Get analytics dashboard data
  async getDashboardData(): Promise<any> {
    try {
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get dashboard data:', error);
      return null;
    }
  }

  // Export user data (for GDPR compliance)
  async exportUserData(): Promise<any> {
    try {
      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: this.userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to export user data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to export user data:', error);
      return null;
    }
  }

  // Delete user data (for GDPR compliance)
  async deleteUserData(): Promise<boolean> {
    try {
      const response = await fetch('/api/analytics/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: this.userId }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to delete user data:', error);
      return false;
    }
  }
}

// Global analytics instance
const analytics = new AnalyticsService();

export default analytics;
export type { AnalyticsEvent, UserProperties, CourseAnalytics };