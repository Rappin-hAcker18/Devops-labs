'use client';

/* eslint-disable @next/next/no-css-tags */
/* eslint-disable react/no-unknown-property */

import { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import analytics from '@/lib/analytics';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  courseCompletions: number;
  totalRevenue: number;
  userGrowth: { date: string; users: number }[];
  courseProgress: { courseId: string; courseName: string; enrollments: number; completions: number }[];
  userEngagement: { date: string; sessions: number; duration: number }[];
  revenueByTier: { tier: string; revenue: number; users: number }[];
  topCourses: { courseId: string; courseName: string; enrollments: number; rating: number }[];
  userRetention: { week: number; retention: number }[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dashboardData = await analytics.getDashboardData();
        
        if (dashboardData) {
          setData(dashboardData);
        } else {
          // Mock data for development
          setData(getMockData());
        }
      } catch (err) {
        setError('Failed to load analytics data');
        // Use mock data as fallback
        setData(getMockData());
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dashboardData = await analytics.getDashboardData();
      
      if (dashboardData) {
        setData(dashboardData);
      } else {
        // Mock data for development
        setData(getMockData());
      }
    } catch (err) {
      setError('Failed to load analytics data');
      // Use mock data as fallback
      setData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = (): DashboardData => ({
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
  });

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error Loading Analytics</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button
              onClick={loadDashboardData}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Chart configurations
  const userGrowthData = {
    labels: data.userGrowth.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Users',
        data: data.userGrowth.map(d => d.users),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const courseProgressData = {
    labels: data.courseProgress.map(c => c.courseName),
    datasets: [
      {
        label: 'Enrollments',
        data: data.courseProgress.map(c => c.enrollments),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Completions',
        data: data.courseProgress.map(c => c.completions),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };

  const revenueData = {
    labels: data.revenueByTier.map(r => r.tier),
    datasets: [
      {
        data: data.revenueByTier.map(r => r.revenue),
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const engagementData = {
    labels: data.userEngagement.map(e => new Date(e.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Average Session Duration (min)',
        data: data.userEngagement.map(e => e.duration),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
      },
      {
        label: 'Daily Sessions',
        data: data.userEngagement.map(e => e.sessions),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            title="Select time range for analytics"
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{data.totalUsers.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">↗ +12% from last period</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="text-3xl font-bold text-gray-900">{data.activeUsers.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">↗ +8% from last period</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Course Completions</h3>
            <p className="text-3xl font-bold text-gray-900">{data.courseCompletions}</p>
            <p className="text-sm text-green-600 mt-1">↗ +15% from last period</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">${data.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">↗ +22% from last period</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <Line data={userGrowthData} options={{ responsive: true }} />
          </div>

          {/* Course Progress */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
            <Bar data={courseProgressData} options={{ responsive: true }} />
          </div>

          {/* Revenue by Tier */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Tier</h3>
            <Doughnut data={revenueData} options={{ responsive: true }} />
          </div>

          {/* User Engagement */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
            <Line data={engagementData} options={chartOptions} />
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Courses */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Courses</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Course</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">Enrollments</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topCourses.map((course) => (
                    <tr key={course.courseId} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-900">{course.courseName}</td>
                      <td className="py-3 text-sm text-gray-900 text-right">{course.enrollments}</td>
                      <td className="py-3 text-sm text-gray-900 text-right">
                        <span className="inline-flex items-center">
                          ⭐ {course.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Retention */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Retention</h3>
            <div className="space-y-3">
              {data.userRetention.map((retention) => (
                <div key={retention.week} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Week {retention.week}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2 relative">
                      <div
                        className={`bg-blue-600 h-2 rounded-full transition-all duration-500`}
                        data-width={retention.retention}
                        style={{ width: `${retention.retention}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {retention.retention}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}