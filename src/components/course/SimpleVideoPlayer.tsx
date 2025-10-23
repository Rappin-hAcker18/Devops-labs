"use client";

import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface SimpleVideoPlayerProps {
  title: string;
  onComplete?: () => void;
}

export function SimpleVideoPlayer({ title, onComplete }: SimpleVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompletedRef = useRef(false);

  const startLesson = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsPlaying(true);
    setProgress(0);
    hasCompletedRef.current = false;

    let currentProgress = 0;
    intervalRef.current = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(intervalRef.current!);
        setIsPlaying(false);
        
        // Only call onComplete once
        if (!hasCompletedRef.current && onComplete) {
          hasCompletedRef.current = true;
          onComplete();
        }
      }
    }, 200);
  };

  const stopLesson = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
    hasCompletedRef.current = false;
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-blue-900 aspect-video rounded-lg overflow-hidden">
      {/* Debug Info */}
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-50">
        Playing: {isPlaying ? 'YES' : 'NO'} | Progress: {progress}%
      </div>

      {!isPlaying && progress === 0 && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center text-white max-w-lg">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-12 h-12 text-white ml-1" />
            </div>
            
            <h3 className="text-3xl font-bold mb-4">{title}</h3>
            <p className="text-blue-200 mb-6 text-lg">Professional AWS Training Content</p>
            
            <button
              onClick={startLesson}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              ▶ Start AWS Lesson
            </button>
          </div>
        </div>
      )}

      {isPlaying && (
        <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Pause className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Learning in Progress...</h4>
            <p className="text-blue-200 mb-4">{title}</p>
            <div className="w-64 h-2 bg-slate-700 rounded-full mx-auto">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-400 mt-2">
              {progress}% Complete
            </p>
            <button
              onClick={stopLesson}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
            >
              Stop Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
}