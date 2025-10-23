"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Star, 
  Award,
  Lock,
  Book,
  Users,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';

interface LearningPathProps {
  currentCourse?: string;
}

const learningPaths = [
  {
    id: "cloud-foundations",
    title: "Cloud Engineering Foundations",
    description: "Perfect for complete beginners starting their cloud journey",
    duration: "3-4 months",
    difficulty: "Beginner",
    courses: [
      {
        id: "aws-fundamentals",
        title: "AWS Fundamentals",
        duration: "4 weeks",
        status: "available",
        description: "Learn cloud basics and core AWS services"
      },
      {
        id: "linux-basics",
        title: "Linux for Cloud Engineers",
        duration: "3 weeks", 
        status: "locked",
        description: "Master command line and system administration"
      },
      {
        id: "networking-basics",
        title: "Cloud Networking Essentials",
        duration: "3 weeks",
        status: "locked", 
        description: "Understand VPCs, subnets, and security groups"
      }
    ],
    outcomes: [
      "Launch and manage cloud infrastructure",
      "Understand cloud security fundamentals", 
      "Deploy basic applications to the cloud",
      "Prepare for AWS Cloud Practitioner certification"
    ],
    jobs: [
      "Cloud Support Associate ($45K-$65K)",
      "Junior Cloud Engineer ($55K-$75K)",
      "Cloud Operations Specialist ($60K-$80K)"
    ]
  },
  {
    id: "serverless-developer",
    title: "Serverless Application Developer",
    description: "Build modern, scalable applications without managing servers",
    duration: "4-5 months",
    difficulty: "Intermediate",
    courses: [
      {
        id: "serverless-architecture",
        title: "Serverless Architecture Mastery",
        duration: "6 weeks",
        status: "available",
        description: "Master Lambda, API Gateway, and DynamoDB"
      },
      {
        id: "frontend-integration",
        title: "Frontend & API Integration", 
        duration: "4 weeks",
        status: "locked",
        description: "Connect React/Vue apps to serverless backends"
      },
      {
        id: "serverless-security",
        title: "Serverless Security & Monitoring",
        duration: "3 weeks",
        status: "locked",
        description: "Secure and monitor serverless applications"
      }
    ],
    outcomes: [
      "Build full-stack serverless applications",
      "Design scalable API architectures",
      "Implement authentication and authorization",
      "Deploy production-ready applications"
    ],
    jobs: [
      "Serverless Developer ($75K-$95K)",
      "Full-Stack Cloud Developer ($80K-$105K)",
      "Cloud Application Architect ($95K-$125K)"
    ]
  },
  {
    id: "devops-security",
    title: "DevOps & Security Specialist",
    description: "Advanced role combining automation, security, and operations",
    duration: "6-8 months", 
    difficulty: "Advanced",
    courses: [
      {
        id: "cloud-security",
        title: "Cloud Security & DevOps",
        duration: "8 weeks",
        status: "available",
        description: "Enterprise security and CI/CD practices"
      },
      {
        id: "infrastructure-code",
        title: "Infrastructure as Code Mastery",
        duration: "6 weeks",
        status: "locked",
        description: "Terraform, CloudFormation, and automation"
      },
      {
        id: "kubernetes-containers",
        title: "Kubernetes & Container Orchestration",
        duration: "8 weeks",
        status: "locked",
        description: "Container deployment and management"
      }
    ],
    outcomes: [
      "Design enterprise cloud architectures", 
      "Implement automated deployment pipelines",
      "Lead cloud security initiatives",
      "Manage large-scale cloud infrastructures"
    ],
    jobs: [
      "DevOps Engineer ($90K-$120K)",
      "Cloud Security Engineer ($100K-$135K)",
      "Senior Cloud Architect ($120K-$160K)"
    ]
  }
];

export function LearningPaths({ currentCourse }: LearningPathProps) {
  const getCurrentPathProgress = (pathId: string) => {
    // This would come from user data in a real app
    const mockProgress = {
      "cloud-foundations": 25,
      "serverless-developer": 0,
      "devops-security": 0
    };
    return mockProgress[pathId as keyof typeof mockProgress] || 0;
  };

  const isPathUnlocked = (pathId: string) => {
    // Logic to determine if a path is unlocked based on prerequisites
    if (pathId === "cloud-foundations") return true;
    if (pathId === "serverless-developer") return getCurrentPathProgress("cloud-foundations") >= 80;
    if (pathId === "devops-security") return getCurrentPathProgress("serverless-developer") >= 80;
    return false;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold text-dark-text-primary mb-4">
          Choose Your Learning Path
        </h2>
        <p className="text-lg text-dark-text-secondary max-w-3xl mx-auto">
          Our structured learning paths are designed specifically for urban professionals. 
          Each path leads to real job opportunities with salary ranges based on current market data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {learningPaths.map((path, pathIndex) => {
          const progress = getCurrentPathProgress(path.id);
          const isUnlocked = isPathUnlocked(path.id);
          
          return (
            <div
              key={path.id}
              className={`card-elevated relative transition-all duration-300 ${
                !isUnlocked ? 'opacity-60' : 'hover:scale-105'
              }`}
            >
              {!isUnlocked && (
                <div className="absolute top-4 right-4 bg-dark-bg-secondary rounded-full p-2">
                  <Lock className="w-5 h-5 text-dark-text-muted" />
                </div>
              )}

              {/* Path Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    path.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    path.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {path.difficulty}
                  </span>
                  <span className="text-dark-text-muted text-sm">{path.duration}</span>
                </div>

                <h3 className="text-xl font-display font-semibold text-dark-text-primary mb-3">
                  {path.title}
                </h3>
                
                <p className="text-dark-text-secondary text-sm leading-relaxed mb-4">
                  {path.description}
                </p>

                {progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-dark-text-secondary">Progress</span>
                      <span className="text-dark-text-primary font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-dark-bg-secondary rounded-full h-2">
                      <div 
                        className={`bg-urban-gradient h-2 rounded-full transition-all duration-500 ${
                          progress >= 80 ? 'w-4/5' :
                          progress >= 60 ? 'w-3/5' :
                          progress >= 40 ? 'w-2/5' :
                          progress >= 20 ? 'w-1/5' :
                          'w-1/12'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Course List */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-dark-text-primary flex items-center gap-2">
                  <Book className="w-4 h-4 text-primary-400" />
                  Courses ({path.courses.length})
                </h4>
                
                {path.courses.map((course, courseIndex) => (
                  <div
                    key={course.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      course.status === 'available' 
                        ? 'bg-primary-500/10 border border-primary-500/20' 
                        : 'bg-dark-bg-secondary border border-dark-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {course.status === 'available' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-dark-text-muted" />
                      )}
                      <div>
                        <div className={`font-medium text-sm ${
                          course.status === 'available' ? 'text-dark-text-primary' : 'text-dark-text-muted'
                        }`}>
                          {course.title}
                        </div>
                        <div className="text-xs text-dark-text-muted">{course.description}</div>
                      </div>
                    </div>
                    <span className="text-xs text-dark-text-muted">{course.duration}</span>
                  </div>
                ))}
              </div>

              {/* Outcomes */}
              <div className="mb-6">
                <h4 className="font-medium text-dark-text-primary flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-primary-400" />
                  What You&apos;ll Learn
                </h4>
                <ul className="space-y-2">
                  {path.outcomes.slice(0, 3).map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-dark-text-secondary">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Job Opportunities */}
              <div className="mb-6">
                <h4 className="font-medium text-dark-text-primary flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-primary-400" />
                  Career Opportunities
                </h4>
                <div className="space-y-2">
                  {path.jobs.map((job, index) => (
                    <div key={index} className="text-sm text-dark-text-secondary bg-dark-bg-secondary rounded-lg p-2">
                      {job}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-dark-border">
                {isUnlocked ? (
                  progress > 0 ? (
                    <Link href={`/dashboard`} className="w-full btn-primary group flex items-center justify-center gap-2">
                      Continue Learning
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  ) : (
                    <Link href={`/courses/${path.courses[0].id}`} className="w-full btn-primary group flex items-center justify-center gap-2">
                      Start Path
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  )
                ) : (
                  <div className="text-center">
                    <p className="text-dark-text-muted text-sm mb-3">
                      Complete the previous path to unlock
                    </p>
                    <button 
                      disabled 
                      className="w-full btn-outline opacity-50 cursor-not-allowed"
                    >
                      Locked
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="card bg-primary-500/10 border border-primary-500/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Users className="w-8 h-8 text-primary-400 mx-auto mb-3" />
            <h4 className="font-semibold text-dark-text-primary mb-2">Community Support</h4>
            <p className="text-sm text-dark-text-secondary">
              Join study groups and get help from fellow urban professionals on the same journey.
            </p>
          </div>
          
          <div className="text-center">
            <Award className="w-8 h-8 text-primary-400 mx-auto mb-3" />
            <h4 className="font-semibold text-dark-text-primary mb-2">Industry Recognition</h4>
            <p className="text-sm text-dark-text-secondary">
              Earn certificates and badges recognized by top employers in your area.
            </p>
          </div>
          
          <div className="text-center">
            <Zap className="w-8 h-8 text-primary-400 mx-auto mb-3" />
            <h4 className="font-semibold text-dark-text-primary mb-2">Fast Track to Jobs</h4>
            <p className="text-sm text-dark-text-secondary">
              Our graduates typically land their first cloud role within 3-6 months.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}