"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { 
  Video, 
  Users, 
  DollarSign, 
  TrendingUp, 
  BookOpen,
  Upload,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  BarChart3
} from "lucide-react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/access";

interface DashboardStats {
  totalUsers: number;
  totalEnrollments: number;
  totalRevenue: number;
  totalVideos: number;
  activeSubscriptions: number;
}

interface VideoMetadata {
  videoId: string;
  courseId: string;
  title: string;
  duration?: number;
  size?: number;
  uploadedAt: string;
  cloudFrontUrl?: string;
}

interface Enrollment {
  enrollmentId: string;
  userId: string;
  courseId: string;
  tier: string;
  enrolledAt: string;
  status: string;
  progress: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'users' | 'revenue'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    totalVideos: 0,
    activeSubscriptions: 0
  });
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Load admin data
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch videos
      const videosResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/metadata`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`
        }
      });
      
      let videosData: any[] = [];
      if (videosResponse.ok) {
        videosData = await videosResponse.json();
        setVideos(videosData || []);
      }

      // Fetch enrollments
      const enrollmentsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/enrollments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`
        }
      });

      let enrollmentsData: any[] = [];
      if (enrollmentsResponse.ok) {
        enrollmentsData = await enrollmentsResponse.json();
        setEnrollments(enrollmentsData || []);
      }

      // Calculate stats
      setStats({
        totalUsers: 1250, // Mock for now
        totalEnrollments: enrollmentsData?.length || 0,
        totalRevenue: 61250, // Mock for now
        totalVideos: videosData?.length || 0,
        activeSubscriptions: 437 // Mock for now
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      // TODO: Implement video deletion API
      alert('Video deletion not yet implemented');
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-dark-bg-primary">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
            <p className="text-dark-text-secondary">Loading admin dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16 pb-20">
        {/* Header */}
        <section className="section-padding bg-hero-gradient">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-display font-bold text-dark-text-primary mb-4">
              Admin Dashboard
            </h1>
            <p className="text-dark-text-secondary">
              Manage your CloudCrew Academy platform
            </p>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card-elevated">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-primary-400" />
                  <div className="bg-primary-500/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-primary-400" />
                  </div>
                </div>
                <p className="text-dark-text-muted text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-dark-text-primary">{stats.totalUsers.toLocaleString()}</p>
              </div>

              <div className="card-elevated">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="w-8 h-8 text-success-400" />
                  <div className="bg-success-500/20 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success-400" />
                  </div>
                </div>
                <p className="text-dark-text-muted text-sm mb-1">Active Enrollments</p>
                <p className="text-3xl font-bold text-dark-text-primary">{stats.totalEnrollments}</p>
              </div>

              <div className="card-elevated">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-warning-400" />
                  <div className="bg-warning-500/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-warning-400" />
                  </div>
                </div>
                <p className="text-dark-text-muted text-sm mb-1">Monthly Revenue</p>
                <p className="text-3xl font-bold text-dark-text-primary">{formatCurrency(stats.totalRevenue)}</p>
              </div>

              <div className="card-elevated">
                <div className="flex items-center justify-between mb-4">
                  <Video className="w-8 h-8 text-accent-400" />
                  <div className="bg-accent-500/20 p-2 rounded-lg">
                    <Upload className="w-5 h-5 text-accent-400" />
                  </div>
                </div>
                <p className="text-dark-text-muted text-sm mb-1">Total Videos</p>
                <p className="text-3xl font-bold text-dark-text-primary">{stats.totalVideos}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-dark-border mb-8">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'videos', label: 'Videos', icon: Video },
                  { id: 'users', label: 'Enrollments', icon: Users },
                  { id: 'revenue', label: 'Revenue', icon: DollarSign }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-primary-400 text-primary-400'
                        : 'border-transparent text-dark-text-muted hover:text-dark-text-secondary'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-xl font-semibold text-dark-text-primary mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-dark-border">
                      <CheckCircle className="w-5 h-5 text-success-400" />
                      <div className="flex-1">
                        <p className="text-dark-text-primary text-sm">New enrollment in Serverless Architecture</p>
                        <p className="text-dark-text-muted text-xs">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pb-3 border-b border-dark-border">
                      <Upload className="w-5 h-5 text-primary-400" />
                      <div className="flex-1">
                        <p className="text-dark-text-primary text-sm">Video uploaded to AWS Fundamentals</p>
                        <p className="text-dark-text-muted text-xs">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-warning-400" />
                      <div className="flex-1">
                        <p className="text-dark-text-primary text-sm">Payment received: $49.00</p>
                        <p className="text-dark-text-muted text-xs">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-dark-text-primary mb-4">Popular Courses</h3>
                  <div className="space-y-3">
                    {['AWS Fundamentals', 'Serverless Architecture', 'Cloud Security'].map((course, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-dark-text-secondary">{course}</span>
                        <span className="text-primary-400 font-semibold">{Math.floor(Math.random() * 500 + 200)} students</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'videos' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-dark-text-primary">Video Library</h3>
                  <button 
                    onClick={() => router.push('/admin/upload')}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Video
                  </button>
                </div>

                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-dark-bg-secondary">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-dark-text-primary">Title</th>
                          <th className="text-left py-3 px-4 font-semibold text-dark-text-primary">Course</th>
                          <th className="text-left py-3 px-4 font-semibold text-dark-text-primary">Upload Date</th>
                          <th className="text-right py-3 px-4 font-semibold text-dark-text-primary">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {videos.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center py-8 text-dark-text-muted">
                              No videos uploaded yet
                            </td>
                          </tr>
                        ) : (
                          videos.map((video) => (
                            <tr key={video.videoId} className="border-t border-dark-border">
                              <td className="py-3 px-4 text-dark-text-primary">{video.title || video.videoId}</td>
                              <td className="py-3 px-4 text-dark-text-secondary">{video.courseId}</td>
                              <td className="py-3 px-4 text-dark-text-secondary">{formatDate(video.uploadedAt)}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  {video.cloudFrontUrl && (
                                    <a
                                      href={video.cloudFrontUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 hover:bg-dark-bg-secondary rounded-lg transition-colors"
                                      title="View video"
                                    >
                                      <Eye className="w-4 h-4 text-primary-400" />
                                    </a>
                                  )}
                                  <button
                                    onClick={() => handleDeleteVideo(video.videoId)}
                                    className="p-2 hover:bg-dark-bg-secondary rounded-lg transition-colors"
                                    title="Delete video"
                                  >
                                    <Trash2 className="w-4 h-4 text-error" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h3 className="text-xl font-semibold text-dark-text-primary mb-6">User Enrollments</h3>
                
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-dark-bg-secondary">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-dark-text-primary">User</th>
                          <th className="text-left py-3 px-4 font-semibold text-dark-text-primary">Course</th>
                          <th className="text-left py-3 px-4 font-semibold text-dark-text-primary">Tier</th>
                          <th className="text-left py-3 px-4 font-semibold text-dark-text-primary">Progress</th>
                          <th className="text-left py-3 px-4 font-semibold text-dark-text-primary">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-dark-text-primary">Enrolled</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-dark-text-muted">
                              No enrollments found
                            </td>
                          </tr>
                        ) : (
                          enrollments.map((enrollment) => (
                            <tr key={enrollment.enrollmentId} className="border-t border-dark-border">
                              <td className="py-3 px-4 text-dark-text-primary">{enrollment.userId}</td>
                              <td className="py-3 px-4 text-dark-text-secondary">{enrollment.courseId}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  enrollment.tier === 'premium' ? 'bg-warning-500/20 text-warning-400' :
                                  enrollment.tier === 'standard' ? 'bg-primary-500/20 text-primary-400' :
                                  'bg-success-500/20 text-success-400'
                                }`}>
                                  {enrollment.tier}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-dark-text-secondary">{enrollment.progress}%</td>
                              <td className="py-3 px-4">
                                <span className={`flex items-center gap-1 ${
                                  enrollment.status === 'active' ? 'text-success-400' : 'text-dark-text-muted'
                                }`}>
                                  {enrollment.status === 'active' ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <XCircle className="w-4 h-4" />
                                  )}
                                  {enrollment.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-dark-text-secondary">{formatDate(enrollment.enrolledAt)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'revenue' && (
              <div>
                <h3 className="text-xl font-semibold text-dark-text-primary mb-6">Revenue Overview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card">
                    <p className="text-dark-text-muted text-sm mb-2">This Month</p>
                    <p className="text-3xl font-bold text-dark-text-primary mb-1">{formatCurrency(21450)}</p>
                    <p className="text-success-400 text-sm">+18% from last month</p>
                  </div>
                  
                  <div className="card">
                    <p className="text-dark-text-muted text-sm mb-2">Active Subscriptions</p>
                    <p className="text-3xl font-bold text-dark-text-primary mb-1">{stats.activeSubscriptions}</p>
                    <p className="text-success-400 text-sm">+12% growth</p>
                  </div>
                  
                  <div className="card">
                    <p className="text-dark-text-muted text-sm mb-2">Avg. Revenue Per User</p>
                    <p className="text-3xl font-bold text-dark-text-primary mb-1">{formatCurrency(49)}</p>
                    <p className="text-dark-text-muted text-sm">Standard tier</p>
                  </div>
                </div>

                <div className="card">
                  <h4 className="text-lg font-semibold text-dark-text-primary mb-4">Revenue by Tier</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-dark-text-secondary">Free Tier</span>
                        <span className="text-dark-text-primary font-semibold">{formatCurrency(0)}</span>
                      </div>
                      <div className="w-full bg-dark-bg-secondary rounded-full h-2">
                        <div className="bg-success-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <p className="text-dark-text-muted text-xs mt-1">No revenue - introductory access</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-dark-text-secondary">Pro (All Access) - $49/mo</span>
                        <span className="text-dark-text-primary font-semibold">{formatCurrency(21450)}</span>
                      </div>
                      <div className="w-full bg-dark-bg-secondary rounded-full h-2">
                        <div className="bg-primary-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-dark-text-muted text-xs mt-1">437 active subscriptions × $49 = $21,413/mo</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}
