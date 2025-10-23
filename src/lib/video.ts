/**
 * Video Content Management System
 * Handles video storage, streaming, and adaptive quality
 */

export interface VideoSource {
  quality: '720p' | '1080p' | '480p' | '360p';
  url: string;
  size: number;
  bitrate: number;
}

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  thumbnail: string;
  sources: VideoSource[];
  transcripts?: {
    language: string;
    url: string;
  }[];
  tags: string[];
  courseId: string;
  lessonId: string;
  uploadedAt: string;
  processedAt?: string;
  status: 'processing' | 'ready' | 'error';
}

export interface VideoProgress {
  videoId: string;
  userId: string;
  currentTime: number;
  duration: number;
  completed: boolean;
  watchedPercent: number;
  lastWatched: string;
}

// Video quality detection based on network and device
export function detectOptimalQuality(): '720p' | '1080p' | '480p' | '360p' {
  // Check network connection
  const connection = (navigator as any).connection;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (connection) {
    const effectiveType = connection.effectiveType;
    const downlink = connection.downlink; // Mbps
    
    // Auto-select quality based on network speed
    if (downlink >= 10 && effectiveType === '4g' && !isMobile) {
      return '1080p';
    } else if (downlink >= 5 && effectiveType === '4g') {
      return '720p';
    } else if (downlink >= 2) {
      return '480p';
    } else {
      return '360p';
    }
  }
  
  // Fallback based on device
  return isMobile ? '480p' : '720p';
}

// Generate CloudFront streaming URLs with signed URLs for security
export function generateStreamingUrl(videoId: string, quality: string = 'auto'): string {
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || 'https://d1234567890.cloudfront.net';
  
  if (quality === 'auto') {
    quality = detectOptimalQuality();
  }
  
  // In production, this would generate signed URLs for security
  return `${baseUrl}/videos/${videoId}/${quality}/index.m3u8`;
}

// Mock video data for development
export const mockVideoData: VideoMetadata[] = [
  {
    id: 'intro-to-aws',
    title: 'Introduction to AWS Cloud',
    description: 'Learn the fundamentals of Amazon Web Services and cloud computing',
    duration: 1200, // 20 minutes
    thumbnail: '/videos/thumbnails/intro-aws.jpg',
    sources: [
      {
        quality: '1080p',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        size: 50000000, // 50MB
        bitrate: 5000
      },
      {
        quality: '720p',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        size: 30000000, // 30MB
        bitrate: 3000
      },
      {
        quality: '480p',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4',
        size: 15000000, // 15MB
        bitrate: 1500
      },
      {
        quality: '360p',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4',
        size: 8000000, // 8MB
        bitrate: 800
      }
    ],
    transcripts: [
      {
        language: 'en',
        url: '/videos/transcripts/intro-aws-en.vtt'
      }
    ],
    tags: ['aws', 'cloud', 'fundamentals'],
    courseId: 'aws-fundamentals',
    lessonId: 'lesson-1',
    uploadedAt: '2024-01-15T10:00:00Z',
    processedAt: '2024-01-15T10:05:00Z',
    status: 'ready'
  },
  {
    id: 'ec2-basics',
    title: 'EC2 Instance Management',
    description: 'Master Amazon EC2 instances and server management',
    duration: 1800, // 30 minutes
    thumbnail: '/videos/thumbnails/ec2-basics.jpg',
    sources: [
      {
        quality: '1080p',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        size: 75000000,
        bitrate: 5000
      },
      {
        quality: '720p',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        size: 45000000,
        bitrate: 3000
      },
      {
        quality: '480p',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_2mb.mp4',
        size: 22000000,
        bitrate: 1500
      },
      {
        quality: '360p',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_2mb.mp4',
        size: 12000000,
        bitrate: 800
      }
    ],
    transcripts: [
      {
        language: 'en',
        url: '/videos/transcripts/ec2-basics-en.vtt'
      }
    ],
    tags: ['aws', 'ec2', 'servers'],
    courseId: 'aws-fundamentals',
    lessonId: 'lesson-2',
    uploadedAt: '2024-01-16T10:00:00Z',
    processedAt: '2024-01-16T10:08:00Z',
    status: 'ready'
  },
  {
    id: 'database-fundamentals',
    title: 'RDS and Database Management',
    description: 'Learn database management with Amazon RDS',
    duration: 2100, // 35 minutes
    thumbnail: '/videos/thumbnails/rds-basics.jpg',
    sources: [
      {
        quality: '1080p',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
        size: 90000000,
        bitrate: 5000
      },
      {
        quality: '720p',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
        size: 55000000,
        bitrate: 3000
      },
      {
        quality: '480p',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_5mb.mp4',
        size: 28000000,
        bitrate: 1500
      },
      {
        quality: '360p',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_5mb.mp4',
        size: 15000000,
        bitrate: 800
      }
    ],
    transcripts: [
      {
        language: 'en',
        url: '/videos/transcripts/rds-basics-en.vtt'
      }
    ],
    tags: ['aws', 'rds', 'database'],
    courseId: 'aws-fundamentals',
    lessonId: 'lesson-3',
    uploadedAt: '2024-01-17T10:00:00Z',
    processedAt: '2024-01-17T10:10:00Z',
    status: 'ready'
  }
];

// Video analytics and tracking
export class VideoAnalytics {
  static trackVideoStart(videoId: string, userId: string) {
    // Track when user starts watching a video
    console.log(`Video started: ${videoId} by user ${userId}`);
    
    // In production, send to analytics service
    if (typeof window !== 'undefined') {
      // Client-side analytics
      (window as any).gtag?.('event', 'video_start', {
        video_id: videoId,
        user_id: userId
      });
    }
  }
  
  static trackVideoProgress(videoId: string, userId: string, progress: number) {
    // Track video progress at 25%, 50%, 75%, 100%
    const milestones = [25, 50, 75, 100];
    const milestone = milestones.find(m => Math.abs(progress - m) < 2);
    
    if (milestone) {
      console.log(`Video ${milestone}% complete: ${videoId} by user ${userId}`);
      
      if (typeof window !== 'undefined') {
        (window as any).gtag?.('event', 'video_progress', {
          video_id: videoId,
          user_id: userId,
          progress: milestone
        });
      }
    }
  }
  
  static trackVideoComplete(videoId: string, userId: string, duration: number) {
    console.log(`Video completed: ${videoId} by user ${userId} in ${duration}s`);
    
    if (typeof window !== 'undefined') {
      (window as any).gtag?.('event', 'video_complete', {
        video_id: videoId,
        user_id: userId,
        duration: duration
      });
    }
  }
}

// Video storage utilities
export const VideoStorage = {
  // Get video by ID
  getVideo: (videoId: string): VideoMetadata | undefined => {
    return mockVideoData.find(video => video.id === videoId);
  },
  
  // Get videos by course
  getVideosByCourse: (courseId: string): VideoMetadata[] => {
    return mockVideoData.filter(video => video.courseId === courseId);
  },
  
  // Get optimal video source based on network/device
  getOptimalSource: (video: VideoMetadata): VideoSource => {
    const optimalQuality = detectOptimalQuality();
    return video.sources.find(source => source.quality === optimalQuality) || video.sources[0];
  },
  
  // Format duration for display
  formatDuration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },
  
  // Calculate video file size for download estimation
  estimateDownloadTime: (source: VideoSource, connectionSpeed: number = 5): number => {
    // connectionSpeed in Mbps, returns time in seconds
    const sizeInMb = source.size / (1024 * 1024);
    return Math.ceil(sizeInMb / connectionSpeed);
  }
};