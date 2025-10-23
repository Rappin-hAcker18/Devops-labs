"use client";

import React, { useState } from 'react';
import { CheckCircle, Clock, Play, Book, Code, Target, FileText, Award, Download, ChevronRight, ChevronLeft } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { Lesson, Quiz, Question } from '@/data/courseContent';

interface EnhancedLessonPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export function EnhancedLessonPlayer({ 
  lesson, 
  onComplete, 
  onNext, 
  onPrevious, 
  hasNext = false, 
  hasPrevious = false 
}: EnhancedLessonPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleVideoProgress = (currentTime: number, duration: number) => {
    const progressPercent = (currentTime / duration) * 100;
    setProgress(progressPercent);
  };

  const handleVideoComplete = () => {
    setProgress(100);
    onComplete();
  };

  const handleQuizSubmit = () => {
    if (!lesson.quiz) return;
    
    let correctAnswers = 0;
    lesson.quiz.questions.forEach(question => {
      const userAnswer = quizAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = (correctAnswers / lesson.quiz.questions.length) * 100;
    setQuizScore(score);
    setQuizSubmitted(true);
    
    if (score >= lesson.quiz.passingScore) {
      onComplete();
    }
  };

  const handleQuizAnswer = (questionId: string, answer: string | number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <VideoLesson 
            lesson={lesson} 
            onComplete={handleVideoComplete}
            onProgress={handleVideoProgress}
            progress={progress}
          />
        );
      
      case 'lab':
        return (
          <LabLesson 
            lesson={lesson} 
            onComplete={onComplete}
          />
        );
      
      case 'interactive':
        return (
          <InteractiveLesson 
            lesson={lesson} 
            onComplete={onComplete}
          />
        );
      
      case 'article':
        return (
          <ArticleLesson 
            lesson={lesson} 
            onComplete={onComplete}
          />
        );
      
      case 'quiz':
        return (
          <QuizLesson 
            lesson={lesson}
            answers={quizAnswers}
            onAnswer={handleQuizAnswer}
            onSubmit={handleQuizSubmit}
            submitted={quizSubmitted}
            score={quizScore}
            onComplete={onComplete}
          />
        );
      
      default:
        return <div>Unknown lesson type</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Lesson Header */}
      <div className="bg-dark-bg-card rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {getLessonIcon(lesson.type)}
              <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium capitalize">
                {lesson.type}
              </span>
              <span className="flex items-center gap-1 text-dark-text-secondary text-sm">
                <Clock className="w-4 h-4" />
                {lesson.duration}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-dark-text-primary mb-2">{lesson.title}</h1>
            <p className="text-dark-text-secondary">{lesson.description}</p>
          </div>
          
          {lesson.completed && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-dark-bg-card rounded-xl overflow-hidden">
        {renderLessonContent()}
      </div>

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="bg-dark-bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
            Resources & Downloads
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.resources.map(resource => (
              <a
                key={resource.id}
                href={resource.url}
                download
                className="flex items-center gap-3 p-4 bg-dark-bg-secondary rounded-lg hover:bg-dark-bg-tertiary transition-colors duration-200"
              >
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <Download className="w-4 h-4 text-primary-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-dark-text-primary">{resource.name}</h4>
                  <p className="text-sm text-dark-text-secondary">
                    {resource.type.toUpperCase()} • {resource.size}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            hasPrevious 
              ? 'bg-dark-bg-secondary text-dark-text-primary hover:bg-dark-bg-tertiary' 
              : 'bg-dark-bg-secondary text-dark-text-muted cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Lesson
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            hasNext 
              ? 'bg-primary-500 text-white hover:bg-primary-600' 
              : 'bg-dark-bg-secondary text-dark-text-muted cursor-not-allowed'
          }`}
        >
          Next Lesson
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Video Lesson Component
function VideoLesson({ lesson, onComplete, onProgress, progress }: {
  lesson: Lesson;
  onComplete: () => void;
  onProgress: (currentTime: number, duration: number) => void;
  progress: number;
}) {
  return (
    <div className="space-y-6">
      {/* Video Player */}
      <VideoPlayer
        src={lesson.videoUrl || "/api/placeholder-video.mp4"}
        title={lesson.title}
        videoId={lesson.id}
        userId="current-user"
        onProgress={onProgress}
        onComplete={onComplete}
        poster={lesson.thumbnail}
      />

      {/* Video Controls */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-dark-text-secondary">{lesson.duration}</span>
            <span className="text-dark-text-secondary">
              Progress: {Math.round(progress)}%
            </span>
          </div>
          
          <button
            onClick={onComplete}
            disabled={progress < 80}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
              progress >= 80 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Mark Complete
          </button>
        </div>
      </div>

      {/* Lesson Content */}
      {lesson.content && (
        <div className="px-6 pb-6">
          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }} />
          </div>
        </div>
      )}
    </div>
  );
}

// Lab Lesson Component
function LabLesson({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const [labProgress, setLabProgress] = useState<Record<string, boolean>>({});

  const checklistItems = lesson.labInstructions 
    ? lesson.labInstructions.split('- [ ]').slice(1).map((item, index) => ({
        id: `lab-${index}`,
        text: item.trim()
      }))
    : [];

  const handleChecklistToggle = (itemId: string) => {
    setLabProgress(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const completedItems = Object.values(labProgress).filter(Boolean).length;
  const progressPercent = checklistItems.length > 0 ? (completedItems / checklistItems.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-dark-text-primary">Lab Progress</h3>
            <span className="text-sm text-dark-text-secondary">
              {completedItems}/{checklistItems.length} completed
            </span>
          </div>
          <div className="w-full bg-dark-bg-secondary rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Lab Content */}
        <div className="prose prose-invert max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }} />
        </div>

        {/* Lab Instructions */}
        {lesson.labInstructions && (
          <div className="bg-dark-bg-secondary rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-dark-text-primary mb-3">Lab Instructions</h4>
            <div className="prose prose-invert prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: lesson.labInstructions.replace(/\n/g, '<br>') }} />
            </div>
          </div>
        )}

        {/* Checklist */}
        {checklistItems.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-dark-text-primary">Success Criteria</h4>
            {checklistItems.map(item => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={labProgress[item.id] || false}
                  onChange={() => handleChecklistToggle(item.id)}
                  className="mt-1 w-4 h-4 text-primary-500 bg-dark-bg-tertiary border-dark-border-primary rounded focus:ring-primary-500"
                />
                <span className={`text-sm ${
                  labProgress[item.id] ? 'text-dark-text-primary line-through' : 'text-dark-text-secondary'
                }`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        )}

        <button
          onClick={onComplete}
          disabled={progressPercent < 100}
          className={`w-full py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
            progressPercent >= 100 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Complete Lab
        </button>
      </div>
    </div>
  );
}

// Interactive Lesson Component
function InteractiveLesson({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const [interactionProgress, setInteractionProgress] = useState(0);

  const handleInteraction = () => {
    const newProgress = Math.min(interactionProgress + 25, 100);
    setInteractionProgress(newProgress);
    
    if (newProgress >= 100) {
      onComplete();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }} />
      </div>

      {/* Interactive Elements */}
      <div className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-lg p-6">
        <h4 className="font-semibold text-dark-text-primary mb-4">Interactive Activity</h4>
        <p className="text-dark-text-secondary mb-4">
          Engage with the interactive elements to complete this lesson.
        </p>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 bg-dark-bg-secondary rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${interactionProgress}%` }}
            />
          </div>
          <span className="text-sm text-dark-text-secondary">{interactionProgress}%</span>
        </div>

        <button
          onClick={handleInteraction}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          {interactionProgress < 100 ? 'Continue Activity' : 'Activity Complete'}
        </button>
      </div>
    </div>
  );
}

// Article Lesson Component
function ArticleLesson({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const [readingProgress, setReadingProgress] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrolled / maxScroll) * 100, 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-dark-text-primary">Reading Progress</h3>
          <span className="text-sm text-dark-text-secondary">
            {Math.round(readingProgress)}% read
          </span>
        </div>
        <div className="w-full bg-dark-bg-secondary rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }} />
      </div>

      <button
        onClick={onComplete}
        disabled={readingProgress < 80}
        className={`w-full py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
          readingProgress >= 80 
            ? "bg-green-500 hover:bg-green-600 text-white" 
            : "bg-gray-500 text-gray-300 cursor-not-allowed"
        }`}
      >
        <CheckCircle className="w-4 h-4" />
        Mark as Read
      </button>
    </div>
  );
}

// Quiz Lesson Component
function QuizLesson({ 
  lesson, 
  answers, 
  onAnswer, 
  onSubmit, 
  submitted, 
  score, 
  onComplete 
}: {
  lesson: Lesson;
  answers: Record<string, string | number>;
  onAnswer: (questionId: string, answer: string | number) => void;
  onSubmit: () => void;
  submitted: boolean;
  score: number;
  onComplete: () => void;
}) {
  if (!lesson.quiz) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }} />
      </div>

      <div className="space-y-6">
        {lesson.quiz.questions.map((question, index) => (
          <div key={question.id} className="bg-dark-bg-secondary rounded-lg p-4">
            <h4 className="font-semibold text-dark-text-primary mb-3">
              Question {index + 1}: {question.question}
            </h4>
            
            {question.type === 'multiple-choice' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value={optionIndex}
                      checked={answers[question.id] === optionIndex}
                      onChange={() => onAnswer(question.id, optionIndex)}
                      disabled={submitted}
                      className="w-4 h-4 text-primary-500 bg-dark-bg-tertiary border-dark-border-primary focus:ring-primary-500"
                    />
                    <span className="text-dark-text-secondary">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'true-false' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value={optionIndex}
                      checked={answers[question.id] === optionIndex}
                      onChange={() => onAnswer(question.id, optionIndex)}
                      disabled={submitted}
                      className="w-4 h-4 text-primary-500 bg-dark-bg-tertiary border-dark-border-primary focus:ring-primary-500"
                    />
                    <span className="text-dark-text-secondary">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {submitted && (
              <div className="mt-3 p-3 bg-dark-bg-tertiary rounded-lg">
                <p className={`text-sm ${
                  answers[question.id] === question.correctAnswer ? 'text-green-400' : 'text-red-400'
                }`}>
                  {answers[question.id] === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <p className="text-sm text-dark-text-secondary mt-1">{question.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={onSubmit}
          disabled={Object.keys(answers).length < lesson.quiz.questions.length}
          className={`w-full py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
            Object.keys(answers).length >= lesson.quiz.questions.length
              ? "bg-primary-500 hover:bg-primary-600 text-white" 
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          Submit Quiz
        </button>
      ) : (
        <div className="text-center">
          <div className={`text-2xl font-bold mb-2 ${
            score >= lesson.quiz.passingScore ? 'text-green-400' : 'text-red-400'
          }`}>
            Score: {Math.round(score)}%
          </div>
          <p className="text-dark-text-secondary mb-4">
            {score >= lesson.quiz.passingScore 
              ? `Congratulations! You passed with ${Math.round(score)}%`
              : `You need ${lesson.quiz.passingScore}% to pass. Try again!`
            }
          </p>
          {score >= lesson.quiz.passingScore && (
            <button
              onClick={onComplete}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Continue to Next Lesson
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function for lesson icons
function getLessonIcon(type: string) {
  switch (type) {
    case "video": return <Play className="w-5 h-5 text-primary-400" />;
    case "article": return <FileText className="w-5 h-5 text-blue-400" />;
    case "lab": return <Code className="w-5 h-5 text-green-400" />;
    case "interactive": return <Target className="w-5 h-5 text-purple-400" />;
    case "quiz": return <Award className="w-5 h-5 text-yellow-400" />;
    default: return <Book className="w-5 h-5 text-gray-400" />;
  }
}

export default EnhancedLessonPlayer;