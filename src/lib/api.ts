// API client for CloudCrew Academy backend services
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://vhavj29513.execute-api.us-east-1.amazonaws.com/dev';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionTier: 'free' | 'standard' | 'premium';
  createdAt: string;
  lastLoginAt: string;
  profile?: {
    city?: string;
    phone?: string;
    bio?: string;
    totalStudyHours?: number;
    overallProgress?: number;
  };
}

interface CourseProgress {
  courseId: string;
  userId: string;
  progress: number;
  completedLessons: string[];
  timeSpent: number;
  lastAccessed: string;
  certificateEarned?: boolean;
}

interface Enrollment {
  userId: string;
  courseId: string;
  enrolledAt: string;
  tier: 'free' | 'standard' | 'premium';
  status: 'active' | 'completed' | 'paused';
}

class CloudCrewAPI {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Something went wrong' };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error - please try again' };
    }
  }

  // Authentication methods
  setAuthToken(token: string) {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearAuthToken() {
    this.authToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // User management
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile');
  }

  async updateUserProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async registerUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    tier?: 'free' | 'standard' | 'premium';
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async loginUser(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Course management
  async enrollInCourse(courseId: string, tier: 'free' | 'standard' | 'premium'): Promise<ApiResponse<Enrollment>> {
    return this.request<Enrollment>('/courses/enroll', {
      method: 'POST',
      body: JSON.stringify({ courseId, tier }),
    });
  }

  async getCourseProgress(courseId: string): Promise<ApiResponse<CourseProgress>> {
    return this.request<CourseProgress>(`/courses/${courseId}/progress`);
  }

  async updateCourseProgress(
    courseId: string,
    progressData: {
      lessonId: string;
      completed: boolean;
      timeSpent?: number;
    }
  ): Promise<ApiResponse<CourseProgress>> {
    return this.request<CourseProgress>(`/courses/${courseId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }

  async getUserEnrollments(): Promise<ApiResponse<Enrollment[]>> {
    return this.request<Enrollment[]>('/users/enrollments');
  }

  async getUserCourseProgress(): Promise<ApiResponse<CourseProgress[]>> {
    return this.request<CourseProgress[]>('/users/progress');
  }

  // Certificate generation
  async generateCertificate(courseId: string): Promise<ApiResponse<{
    certificateId: string;
    downloadUrl: string;
    credentialId: string;
  }>> {
    return this.request<{
      certificateId: string;
      downloadUrl: string;
      credentialId: string;
    }>(`/courses/${courseId}/certificate`, {
      method: 'POST',
    });
  }

  // Analytics and tracking
  async trackLessonView(courseId: string, lessonId: string): Promise<ApiResponse<void>> {
    return this.request<void>('/analytics/lesson-view', {
      method: 'POST',
      body: JSON.stringify({ courseId, lessonId }),
    });
  }

  async trackLessonCompletion(courseId: string, lessonId: string, timeSpent: number): Promise<ApiResponse<void>> {
    return this.request<void>('/analytics/lesson-completion', {
      method: 'POST',
      body: JSON.stringify({ courseId, lessonId, timeSpent }),
    });
  }

  // Payment and subscription management
  async createCheckoutSession(tier: 'standard' | 'premium'): Promise<ApiResponse<{ checkoutUrl: string }>> {
    return this.request<{ checkoutUrl: string }>('/payments/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ tier }),
    });
  }

  async cancelSubscription(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/payments/cancel-subscription', {
      method: 'POST',
    });
  }

  async getSubscriptionStatus(): Promise<ApiResponse<{
    tier: 'free' | 'standard' | 'premium';
    status: 'active' | 'cancelled' | 'past_due';
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  }>> {
    return this.request('/payments/subscription-status');
  }

  // Community features
  async getDiscussions(courseId?: string): Promise<ApiResponse<any[]>> {
    const endpoint = courseId ? `/community/discussions?courseId=${courseId}` : '/community/discussions';
    return this.request<any[]>(endpoint);
  }

  async createDiscussion(data: {
    title: string;
    content: string;
    courseId?: string;
    tags?: string[];
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/community/discussions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addDiscussionReply(discussionId: string, content: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/community/discussions/${discussionId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Dashboard data
  async getDashboardData(): Promise<ApiResponse<{
    user: User;
    enrollments: Enrollment[];
    progress: CourseProgress[];
    achievements: any[];
    recentActivity: any[];
    nextMilestones: any[];
  }>> {
    return this.request('/dashboard/data');
  }
}

// Export singleton instance
export const api = new CloudCrewAPI();

// Export types for use in components
export type {
  User,
  CourseProgress,
  Enrollment,
  ApiResponse,
};

// Development mode configuration
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Override API URL for local development
  const devAPI = new CloudCrewAPI('http://localhost:3000/dev');
  
  // Add development helpers
  (window as any).cloudCrewAPI = devAPI;
  console.log('🔧 Development mode: CloudCrew API client available as window.cloudCrewAPI');
}