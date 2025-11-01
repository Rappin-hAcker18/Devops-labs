"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Book, Clock, Users, Star, CheckCircle, Lock, Play, Code, FileText, Target, Award, Crown, Zap } from 'lucide-react';
import { EnhancedLessonPlayer } from './EnhancedLessonPlayer';
import { courseContentMap } from '@/data/courseContent';
import { getUserAccess, isAuthenticated } from '@/lib/access';
import analytics from '@/lib/analytics';
import type { Module, Lesson } from '@/data/courseContent';

interface CourseContentManagerProps {
  courseId: string;
  userId: string;
}

export function CourseContentManager({ courseId, userId }: CourseContentManagerProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [unlockedLessons, setUnlockedLessons] = useState<Set<string>>(new Set());
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const userAccess = getUserAccess();

  const courseModules = useMemo(() => 
    courseContentMap[courseId as keyof typeof courseContentMap] || [], 
    [courseId]
  );

  // Initialize progress and unlocked lessons
  useEffect(() => {
    // In a real app, this would fetch from an API
    const savedProgress = localStorage.getItem(`course_progress_${courseId}_${userId}`);
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }

    // Initialize unlocked lessons (first lesson of first module should be unlocked)
    const initialUnlocked = new Set<string>();
    if (courseModules.length > 0 && courseModules[0].lessons.length > 0) {
      initialUnlocked.add(courseModules[0].lessons[0].id);
    }
    setUnlockedLessons(initialUnlocked);
  }, [courseId, userId, courseModules]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`course_progress_${courseId}_${userId}`, JSON.stringify(userProgress));
  }, [userProgress, courseId, userId]);

  const handleLessonComplete = (lessonId: string) => {
    // Prevent multiple completions of the same lesson using both checks
    if (userProgress[lessonId] || completedLessons.has(lessonId)) {
      console.log(`Lesson ${lessonId} already completed, skipping duplicate...`);
      return;
    }

    console.log(`🎉 Completing lesson: ${lessonId}`);
    
    // Mark as completed immediately to prevent duplicates
    setCompletedLessons(prev => new Set([...prev, lessonId]));
    
    setUserProgress(prev => ({
      ...prev,
      [lessonId]: true
    }));

    // Track lesson completion ONLY ONCE
    const lesson = courseModules
      .flatMap(m => m.lessons)
      .find(l => l.id === lessonId);
    
    if (lesson) {
      try {
        analytics.trackLessonComplete(courseId, lessonId, lesson.title, 0);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    }

    // Unlock next lesson
    unlockNextLesson(lessonId);
  };

  const unlockNextLesson = (completedLessonId: string) => {
    for (const courseModule of courseModules) {
      const lessonIndex = courseModule.lessons.findIndex(lesson => lesson.id === completedLessonId);
      
      if (lessonIndex !== -1) {
        // Unlock next lesson in same module
        if (lessonIndex + 1 < courseModule.lessons.length) {
          const nextLesson = courseModule.lessons[lessonIndex + 1];
          setUnlockedLessons(prev => new Set([...prev, nextLesson.id]));
        } else {
          // Unlock first lesson of next module
          const moduleIndex = courseModules.findIndex(m => m.id === courseModule.id);
          if (moduleIndex + 1 < courseModules.length) {
            const nextModule = courseModules[moduleIndex + 1];
            if (nextModule.lessons.length > 0) {
              setUnlockedLessons(prev => new Set([...prev, nextModule.lessons[0].id]));
            }
          }
        }
        break;
      }
    }
  };

  const getNextLesson = (currentLessonId: string): Lesson | null => {
    for (const courseModule of courseModules) {
      const lessonIndex = courseModule.lessons.findIndex(lesson => lesson.id === currentLessonId);
      
      if (lessonIndex !== -1) {
        // Next lesson in same module
        if (lessonIndex + 1 < courseModule.lessons.length) {
          return courseModule.lessons[lessonIndex + 1];
        } else {
          // First lesson of next module
          const moduleIndex = courseModules.findIndex(m => m.id === courseModule.id);
          if (moduleIndex + 1 < courseModules.length) {
            const nextModule = courseModules[moduleIndex + 1];
            return nextModule.lessons.length > 0 ? nextModule.lessons[0] : null;
          }
        }
      }
    }
    return null;
  };

  const getPreviousLesson = (currentLessonId: string): Lesson | null => {
    for (const courseModule of courseModules) {
      const lessonIndex = courseModule.lessons.findIndex(lesson => lesson.id === currentLessonId);
      
      if (lessonIndex !== -1) {
        // Previous lesson in same module
        if (lessonIndex > 0) {
          return courseModule.lessons[lessonIndex - 1];
        } else {
          // Last lesson of previous module
          const moduleIndex = courseModules.findIndex(m => m.id === courseModule.id);
          if (moduleIndex > 0) {
            const prevModule = courseModules[moduleIndex - 1];
            return prevModule.lessons.length > 0 ? prevModule.lessons[prevModule.lessons.length - 1] : null;
          }
        }
      }
    }
    return null;
  };

  const handleLessonSelect = (lesson: Lesson, module: Module) => {
    if (unlockedLessons.has(lesson.id)) {
      setSelectedLesson(lesson);
      setSelectedModule(module);
      
      // Track lesson start
      analytics.trackLessonStart(courseId, lesson.id, lesson.title);
    }
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    
    const nextLesson = getNextLesson(selectedLesson.id);
    if (nextLesson && unlockedLessons.has(nextLesson.id)) {
      const nextModule = courseModules.find(module => 
        module.lessons.some(lesson => lesson.id === nextLesson.id)
      );
      if (nextModule) {
        setSelectedLesson(nextLesson);
        setSelectedModule(nextModule);
      }
    }
  };

  const handlePreviousLesson = () => {
    if (!selectedLesson) return;
    
    const prevLesson = getPreviousLesson(selectedLesson.id);
    if (prevLesson) {
      const prevModule = courseModules.find(module => 
        module.lessons.some(lesson => lesson.id === prevLesson.id)
      );
      if (prevModule) {
        setSelectedLesson(prevLesson);
        setSelectedModule(prevModule);
      }
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return <Play className="w-4 h-4" />;
      case "article": return <FileText className="w-4 h-4" />;
      case "lab": return <Code className="w-4 h-4" />;
      case "interactive": return <Target className="w-4 h-4" />;
      case "quiz": return <Award className="w-4 h-4" />;
      default: return <Book className="w-4 h-4" />;
    }
  };

  const calculateModuleProgress = (module: Module) => {
    const completedLessons = module.lessons.filter(lesson => userProgress[lesson.id]).length;
    return module.lessons.length > 0 ? (completedLessons / module.lessons.length) * 100 : 0;
  };

  const calculateOverallProgress = () => {
    const totalLessons = courseModules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = Object.values(userProgress).filter(Boolean).length;
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  if (selectedLesson) {
    const nextLesson = getNextLesson(selectedLesson.id);
    const prevLesson = getPreviousLesson(selectedLesson.id);
    
    return (
      <div className="min-h-screen bg-dark-bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => setSelectedLesson(null)}
            className="mb-6 text-primary-400 hover:text-primary-300 transition-colors duration-200"
          >
            ← Back to Course Overview
          </button>
          
          <EnhancedLessonPlayer
            lesson={selectedLesson}
            courseId={courseId}
            onComplete={() => handleLessonComplete(selectedLesson.id)}
            onNext={nextLesson && unlockedLessons.has(nextLesson.id) ? handleNextLesson : undefined}
            onPrevious={prevLesson ? handlePreviousLesson : undefined}
            hasNext={nextLesson && unlockedLessons.has(nextLesson.id) ? true : false}
            hasPrevious={prevLesson ? true : false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Subscription Tier Indicator */}
      <div className={`rounded-xl p-4 border ${
        userAccess.tier === 'free' ? 'border-yellow-500/30 bg-yellow-500/5' :
        userAccess.tier === 'standard' ? 'border-blue-500/30 bg-blue-500/5' :
        'border-purple-500/30 bg-purple-500/5'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              userAccess.tier === 'free' ? 'bg-yellow-500/20' :
              userAccess.tier === 'standard' ? 'bg-blue-500/20' :
              'bg-purple-500/20'
            }`}>
              {userAccess.tier === 'free' ? <Zap className="w-5 h-5 text-yellow-400" /> :
               userAccess.tier === 'standard' ? <Star className="w-5 h-5 text-blue-400" /> :
               <Crown className="w-5 h-5 text-purple-400" />}
            </div>
            <div>
              <h3 className={`font-semibold capitalize ${
                userAccess.tier === 'free' ? 'text-yellow-400' :
                userAccess.tier === 'standard' ? 'text-blue-400' :
                'text-purple-400'
              }`}>
                {userAccess.tier} Tier
              </h3>
              <p className="text-sm text-dark-text-secondary">
                {userAccess.tier === 'free' ? 'Access to first 2 modules' :
                 userAccess.tier === 'standard' ? 'Full course access + certificates' :
                 'Premium features + mentoring'}
              </p>
            </div>
          </div>
          {userAccess.tier === 'free' && (
            <button
              onClick={() => window.location.href = '/pricing'}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors text-sm font-medium"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Course Progress Overview */}
      <div className="bg-dark-bg-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-dark-text-primary">Course Progress</h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-400">
              {Math.round(calculateOverallProgress())}%
            </div>
            <div className="text-sm text-dark-text-secondary">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-dark-bg-secondary rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${calculateOverallProgress()}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm text-dark-text-secondary">
          <span>
            {Object.values(userProgress).filter(Boolean).length} of {courseModules.reduce((acc, module) => acc + module.lessons.length, 0)} lessons completed
          </span>
          <span>
            {courseModules.length} modules
          </span>
        </div>
      </div>

      {/* Course Modules */}
      <div className="space-y-6">
        {courseModules.map((module, moduleIndex) => (
          <div key={module.id} className="bg-dark-bg-card rounded-xl overflow-hidden">
            {/* Module Header */}
            <div className="p-6 border-b border-dark-border-primary">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-dark-text-primary mb-2">
                    Module {module.id}: {module.title}
                  </h3>
                  <p className="text-dark-text-secondary mb-4">{module.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-dark-text-secondary">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {module.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Book className="w-4 h-4" />
                      {module.lessons.length} lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {module.lessons.filter(lesson => userProgress[lesson.id]).length} completed
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-400">
                    {Math.round(calculateModuleProgress(module))}%
                  </div>
                  <div className="text-xs text-dark-text-secondary">Progress</div>
                </div>
              </div>
              
              {/* Module Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-dark-bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateModuleProgress(module)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Module Lessons */}
            <div className="p-6">
              <div className="space-y-3">
                {module.lessons.map((lesson, lessonIndex) => {
                  const isCompleted = userProgress[lesson.id];
                  const hasAccess = userAccess.canAccessLesson(lesson.id, moduleIndex);
                  const isUnlocked = unlockedLessons.has(lesson.id) && hasAccess;
                  const isClickable = isUnlocked;
                  const needsUpgrade = !hasAccess && userAccess.tier === 'free';

                  return (
                    <div
                      key={lesson.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        isClickable 
                          ? 'border-dark-border-secondary hover:border-primary-500 cursor-pointer hover:bg-dark-bg-elevated' 
                          : needsUpgrade
                          ? 'border-yellow-500/30 bg-yellow-500/5'
                          : 'border-dark-border-primary opacity-60'
                      }`}
                      onClick={() => isClickable && handleLessonSelect(lesson, module)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : isUnlocked ? (
                            <div className="w-5 h-5 rounded-full border-2 border-dark-border-secondary" />
                          ) : needsUpgrade ? (
                            <Crown className="w-5 h-5 text-yellow-400" />
                          ) : (
                            <Lock className="w-5 h-5 text-dark-text-muted" />
                          )}
                          
                          {getLessonIcon(lesson.type)}
                          
                          <div>
                            <h4 className={`font-medium ${
                              isUnlocked ? 'text-dark-text-primary' : 
                              needsUpgrade ? 'text-yellow-400' :
                              'text-dark-text-muted'
                            }`}>
                              {lesson.title}
                              {needsUpgrade && <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Premium</span>}
                            </h4>
                            <p className={`text-sm ${
                              isUnlocked ? 'text-dark-text-secondary' : 
                              needsUpgrade ? 'text-yellow-400/70' :
                              'text-dark-text-muted'
                            }`}>
                              {needsUpgrade ? 'Upgrade to Standard or Premium to access this lesson' : lesson.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            lesson.type === 'video' ? 'bg-blue-500/20 text-blue-400' :
                            lesson.type === 'lab' ? 'bg-green-500/20 text-green-400' :
                            lesson.type === 'interactive' ? 'bg-purple-500/20 text-purple-400' :
                            lesson.type === 'article' ? 'bg-yellow-500/20 text-yellow-400' :
                            lesson.type === 'quiz' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {lesson.type}
                          </span>
                          
                          <span className={`text-sm ${
                            isUnlocked ? 'text-dark-text-secondary' : 'text-dark-text-muted'
                          }`}>
                            {lesson.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Module Project */}
              {module.project && (
                <div className="mt-6 p-4 bg-gradient-to-r from-accent-500/10 to-primary-500/10 rounded-lg border border-accent-500/20">
                  <h4 className="font-semibold text-dark-text-primary mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent-400" />
                    Module Project: {module.project.title}
                  </h4>
                  <p className="text-dark-text-secondary text-sm mb-3">{module.project.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-dark-text-primary mb-2">Requirements:</h5>
                      <ul className="space-y-1 text-dark-text-secondary">
                        {module.project.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-accent-400 mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-dark-text-primary mb-2">Deliverables:</h5>
                      <ul className="space-y-1 text-dark-text-secondary">
                        {module.project.deliverables.map((deliverable, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-accent-400 mt-1">•</span>
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Course Completion */}
      {calculateOverallProgress() === 100 && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 text-center border border-green-500/30">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-400 mb-2">Congratulations!</h3>
          <p className="text-dark-text-secondary mb-4">
            You've successfully completed this course. You're ready to take on real-world cloud engineering challenges!
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-200">
            Download Certificate
          </button>
        </div>
      )}
    </div>
  );
}

export default CourseContentManager;