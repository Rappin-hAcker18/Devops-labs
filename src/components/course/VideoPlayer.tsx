"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCw } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  courseId: string;
  title: string;
  userId?: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
}

export function VideoPlayer({ 
  videoId,
  courseId,
  title, 
  userId, 
  onProgress, 
  onComplete, 
  autoPlay = false 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const trackProgress = useCallback(async (
    currentTime: number,
    totalDuration: number,
    completed = false
  ) => {
    try {
      await fetch('/api/videos/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          courseId,
          currentTime,
          duration: totalDuration,
          completed
        })
      });
    } catch (err) {
      console.error('Failed to track progress:', err);
    }
  }, [videoId, courseId]);

  // Fetch video metadata and CloudFront URL
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/videos/metadata?videoId=${videoId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load video');
        }
        
        const data = await response.json();
        
        if (data.video?.cloudFrontUrl) {
          setVideoUrl(data.video.cloudFrontUrl);
        } else {
          // Fallback: construct CloudFront URL from videoId
          const cloudFrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
          setVideoUrl(`https://${cloudFrontDomain}/videos/${videoId}`);
        }
      } catch (err) {
        console.error('Error fetching video:', err);
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchVideoUrl();
    }
  }, [videoId]);

  // Track video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const total = video.duration;
      
      if (total > 0) {
        const progressPercent = (current / total) * 100;
        setProgress(progressPercent);
        setCurrentTime(current);
        setDuration(total);

        // Call onProgress callback
        if (onProgress) {
          onProgress(current, total);
        }

        // Track progress in backend every 5 seconds
        if (userId && Math.floor(current) % 5 === 0) {
          trackProgress(current, total);
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) {
        onComplete();
      }
      if (userId) {
        trackProgress(duration, duration, true);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [userId, duration, onProgress, onComplete, trackProgress]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = seekTime;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-br from-slate-900 to-blue-900 aspect-video rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center text-white">
          <RotateCw className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !videoUrl) {
    return (
      <div className="relative bg-gradient-to-br from-slate-900 to-red-900 aspect-video rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg text-red-300 mb-2">Failed to load video</p>
          <p className="text-sm text-slate-300">{error || 'Video URL not available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        className="w-full aspect-video"
        src={videoUrl}
        autoPlay={autoPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Title */}
        <div className="absolute top-4 left-4 right-4">
          <h3 className="text-white font-semibold text-lg drop-shadow-lg">{title}</h3>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 ${progress}%, #4b5563 ${progress}%)`
            }}
          />

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="hover:scale-110 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="hover:scale-110 transition-transform"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Time */}
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="hover:scale-110 transition-transform"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Play Button Overlay (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-blue-600/90 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl"
          >
            <Play className="w-10 h-10 text-white ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
