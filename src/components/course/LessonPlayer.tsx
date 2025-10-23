"use client";

import React, { useState } from 'react';
import { 
  CheckCircle, 
  Code, 
  Terminal, 
  FileText,
  Lightbulb,
  AlertCircle,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';

interface LessonPlayerProps {
  lesson: {
    id: number;
    title: string;
    type: 'video' | 'article' | 'lab' | 'interactive';
    duration: string;
    content?: any;
  };
  onComplete: () => void;
}

export function LessonPlayer({ lesson, onComplete }: LessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  if (lesson.type === 'video') {
    return <VideoLesson lesson={lesson} onComplete={handleComplete} />;
  }

  if (lesson.type === 'article') {
    return <ArticleLesson lesson={lesson} onComplete={handleComplete} />;
  }

  if (lesson.type === 'lab') {
    return <LabLesson lesson={lesson} onComplete={handleComplete} />;
  }

  if (lesson.type === 'interactive') {
    return <InteractiveLesson lesson={lesson} onComplete={handleComplete} />;
  }

  return null;
}

function VideoLesson({ lesson, onComplete }: { lesson: any; onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  const handleVideoProgress = (currentTime: number, duration: number) => {
    const progressPercent = (currentTime / duration) * 100;
    setProgress(progressPercent);
  };

  const handleVideoComplete = () => {
    setProgress(100);
    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <VideoPlayer
        src={lesson.videoUrl || "/api/placeholder-video.mp4"}
        title={lesson.title}
        videoId={lesson.id}
        userId="current-user" // In production, get from auth context
        onProgress={handleVideoProgress}
        onComplete={handleVideoComplete}
        poster={lesson.thumbnail}
      />

      {/* Video Controls */}
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

      {/* Video Notes */}
      <div className="card bg-dark-bg-secondary/50">
        <h4 className="font-semibold text-dark-text-primary mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-400" />
          Key Points
        </h4>
        <ul className="space-y-2 text-dark-text-secondary text-sm">
          <li>• Cloud computing eliminates the need for physical servers</li>
          <li>• Pay-as-you-go pricing model reduces upfront costs</li>
          <li>• Scalability allows resources to grow with your business</li>
          <li>• Security is a shared responsibility between you and AWS</li>
        </ul>
      </div>
    </div>
  );
}

function ArticleLesson({ lesson, onComplete }: { lesson: any; onComplete: () => void }) {
  const [readTime, setReadTime] = useState(0);

  return (
    <div className="space-y-6">
      <div className="prose prose-invert max-w-none">
        <div className="card bg-dark-bg-secondary/30">
          <h3 className="text-2xl font-display font-bold text-dark-text-primary mb-6">
            Why Cloud Skills Pay More: The Urban Professional&apos;s Guide
          </h3>
          
          <div className="space-y-6 text-dark-text-secondary leading-relaxed">
            <p>
              In today&apos;s economy, cloud engineering represents one of the most significant opportunities 
              for urban professionals to dramatically increase their earning potential. But why exactly 
              do cloud skills command such high salaries?
            </p>

            <div className="card bg-primary-500/10 border border-primary-500/20">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-dark-text-primary mb-2">Key Insight</h4>
                  <p className="text-sm">
                    The average cloud engineer salary in major cities is $95,000-$150,000, 
                    compared to $45,000-$65,000 for traditional IT roles.
                  </p>
                </div>
              </div>
            </div>

            <h4 className="text-xl font-semibold text-dark-text-primary">The Skills Gap Reality</h4>
            <p>
              Major corporations are desperately searching for cloud talent. Companies like Netflix, 
              Spotify, and even traditional businesses are moving everything to the cloud. This 
              creates massive demand for professionals who understand cloud architecture.
            </p>

            <h4 className="text-xl font-semibold text-dark-text-primary">Urban Advantage</h4>
            <p>
              Urban professionals already have several advantages in the cloud job market:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Proximity to tech companies and startups</li>
              <li>Strong networking opportunities</li>
              <li>Diverse problem-solving skills from urban environments</li>
              <li>Understanding of scale and efficiency</li>
            </ul>

            <div className="card bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-dark-text-primary mb-2">Success Story</h4>
                  <p className="text-sm">
                    &quot;I went from making $35K as a security guard in Brooklyn to $85K as a 
                    cloud engineer in just 8 months. The CloudCrew program changed my life.&quot; 
                    - Marcus, CloudCrew Graduate
                  </p>
                </div>
              </div>
            </div>

            <h4 className="text-xl font-semibold text-dark-text-primary">Getting Started</h4>
            <p>
              The best part? You don&apos;t need a computer science degree or years of experience. 
              Cloud platforms are designed to be accessible, and with the right training, 
              you can be job-ready in months, not years.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-dark-text-muted text-sm">
          Estimated reading time: {lesson.duration}
        </span>
        <button
          onClick={onComplete}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Complete Reading
        </button>
      </div>
    </div>
  );
}

function LabLesson({ lesson, onComplete }: { lesson: any; onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const steps = [
    {
      title: "Navigate to AWS Console",
      instruction: "Open your web browser and go to aws.amazon.com. Click 'Sign In to the Console'.",
      code: null,
      tip: "Make sure you're using the account you set up in the previous lesson."
    },
    {
      title: "Access EC2 Service",
      instruction: "In the AWS Console, search for 'EC2' and click on the EC2 service.",
      code: null,
      tip: "EC2 stands for Elastic Compute Cloud - it's AWS's virtual server service."
    },
    {
      title: "Launch Instance",
      instruction: "Click the orange 'Launch Instance' button to start creating your first server.",
      code: null,
      tip: "An 'instance' is just AWS terminology for a virtual server."
    },
    {
      title: "Configure Instance",
      instruction: "Choose 'Amazon Linux 2' as your operating system and 't2.micro' as the instance type (it's free tier eligible).",
      code: null,
      tip: "t2.micro gives you 1 CPU and 1GB of RAM - perfect for learning!"
    },
    {
      title: "Connect to Your Server",
      instruction: "Once your instance is running, select it and click 'Connect'. Use EC2 Instance Connect for the easiest option.",
      code: "sudo yum update -y\necho 'Hello from my first cloud server!'",
      tip: "You're now connected to a computer running in an AWS data center!"
    }
  ];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="card bg-dark-bg-secondary/30">
        <div className="flex items-center gap-3 mb-6">
          <Terminal className="w-6 h-6 text-primary-400" />
          <h3 className="text-xl font-semibold text-dark-text-primary">
            Hands-on Lab: Launch Your First AWS Server
          </h3>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                index <= currentStep
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-bg-secondary text-dark-text-muted'
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
          ))}
        </div>

        {/* Current Step */}
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-dark-text-primary mb-3">
              Step {currentStep + 1}: {steps[currentStep].title}
            </h4>
            <p className="text-dark-text-secondary leading-relaxed mb-4">
              {steps[currentStep].instruction}
            </p>

            {steps[currentStep].code && (
              <div className="bg-dark-bg-primary border border-dark-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-dark-text-muted text-sm">Terminal Commands</span>
                  <button
                    onClick={() => copyCode(steps[currentStep].code!)}
                    className="text-primary-400 hover:text-primary-300 transition-colors duration-200 flex items-center gap-1 text-sm"
                  >
                    {copiedCode === steps[currentStep].code ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                  <code>{steps[currentStep].code}</code>
                </pre>
              </div>
            )}

            <div className="card bg-yellow-500/10 border border-yellow-500/20 mt-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-dark-text-primary mb-1">Pro Tip</h5>
                  <p className="text-sm text-dark-text-secondary">{steps[currentStep].tip}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 text-dark-text-muted hover:text-dark-text-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Lab
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="card bg-red-500/10 border border-red-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-dark-text-primary mb-2">Need Help?</h5>
            <p className="text-sm text-dark-text-secondary mb-3">
              Stuck on this lab? Don&apos;t worry - our community is here to help!
            </p>
            <button className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors duration-200">
              Ask for Help in Community →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InteractiveLesson({ lesson, onComplete }: { lesson: any; onComplete: () => void }) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question: "Which cloud career path typically has the highest starting salary in urban areas?",
      options: [
        "Cloud Support Associate ($45K-55K)",
        "Cloud Developer ($65K-85K)", 
        "Cloud Solutions Architect ($85K-120K)",
        "Cloud Security Engineer ($90K-130K)"
      ],
      correct: 3,
      explanation: "Cloud Security Engineers command the highest salaries due to the critical nature of their work and the specialized skills required."
    },
    {
      id: 2,
      question: "What's the most important factor for urban professionals transitioning to cloud careers?",
      options: [
        "Having a computer science degree",
        "Years of previous IT experience",
        "Hands-on practice with cloud platforms",
        "Expensive certification courses"
      ],
      correct: 2,
      explanation: "Hands-on experience is valued more than formal education in the cloud field. Employers want to see you can actually build and deploy solutions."
    },
    {
      id: 3,
      question: "Which of these represents the biggest advantage urban professionals have in cloud careers?",
      options: [
        "Lower cost of living",
        "Less competition for jobs",
        "Proximity to tech companies and networking opportunities",
        "Better internet connections"
      ],
      correct: 2,
      explanation: "Urban areas offer unmatched networking opportunities and proximity to companies actively hiring cloud talent."
    }
  ];

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) correct++;
    });
    return correct;
  };

  return (
    <div className="space-y-6">
      <div className="card bg-dark-bg-secondary/30">
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-6 h-6 text-primary-400" />
          <h3 className="text-xl font-semibold text-dark-text-primary">
            Interactive Quiz: Cloud Career Paths
          </h3>
        </div>

        <div className="space-y-8">
          {questions.map((question, qIndex) => (
            <div key={question.id} className="space-y-4">
              <h4 className="font-medium text-dark-text-primary">
                {qIndex + 1}. {question.question}
              </h4>
              
              <div className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <button
                    key={oIndex}
                    onClick={() => handleAnswerSelect(question.id, oIndex)}
                    disabled={showResults}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      selectedAnswers[question.id] === oIndex
                        ? showResults
                          ? oIndex === question.correct
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-primary-500 bg-primary-500/10 text-primary-400'
                        : showResults && oIndex === question.correct
                        ? 'border-green-500 bg-green-500/10 text-green-400'
                        : 'border-dark-border bg-dark-bg-secondary text-dark-text-secondary hover:border-primary-500/50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {showResults && (
                <div className="card bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-dark-text-primary mb-1">Explanation</h5>
                      <p className="text-sm text-dark-text-secondary">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!showResults ? (
          <div className="pt-6 border-t border-dark-border">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length < questions.length}
              className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              Submit Answers
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="pt-6 border-t border-dark-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-dark-text-primary">
                  Your Score: {getScore()}/{questions.length}
                </h4>
                <p className="text-dark-text-secondary text-sm">
                  {getScore() === questions.length
                    ? "Perfect! You really understand cloud career opportunities."
                    : getScore() >= questions.length * 0.7
                    ? "Great job! You have a solid understanding of cloud careers."
                    : "Keep learning! Review the material and try again."
                  }
                </p>
              </div>
              
              {getScore() >= questions.length * 0.7 && (
                <button
                  onClick={onComplete}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Lesson
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}