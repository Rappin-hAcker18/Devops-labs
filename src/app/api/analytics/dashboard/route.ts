import { NextRequest, NextResponse } from 'next/server';

// Mock dashboard data for testing
const mockDashboardData = {
  totalUsers: 1247,
  activeUsers: 342,
  courseCompletions: 89,
  totalRevenue: 12450,
  userGrowth: [
    { date: '2024-01-01', users: 100 },
    { date: '2024-01-15', users: 250 },
    { date: '2024-02-01', users: 400 },
    { date: '2024-02-15', users: 650 },
    { date: '2024-03-01', users: 890 },
    { date: '2024-03-15', users: 1247 },
  ],
  courseProgress: [
    { courseId: 'aws-fundamentals', courseName: 'AWS Fundamentals', enrollments: 456, completions: 89 },
    { courseId: 'serverless-architecture', courseName: 'Serverless Architecture', enrollments: 234, completions: 45 },
    { courseId: 'cloud-security', courseName: 'Cloud Security', enrollments: 123, completions: 23 },
  ],
  userEngagement: [
    { date: '2024-03-01', sessions: 234, duration: 45 },
    { date: '2024-03-02', sessions: 267, duration: 52 },
    { date: '2024-03-03', sessions: 189, duration: 38 },
    { date: '2024-03-04', sessions: 312, duration: 67 },
    { date: '2024-03-05', sessions: 298, duration: 58 },
    { date: '2024-03-06', sessions: 234, duration: 43 },
    { date: '2024-03-07', sessions: 276, duration: 49 },
  ],
  revenueByTier: [
    { tier: 'Free', revenue: 0, users: 847 },
    { tier: 'Standard', revenue: 4980, users: 332 },
    { tier: 'Premium', revenue: 7470, users: 68 },
  ],
  topCourses: [
    { courseId: 'aws-fundamentals', courseName: 'AWS Fundamentals', enrollments: 456, rating: 4.8 },
    { courseId: 'serverless-architecture', courseName: 'Serverless Architecture', enrollments: 234, rating: 4.6 },
    { courseId: 'cloud-security', courseName: 'Cloud Security', enrollments: 123, rating: 4.9 },
  ],
  userRetention: [
    { week: 1, retention: 100 },
    { week: 2, retention: 75 },
    { week: 3, retention: 62 },
    { week: 4, retention: 54 },
    { week: 8, retention: 45 },
    { week: 12, retention: 38 },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    
    console.log('📊 Dashboard data requested for time range:', timeRange);
    
    return NextResponse.json(mockDashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}