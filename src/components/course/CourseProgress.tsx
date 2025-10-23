"use client";

import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  Star, 
  Award, 
  TrendingUp,
  Target,
  Book,
  Users,
  Calendar
} from 'lucide-react';

interface CourseProgressProps {
  courseId: string;
  progress: {
    completed: number;
    total: number;
    timeSpent: string;
    streak: number;
    lastAccessed: string;
  };
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    earned: boolean;
    icon: string;
  }>;
  nextMilestones: Array<{
    name: string;
    progress: number;
    requirement: string;
  }>;
}

export function CourseProgress({ courseId, progress, achievements, nextMilestones }: CourseProgressProps) {
  const completionPercentage = Math.round((progress.completed / progress.total) * 100);

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="card">
        <h3 className="text-xl font-semibold text-dark-text-primary mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary-400" />
          Your Progress
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              {completionPercentage}%
            </div>
            <div className="text-sm text-dark-text-muted">Complete</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              {progress.completed}/{progress.total}
            </div>
            <div className="text-sm text-dark-text-muted">Lessons</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              {progress.timeSpent}
            </div>
            <div className="text-sm text-dark-text-muted">Time Spent</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              {progress.streak}
            </div>
            <div className="text-sm text-dark-text-muted">Day Streak</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dark-text-secondary">Course Progress</span>
            <span className="text-dark-text-primary font-medium">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-dark-bg-secondary rounded-full h-3">
            <div 
              className={`bg-urban-gradient h-3 rounded-full transition-all duration-500 ${
                completionPercentage >= 80 ? 'w-4/5' :
                completionPercentage >= 60 ? 'w-3/5' :
                completionPercentage >= 40 ? 'w-2/5' :
                completionPercentage >= 20 ? 'w-1/5' :
                'w-1/12'
              }`}
            />
          </div>
        </div>

        <p className="text-dark-text-muted text-sm">
          Last accessed: {progress.lastAccessed}
        </p>
      </div>

      {/* Achievements */}
      <div className="card">
        <h3 className="text-xl font-semibold text-dark-text-primary mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-400" />
          Achievements
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`text-center p-4 rounded-lg transition-all duration-300 ${
                achievement.earned
                  ? 'bg-primary-500/20 border border-primary-500/30 scale-105'
                  : 'bg-dark-bg-secondary border border-dark-border opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="font-medium text-dark-text-primary text-sm mb-1">
                {achievement.name}
              </div>
              <div className="text-xs text-dark-text-muted">
                {achievement.description}
              </div>
              {achievement.earned && (
                <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Milestones */}
      <div className="card">
        <h3 className="text-xl font-semibold text-dark-text-primary mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-primary-400" />
          Next Milestones
        </h3>

        <div className="space-y-4">
          {nextMilestones.map((milestone, index) => (
            <div key={index} className="p-4 bg-dark-bg-secondary rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-dark-text-primary">{milestone.name}</h4>
                <span className="text-sm text-dark-text-secondary">
                  {milestone.progress}%
                </span>
              </div>
              
              <div className="w-full bg-dark-bg-primary rounded-full h-2 mb-2">
                <div 
                  className={`bg-primary-500 h-2 rounded-full transition-all duration-300 ${
                    milestone.progress >= 80 ? 'w-4/5' :
                    milestone.progress >= 60 ? 'w-3/5' :
                    milestone.progress >= 40 ? 'w-2/5' :
                    milestone.progress >= 20 ? 'w-1/5' :
                    'w-1/12'
                  }`}
                />
              </div>
              
              <p className="text-dark-text-muted text-sm">{milestone.requirement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Study Recommendations */}
      <div className="card bg-primary-500/10 border border-primary-500/20">
        <h3 className="text-xl font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary-400" />
          Study Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-dark-text-primary mb-1">Optimal Study Time</h4>
              <p className="text-sm text-dark-text-secondary">
                Based on your progress, aim for 45-60 minutes per day to maintain momentum.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Book className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-dark-text-primary mb-1">Focus Areas</h4>
              <p className="text-sm text-dark-text-secondary">
                Practice more hands-on labs to reinforce your theoretical knowledge.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-dark-text-primary mb-1">Community Engagement</h4>
              <p className="text-sm text-dark-text-secondary">
                Join study groups to discuss concepts and get help with challenging topics.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-dark-text-primary mb-1">Next Goal</h4>
              <p className="text-sm text-dark-text-secondary">
                Complete 3 more lessons this week to stay on track for course completion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default props for demo purposes
CourseProgress.defaultProps = {
  progress: {
    completed: 12,
    total: 32,
    timeSpent: "18h 45m",
    streak: 7,
    lastAccessed: "2 hours ago"
  },
  achievements: [
    {
      id: "first-lesson",
      name: "First Steps",
      description: "Completed first lesson",
      earned: true,
      icon: "🎯"
    },
    {
      id: "streak-3",
      name: "Consistent",
      description: "3-day study streak",
      earned: true,
      icon: "🔥"
    },
    {
      id: "lab-master",
      name: "Lab Expert",
      description: "Completed 5 labs",
      earned: true,
      icon: "🧪"
    },
    {
      id: "community-helper",
      name: "Helper",
      description: "Helped 3 students",
      earned: false,
      icon: "🤝"
    },
    {
      id: "fast-learner",
      name: "Speed Run",
      description: "Finished module in 1 day",
      earned: false,
      icon: "⚡"
    },
    {
      id: "perfectionist",
      name: "Perfect Score",
      description: "100% on all quizzes",
      earned: false,
      icon: "💯"
    }
  ],
  nextMilestones: [
    {
      name: "AWS Fundamentals Master",
      progress: 75,
      requirement: "Complete all lessons in AWS Fundamentals module"
    },
    {
      name: "Hands-on Expert",
      progress: 60,
      requirement: "Successfully complete 10 hands-on labs"
    },
    {
      name: "Community Contributor",
      progress: 25,
      requirement: "Help 5 fellow students in the community forums"
    }
  ]
};