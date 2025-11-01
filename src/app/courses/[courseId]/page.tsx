"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/access";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { VideoDashboard } from "@/components/course/VideoDashboard";
import { CourseContentManager } from "@/components/course/CourseContentManager";
import { 
  Book, 
  Clock, 
  Users, 
  Award, 
  Star, 
  Play, 
  CheckCircle, 
  Lock,
  Download,
  MessageCircle,
  Code,
  FileText,
  Video,
  Target,
  Trophy,
  ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

// Course data - in a real app, this would come from an API
const courseData = {
  "aws-fundamentals": {
    id: "aws-fundamentals",
    title: "AWS Fundamentals for Beginners",
    description: "Master the basics of Amazon Web Services with hands-on projects designed for urban professionals entering the cloud engineering field.",
    level: "Beginner",
    duration: "4 weeks",
    students: 2500,
    rating: 4.8,
    price: "Free",
    tier: "free",
    instructor: {
      name: "Alex Rodriguez",
      title: "Senior Cloud Architect",
      company: "AWS",
      avatar: "/instructors/alex.jpg",
      bio: "Former Bronx resident turned AWS Solutions Architect with 10+ years helping urban professionals transition to cloud careers."
    },
    modules: [
      {
        id: 1,
        title: "Cloud Computing Basics",
        description: "Understanding what the cloud is and why it matters for your career",
        duration: "2 hours",
        lessons: [
          { id: 1, title: "What is Cloud Computing?", type: "video", duration: "15 min", completed: true },
          { id: 2, title: "Why Cloud Skills Pay More", type: "article", duration: "10 min", completed: true },
          { id: 3, title: "Cloud Career Paths", type: "interactive", duration: "20 min", completed: false },
          { id: 4, title: "Setting Up Your AWS Account", type: "lab", duration: "30 min", completed: false }
        ]
      },
      {
        id: 2,
        title: "AWS Core Services",
        description: "Exploring the essential AWS services every cloud engineer needs to know",
        duration: "3 hours",
        lessons: [
          { id: 5, title: "EC2: Virtual Servers in the Cloud", type: "video", duration: "25 min", completed: false },
          { id: 6, title: "S3: Cloud Storage Solutions", type: "video", duration: "20 min", completed: false },
          { id: 7, title: "RDS: Managed Databases", type: "article", duration: "15 min", completed: false },
          { id: 8, title: "Hands-on: Launch Your First Server", type: "lab", duration: "45 min", completed: false }
        ]
      },
      {
        id: 3,
        title: "Security & Best Practices",
        description: "Learn how to secure your cloud infrastructure from day one",
        duration: "2.5 hours",
        lessons: [
          { id: 9, title: "IAM: Identity and Access Management", type: "video", duration: "20 min", completed: false },
          { id: 10, title: "Security Groups & NACLs", type: "interactive", duration: "25 min", completed: false },
          { id: 11, title: "Cost Optimization Strategies", type: "article", duration: "15 min", completed: false },
          { id: 12, title: "Security Lab: Secure Your Resources", type: "lab", duration: "40 min", completed: false }
        ]
      },
      {
        id: 4,
        title: "Building Your First Project",
        description: "Put it all together by building a real-world cloud application",
        duration: "4 hours",
        lessons: [
          { id: 13, title: "Project Overview: Personal Portfolio Site", type: "video", duration: "15 min", completed: false },
          { id: 14, title: "Setting Up Infrastructure", type: "lab", duration: "60 min", completed: false },
          { id: 15, title: "Deploying Your Application", type: "lab", duration: "45 min", completed: false },
          { id: 16, title: "Going Live & Next Steps", type: "video", duration: "20 min", completed: false }
        ]
      }
    ],
    skills: ["AWS EC2", "S3 Storage", "IAM Security", "RDS Databases", "Cost Optimization", "Cloud Architecture"],
    prerequisites: ["Basic computer skills", "Willingness to learn", "No prior cloud experience needed"],
    outcomes: [
      "Launch and manage virtual servers in AWS",
      "Store and retrieve data using cloud storage",
      "Implement security best practices",
      "Build and deploy a cloud-based project",
      "Understand cloud cost optimization",
      "Prepare for AWS Cloud Practitioner certification"
    ]
  },
  "serverless-architecture": {
    id: "serverless-architecture",
    title: "Serverless Architecture Mastery",
    description: "Build scalable applications with AWS Lambda, API Gateway, and DynamoDB. Perfect for urban developers ready to level up their skills.",
    level: "Intermediate",
    duration: "6 weeks",
    students: 1800,
    rating: 4.9,
    price: "$49/mo",
    tier: "standard",
    instructor: {
      name: "Maya Johnson",
      title: "Head of Curriculum",
      company: "CloudCrew Academy",
      avatar: "/instructors/maya.jpg",
      bio: "Ex-Microsoft cloud engineer who built training programs for Fortune 500 companies. Passionate about serverless technologies."
    },
    modules: [
      {
        id: 1,
        title: "Serverless Fundamentals",
        description: "Understanding serverless computing and its benefits for modern applications",
        duration: "3 hours",
        lessons: [
          { id: 1, title: "What is Serverless?", type: "video", duration: "20 min", completed: false },
          { id: 2, title: "Serverless vs Traditional Architecture", type: "interactive", duration: "25 min", completed: false },
          { id: 3, title: "AWS Lambda Deep Dive", type: "video", duration: "30 min", completed: false },
          { id: 4, title: "Your First Lambda Function", type: "lab", duration: "45 min", completed: false }
        ]
      },
      {
        id: 2,
        title: "API Gateway & Microservices",
        description: "Building RESTful APIs and microservices architecture",
        duration: "4 hours",
        lessons: [
          { id: 5, title: "API Gateway Overview", type: "video", duration: "25 min", completed: false },
          { id: 6, title: "Designing RESTful APIs", type: "article", duration: "20 min", completed: false },
          { id: 7, title: "Authentication & Authorization", type: "video", duration: "30 min", completed: false },
          { id: 8, title: "Build a Complete API", type: "lab", duration: "90 min", completed: false }
        ]
      },
      {
        id: 3,
        title: "NoSQL with DynamoDB",
        description: "Mastering NoSQL databases for serverless applications",
        duration: "3.5 hours",
        lessons: [
          { id: 9, title: "NoSQL vs SQL Databases", type: "video", duration: "20 min", completed: false },
          { id: 10, title: "DynamoDB Design Patterns", type: "interactive", duration: "35 min", completed: false },
          { id: 11, title: "Performance & Scaling", type: "article", duration: "25 min", completed: false },
          { id: 12, title: "Database Implementation Lab", type: "lab", duration: "60 min", completed: false }
        ]
      }
    ],
    skills: ["AWS Lambda", "API Gateway", "DynamoDB", "Serverless Framework", "Microservices", "Event-Driven Architecture"],
    prerequisites: ["Basic AWS knowledge", "Programming experience (JavaScript/Python)", "Completed AWS Fundamentals course"],
    outcomes: [
      "Build serverless applications from scratch",
      "Design and implement RESTful APIs",
      "Master NoSQL database design",
      "Deploy scalable microservices",
      "Implement serverless best practices",
      "Prepare for AWS Developer certification"
    ]
  },
  "cloud-security": {
    id: "cloud-security",
    title: "Cloud Security & DevOps Excellence",
    description: "Advanced security practices and CI/CD pipelines in the cloud. For experienced professionals ready for senior roles.",
    level: "Advanced",
    duration: "8 weeks",
    students: 950,
    rating: 4.9,
    price: "$49/mo",
    tier: "standard",
    instructor: {
      name: "Jordan Smith",
      title: "Senior DevOps Engineer",
      company: "Netflix",
      avatar: "/instructors/jordan.jpg",
      bio: "Cloud security expert and DevOps practitioner who has helped scale infrastructure for millions of users."
    },
    modules: [
      {
        id: 1,
        title: "Advanced Cloud Security",
        description: "Enterprise-level security practices and compliance frameworks",
        duration: "5 hours",
        lessons: [
          { id: 1, title: "Security Threat Modeling", type: "video", duration: "30 min", completed: false },
          { id: 2, title: "Zero Trust Architecture", type: "interactive", duration: "40 min", completed: false },
          { id: 3, title: "Compliance Frameworks (SOC2, PCI)", type: "article", duration: "35 min", completed: false },
          { id: 4, title: "Security Audit Lab", type: "lab", duration: "120 min", completed: false }
        ]
      },
      {
        id: 2,
        title: "Infrastructure as Code",
        description: "Automated infrastructure deployment and management",
        duration: "4.5 hours",
        lessons: [
          { id: 5, title: "CloudFormation vs Terraform", type: "video", duration: "25 min", completed: false },
          { id: 6, title: "GitOps Methodology", type: "video", duration: "30 min", completed: false },
          { id: 7, title: "Infrastructure Testing", type: "interactive", duration: "35 min", completed: false },
          { id: 8, title: "Build Production Infrastructure", type: "lab", duration: "150 min", completed: false }
        ]
      }
    ],
    skills: ["Cloud Security", "DevOps", "Infrastructure as Code", "CI/CD Pipelines", "Monitoring", "Compliance"],
    prerequisites: ["Intermediate AWS knowledge", "DevOps experience", "Programming proficiency", "Completed Serverless course"],
    outcomes: [
      "Implement enterprise security practices",
      "Build automated CI/CD pipelines",
      "Master infrastructure as code",
      "Design disaster recovery solutions",
      "Lead cloud transformation projects",
      "Prepare for AWS Solutions Architect certification"
    ]
  }
};

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video": return <Video className="w-4 h-4" />;
    case "article": return <FileText className="w-4 h-4" />;
    case "lab": return <Code className="w-4 h-4" />;
    case "interactive": return <Target className="w-4 h-4" />;
    default: return <Book className="w-4 h-4" />;
  }
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const course = courseData[courseId as keyof typeof courseData];
  const [activeTab, setActiveTab] = useState("overview");
  const [isMounted, setIsMounted] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if user is enrolled in this course
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!isAuthenticated()) {
        setIsCheckingEnrollment(false);
        return;
      }

      try {
        const response = await api.getUserEnrollments();
        if (response.data) {
          const enrolled = response.data.some(
            enrollment => enrollment.courseId === courseId && enrollment.status === 'active'
          );
          setIsEnrolled(enrolled);
          console.log('✅ Enrollment check:', { courseId, enrolled });
        }
      } catch (error) {
        console.error('❌ Error checking enrollment:', error);
      } finally {
        setIsCheckingEnrollment(false);
      }
    };

    if (isMounted) {
      checkEnrollment();
    }
  }, [isMounted, courseId]);

  const handleEnrollment = () => {
    console.log('🔥 Enrollment button clicked!', { courseId, course: course?.title });
    
    // Check if user is authenticated first
    const authenticated = isAuthenticated();
    console.log('🔑 Authentication status:', authenticated);
    
    if (!authenticated) {
      console.log('❌ User not authenticated, redirecting to login');
      // Use window.location as fallback for navigation
      window.location.href = '/login';
      return;
    }

    console.log('✅ User authenticated, proceeding with enrollment');
    
    if (course?.tier === 'free') {
      console.log('💚 Free course, enrolling user');
      // For free courses, simulate enrollment and redirect to course content
      localStorage.setItem(`enrolled_${courseId}`, 'true');
      console.log('📚 Redirecting to learning page:', `/learn/${courseId}`);
      // Use window.location as fallback for navigation
      window.location.href = `/learn/${courseId}`;
    } else {
      console.log('💰 Paid course, redirecting to checkout');
      // For paid courses, redirect to checkout
      window.location.href = `/checkout?course=${courseId}&tier=${course?.tier}`;
    }
  };

  if (!course) {
    return (
      <main className="min-h-screen bg-dark-bg-primary">
        <Navigation />
        <div className="pt-16 section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-display font-bold text-dark-text-primary mb-4">
              Course Not Found
            </h1>
            <p className="text-dark-text-secondary mb-8">
              The course you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/courses" className="btn-primary">
              Browse All Courses
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark-bg-primary">
      <Navigation />
      
      <div className="pt-16">
        {/* Course Header */}
        <section className="section-padding bg-hero-gradient">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {course.level}
                  </span>
                  <span className="text-dark-text-muted">•</span>
                  <span className="text-dark-text-secondary">{course.duration}</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-dark-text-primary mb-6">
                  {course.title}
                </h1>
                
                <p className="text-lg text-dark-text-secondary mb-8 leading-relaxed">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-400" />
                    <span className="text-dark-text-secondary">{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-dark-text-secondary">{course.rating} rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-400" />
                    <span className="text-dark-text-secondary">{course.duration} duration</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="card bg-dark-bg-secondary/50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-urban-gradient rounded-full flex items-center justify-center text-white font-display font-bold text-xl">
                      {course.instructor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-text-primary">{course.instructor.name}</h3>
                      <p className="text-primary-400">{course.instructor.title}</p>
                      <p className="text-dark-text-muted text-sm">{course.instructor.company}</p>
                    </div>
                  </div>
                  <p className="text-dark-text-secondary text-sm mt-4 leading-relaxed">
                    {course.instructor.bio}
                  </p>
                </div>
              </div>

              {/* Course Sidebar */}
              <div className="lg:col-span-1">
                <div className="card-elevated sticky top-24">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold gradient-text mb-2">{course.price}</div>
                    {course.tier !== 'free' && !isEnrolled && (
                      <p className="text-dark-text-muted text-sm">Billed monthly</p>
                    )}
                    {isEnrolled && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <p className="text-green-400 text-sm font-medium">You're enrolled!</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Enrollment Button */}
                  {isMounted ? (
                    isCheckingEnrollment ? (
                      <div className="w-full bg-gray-600 text-white font-semibold py-4 rounded-xl mb-6 text-center">
                        Checking enrollment...
                      </div>
                    ) : isEnrolled ? (
                      <button 
                        onClick={() => window.location.href = `/learn/${courseId}`}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 mb-6 flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Continue Learning
                      </button>
                    ) : (
                      <button 
                        onClick={handleEnrollment}
                        className="w-full bg-urban-gradient text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 mb-6"
                      >
                        {course?.tier === 'free' ? 'Start Learning Free' : 'Enroll Now'}
                      </button>
                    )
                  ) : (
                    <div className="w-full bg-gray-600 text-white font-semibold py-4 rounded-xl mb-6 text-center">
                      Loading...
                    </div>
                  )}
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-dark-text-muted">Students enrolled</span>
                      <span className="text-dark-text-primary font-medium">{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-text-muted">Course duration</span>
                      <span className="text-dark-text-primary font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-text-muted">Skill level</span>
                      <span className="text-dark-text-primary font-medium">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-text-muted">Certificate</span>
                      <span className="text-dark-text-primary font-medium">Included</span>
                    </div>
                  </div>
                  
                  <hr className="border-dark-border my-6" />
                  
                  <div className="text-center">
                    <p className="text-dark-text-muted text-sm mb-4">This course includes:</p>
                    <div className="space-y-2 text-sm text-dark-text-secondary">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-primary-400" />
                        <span>HD video lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-primary-400" />
                        <span>Hands-on labs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-primary-400" />
                        <span>Downloadable resources</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-primary-400" />
                        <span>Community access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-primary-400" />
                        <span>Certificate of completion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content Tabs */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="border-b border-dark-border mb-8">
              <nav className="flex space-x-8">
                {['overview', 'content', 'curriculum', 'videos', 'skills', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 capitalize ${
                      activeTab === tab
                        ? 'border-primary-400 text-primary-400'
                        : 'border-transparent text-dark-text-muted hover:text-dark-text-secondary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-display font-semibold text-dark-text-primary mb-6">
                    What You&apos;ll Learn
                  </h3>
                  <div className="space-y-3">
                    {course.outcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-dark-text-secondary">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-display font-semibold text-dark-text-primary mb-6">
                    Prerequisites
                  </h3>
                  <div className="space-y-3">
                    {course.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                        <span className="text-dark-text-secondary">{prereq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <CourseContentManager 
                  courseId={courseId}
                  userId="current-user"
                />
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-dark-text-primary">
                        Module {module.id}: {module.title}
                      </h3>
                      <span className="text-dark-text-muted text-sm">{module.duration}</span>
                    </div>
                    <p className="text-dark-text-secondary mb-6">{module.description}</p>
                    
                    <div className="space-y-3">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex items-center justify-between p-4 bg-dark-bg-secondary rounded-lg">
                          <div className="flex items-center gap-3">
                            {lesson.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <Lock className="w-5 h-5 text-dark-text-muted" />
                            )}
                            {getLessonIcon(lesson.type)}
                            <span className={`font-medium ${
                              lesson.completed ? 'text-dark-text-primary' : 'text-dark-text-muted'
                            }`}>
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-dark-text-muted text-sm">{lesson.duration}</span>
                            {lesson.completed && (
                              <Play className="w-4 h-4 text-primary-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'videos' && (
              <div>
                <h3 className="text-2xl font-display font-semibold text-dark-text-primary mb-6">
                  Course Videos
                </h3>
                <VideoDashboard 
                  courseId={courseId}
                  showAnalytics={false}
                />
              </div>
            )}

            {activeTab === 'skills' && (
              <div>
                <h3 className="text-2xl font-display font-semibold text-dark-text-primary mb-6">
                  Skills You&apos;ll Master
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {course.skills.map((skill, index) => (
                    <div key={index} className="card text-center hover:card-hover transition-all duration-300">
                      <Award className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                      <span className="text-dark-text-primary font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-dark-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-text-primary mb-2">
                  Student Reviews Coming Soon
                </h3>
                <p className="text-dark-text-secondary">
                  We&apos;re collecting feedback from our amazing students. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}