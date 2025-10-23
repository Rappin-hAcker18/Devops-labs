"use client";

import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { 
  User, 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Users, 
  Play,
  CheckCircle,
  Star,
  Target,
  Zap
} from "lucide-react";

const recentActivity = [
  {
    type: "course",
    title: "Completed: AWS Lambda Functions",
    time: "2 hours ago",
    icon: <CheckCircle className="w-5 h-5 text-green-400" />
  },
  {
    type: "achievement",
    title: "Earned: Cloud Architect Badge",
    time: "1 day ago", 
    icon: <Trophy className="w-5 h-5 text-yellow-400" />
  },
  {
    type: "community",
    title: "Posted in Serverless Discussion",
    time: "2 days ago",
    icon: <Users className="w-5 h-5 text-blue-400" />
  },
  {
    type: "course",
    title: "Started: Advanced DynamoDB",
    time: "3 days ago",
    icon: <Play className="w-5 h-5 text-primary-400" />
  }
];

const currentCourses = [
  {
    id: "aws-fundamentals",
    title: "AWS Fundamentals",
    progress: 85,
    nextLesson: "VPC Configuration",
    timeLeft: "2h 30m",
    difficulty: "Beginner"
  },
  {
    id: "serverless-architecture", 
    title: "Serverless Architecture", 
    progress: 45,
    nextLesson: "API Gateway Setup",
    timeLeft: "4h 15m",
    difficulty: "Intermediate"
  },
  {
    id: "cloud-security-essentials",
    title: "Cloud Security Essentials",
    progress: 20,
    nextLesson: "IAM Policies",
    timeLeft: "6h 45m",
    difficulty: "Advanced"
  }
];

const upcomingEvents = [
  {
    title: "Live Q&A: Serverless Best Practices",
    date: "Today, 3:00 PM EST",
    instructor: "Maya Johnson",
    attendees: 45
  },
  {
    title: "Career Workshop: Interview Prep",
    date: "Tomorrow, 7:00 PM EST", 
    instructor: "Jordan Smith",
    attendees: 32
  },
  {
    title: "Community Meetup: NYC Chapter",
    date: "Friday, 6:30 PM EST",
    instructor: "Local Chapter",
    attendees: 28
  }
];

const achievements = [
  { name: "First Steps", icon: "🎯", earned: true },
  { name: "Quick Learner", icon: "⚡", earned: true },
  { name: "Community Helper", icon: "🤝", earned: true },
  { name: "Cloud Architect", icon: "☁️", earned: true },
  { name: "Serverless Expert", icon: "🚀", earned: false },
  { name: "Security Specialist", icon: "🔒", earned: false }
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16">
        {/* Header */}
        <section className="section-padding bg-dark-bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-dark-text-primary mb-2">
                  Welcome back, Alex! 👋
                </h1>
                <p className="text-dark-text-secondary">
                  Ready to continue your cloud engineering journey?
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">7</div>
                  <div className="text-xs text-dark-text-muted">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">450</div>
                  <div className="text-xs text-dark-text-muted">XP Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">12</div>
                  <div className="text-xs text-dark-text-muted">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Dashboard */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Current Courses */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Continue Learning */}
                <div>
                  <h2 className="text-2xl font-display font-semibold text-dark-text-primary mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary-400" />
                    Continue Learning
                  </h2>
                  
                  <div className="space-y-4">
                    {currentCourses.map((course, index) => (
                      <div key={index} className="card hover:card-hover transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-dark-text-primary mb-2 group-hover:gradient-text transition-all duration-300">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-dark-text-secondary">
                              <span>Next: {course.nextLesson}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {course.timeLeft}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                course.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {course.difficulty}
                              </span>
                            </div>
                          </div>
                          <Link 
                            href={`/courses/${course.id}`}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Continue
                          </Link>
                        </div>
                        
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-dark-text-secondary">Progress</span>
                          <span className="text-dark-text-primary font-medium">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-dark-bg-secondary rounded-full h-2">
                          <div 
                            className={`bg-urban-gradient h-2 rounded-full transition-all duration-500 ${
                              course.progress >= 80 ? 'w-4/5' :
                              course.progress >= 60 ? 'w-3/5' :
                              course.progress >= 40 ? 'w-2/5' :
                              course.progress >= 20 ? 'w-1/5' :
                              'w-1/12'
                            }`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h2 className="text-2xl font-display font-semibold text-dark-text-primary mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary-400" />
                    Recent Activity
                  </h2>
                  
                  <div className="card">
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 py-3 border-b border-dark-border last:border-b-0">
                          <div>{activity.icon}</div>
                          <div className="flex-1">
                            <p className="text-dark-text-primary font-medium">{activity.title}</p>
                            <p className="text-dark-text-muted text-sm">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                
                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg font-display font-semibold text-dark-text-primary mb-4">
                    Your Progress
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card text-center">
                      <Target className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                      <div className="text-xl font-bold gradient-text">85%</div>
                      <div className="text-xs text-dark-text-muted">Overall Progress</div>
                    </div>
                    <div className="card text-center">
                      <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-xl font-bold gradient-text">4.8</div>
                      <div className="text-xs text-dark-text-muted">Avg Score</div>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-lg font-display font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Achievements
                  </h3>
                  <div className="card">
                    <div className="grid grid-cols-3 gap-3">
                      {achievements.map((achievement, index) => (
                        <div 
                          key={index} 
                          className={`text-center p-3 rounded-lg transition-all duration-300 ${
                            achievement.earned 
                              ? 'bg-primary-500/20 border border-primary-500/30' 
                              : 'bg-dark-bg-secondary border border-dark-border opacity-50'
                          }`}
                        >
                          <div className="text-2xl mb-1">{achievement.icon}</div>
                          <div className="text-xs text-dark-text-secondary">{achievement.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div>
                  <h3 className="text-lg font-display font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-400" />
                    Upcoming Events
                  </h3>
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="card hover:card-hover transition-all duration-300">
                        <h4 className="font-medium text-dark-text-primary mb-2 text-sm">{event.title}</h4>
                        <p className="text-dark-text-secondary text-xs mb-2">{event.date}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-dark-text-muted">{event.instructor}</span>
                          <span className="text-primary-400">{event.attendees} attending</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-display font-semibold text-dark-text-primary mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Browse Courses
                    </button>
                    <button className="w-full border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      Join Community
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}