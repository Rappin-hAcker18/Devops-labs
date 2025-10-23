# CloudCrew Academy Video Streaming Infrastructure

## Overview
This document outlines the video content delivery infrastructure for CloudCrew Academy, ensuring high-quality, accessible, and scalable video streaming for our cloud engineering courses.

## Video Content Inventory

### AWS Fundamentals Course
```json
{
  "courseId": "aws-fundamentals",
  "totalDuration": "12 hours 45 minutes",
  "lessons": [
    {
      "id": "lesson-1-1",
      "title": "What is Cloud Computing?",
      "duration": "15:30",
      "videoFiles": {
        "1080p": "https://cdn.cloudcrew.academy/videos/aws-fundamentals/lesson-1-1-1080p.mp4",
        "720p": "https://cdn.cloudcrew.academy/videos/aws-fundamentals/lesson-1-1-720p.mp4",
        "480p": "https://cdn.cloudcrew.academy/videos/aws-fundamentals/lesson-1-1-480p.mp4",
        "360p": "https://cdn.cloudcrew.academy/videos/aws-fundamentals/lesson-1-1-360p.mp4"
      },
      "subtitles": {
        "en": "https://cdn.cloudcrew.academy/captions/aws-fundamentals/lesson-1-1-en.vtt",
        "es": "https://cdn.cloudcrew.academy/captions/aws-fundamentals/lesson-1-1-es.vtt"
      },
      "thumbnail": "https://cdn.cloudcrew.academy/thumbnails/aws-fundamentals/lesson-1-1.jpg",
      "chapters": [
        {"title": "Introduction to Cloud Computing", "time": "00:00"},
        {"title": "Cloud vs Traditional Infrastructure", "time": "03:00"},
        {"title": "Service Models (IaaS, PaaS, SaaS)", "time": "06:30"},
        {"title": "Cloud Deployment Models", "time": "10:45"},
        {"title": "Business Benefits & ROI", "time": "13:15"}
      ]
    },
    {
      "id": "lesson-1-2",
      "title": "AWS Core Services Overview",
      "duration": "20:15",
      "videoFiles": {
        "1080p": "https://cdn.cloudcrew.academy/videos/aws-fundamentals/lesson-1-2-1080p.mp4",
        "720p": "https://cdn.cloudcrew.academy/videos/aws-fundamentals/lesson-1-2-720p.mp4",
        "480p": "https://cdn.cloudcrew.academy/videos/aws-fundamentals/lesson-1-2-480p.mp4",
        "360p": "https://cdn.cloudcrew.academy/videos/aws-fundamentals/lesson-1-2-360p.mp4"
      },
      "subtitles": {
        "en": "https://cdn.cloudcrew.academy/captions/aws-fundamentals/lesson-1-2-en.vtt",
        "es": "https://cdn.cloudcrew.academy/captions/aws-fundamentals/lesson-1-2-es.vtt"
      },
      "thumbnail": "https://cdn.cloudcrew.academy/thumbnails/aws-fundamentals/lesson-1-2.jpg"
    },
    {
      "id": "lesson-1-3",
      "title": "Setting Up Your AWS Account",
      "duration": "45:00",
      "type": "hands-on-lab",
      "videoFiles": {
        "1080p": "https://cdn.cloudcrew.academy/videos/aws-fundamentals/lesson-1-3-1080p.mp4",
        "720p": "https://cdn.cloudcrew.academy/videos/aws-fundamentals/lesson-1-3-720p.mp4",
        "480p": "https://cdn.cloudcrew.academy/videos/aws-fundamentals/lesson-1-3-480p.mp4"
      },
      "labResources": {
        "worksheet": "https://cdn.cloudcrew.academy/labs/aws-fundamentals/lesson-1-3-worksheet.pdf",
        "checklist": "https://cdn.cloudcrew.academy/labs/aws-fundamentals/lesson-1-3-checklist.pdf"
      }
    }
  ]
}
```

## Content Delivery Network (CDN) Configuration

### AWS CloudFront Distribution
```yaml
CloudFrontDistribution:
  Type: AWS::CloudFront::Distribution
  Properties:
    DistributionConfig:
      Aliases:
        - cdn.cloudcrew.academy
      DefaultCacheBehavior:
        TargetOriginId: S3Origin
        ViewerProtocolPolicy: redirect-to-https
        AllowedMethods:
          - GET
          - HEAD
          - OPTIONS
        CachedMethods:
          - GET
          - HEAD
        Compress: true
        CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad # Managed-CachingOptimized
      Origins:
        - Id: S3Origin
          DomainName: cloudcrew-academy-videos.s3.amazonaws.com
          S3OriginConfig:
            OriginAccessIdentity: !Ref OriginAccessIdentity
      PriceClass: PriceClass_100
      ViewerCertificate:
        AcmCertificateArn: arn:aws:acm:us-east-1:123456789012:certificate/cert-id
        SslSupportMethod: sni-only
```

## Adaptive Bitrate Streaming

### HLS (HTTP Live Streaming) Configuration
```javascript
// Video.js HLS Configuration
const player = videojs('video-player', {
  fluid: true,
  responsive: true,
  sources: [{
    src: 'https://cdn.cloudcrew.academy/videos/aws-fundamentals/lesson-1-1/playlist.m3u8',
    type: 'application/x-mpegURL'
  }],
  tracks: [{
    kind: 'captions',
    src: 'https://cdn.cloudcrew.academy/captions/aws-fundamentals/lesson-1-1-en.vtt',
    srclang: 'en',
    label: 'English',
    default: true
  }]
});

// Quality selector
player.ready(() => {
  player.qualityLevels();
  player.hlsQualitySelector({
    displayCurrentQuality: true,
  });
});
```

## Video Analytics and Tracking

### Progress Tracking
```javascript
// Video progress tracking
player.on('timeupdate', function() {
  const currentTime = player.currentTime();
  const duration = player.duration();
  const progress = (currentTime / duration) * 100;
  
  // Update progress in database
  updateLessonProgress({
    lessonId: 'lesson-1-1',
    userId: getCurrentUserId(),
    progress: Math.round(progress),
    currentTime: currentTime,
    timestamp: new Date().toISOString()
  });
});

// Completion tracking
player.on('ended', function() {
  markLessonComplete({
    lessonId: 'lesson-1-1',
    userId: getCurrentUserId(),
    completedAt: new Date().toISOString()
  });
});
```

## Accessibility Features

### Closed Captions (WebVTT Format)
```vtt
WEBVTT

NOTE
CloudCrew Academy - AWS Fundamentals Lesson 1.1

00:00.000 --> 00:03.000
Welcome to CloudCrew Academy! I'm excited to be your instructor.

00:03.000 --> 00:06.500
In today's lesson, we're going to answer one of the most fundamental questions.

00:06.500 --> 00:10.000
What exactly is cloud computing?

00:10.000 --> 00:14.500
By the end of this lesson, you'll have a crystal-clear understanding.
```

### Audio Descriptions
```vtt
WEBVTT

NOTE
Audio descriptions for visually impaired learners

00:00.000 --> 00:03.000
[Instructor appears on screen with CloudCrew Academy logo background]

00:03.000 --> 00:06.500
[Animation showing traditional servers transforming into cloud symbols]

00:06.500 --> 00:10.000
[Diagram displays the three cloud service models: IaaS, PaaS, SaaS]
```

## Mobile Optimization

### Progressive Web App (PWA) Video Features
```javascript
// Service Worker for offline video caching
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/videos/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version or fetch from network
          return response || fetch(event.request);
        })
    );
  }
});

// Background sync for progress updates
self.addEventListener('sync', event => {
  if (event.tag === 'progress-sync') {
    event.waitUntil(syncProgressData());
  }
});
```

### Responsive Video Player
```css
/* Mobile-first video player styles */
.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.video-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Mobile-specific controls */
@media (max-width: 768px) {
  .vjs-control-bar {
    font-size: 16px;
    height: 44px; /* Touch-friendly size */
  }
  
  .vjs-play-control {
    min-width: 44px;
  }
}
```

## Content Security

### DRM Protection (Widevine/FairPlay)
```javascript
// DRM configuration for premium content
const drmConfig = {
  widevine: {
    url: 'https://drm.cloudcrew.academy/widevine/license',
    httpRequestHeaders: {
      'Authorization': 'Bearer ' + getAuthToken()
    }
  },
  fairplay: {
    certificateUrl: 'https://drm.cloudcrew.academy/fairplay/cert',
    licenseUrl: 'https://drm.cloudcrew.academy/fairplay/license'
  }
};
```

### Signed URLs for Content Protection
```javascript
// Generate time-limited access URLs
const generateSignedUrl = (videoPath, userId, expiresIn = 3600) => {
  const signature = crypto
    .createHmac('sha256', process.env.VIDEO_SIGNING_KEY)
    .update(`${videoPath}:${userId}:${Date.now() + expiresIn}`)
    .digest('hex');
    
  return `${videoPath}?user=${userId}&expires=${Date.now() + expiresIn}&signature=${signature}`;
};
```

## Performance Optimization

### Video Preloading Strategy
```javascript
// Intelligent preloading based on user behavior
const preloadNextVideo = () => {
  const nextLessonId = getNextLessonId();
  if (nextLessonId && isLikelyToWatch()) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = getVideoUrl(nextLessonId, '720p');
    document.head.appendChild(link);
  }
};

// Adaptive quality based on connection
const adaptiveQuality = () => {
  const connection = navigator.connection;
  if (connection) {
    const effectiveType = connection.effectiveType;
    const qualityMap = {
      'slow-2g': '360p',
      '2g': '360p', 
      '3g': '480p',
      '4g': '720p'
    };
    return qualityMap[effectiveType] || '720p';
  }
  return '720p';
};
```

## Deployment Pipeline

### Video Processing Workflow
```yaml
# GitHub Actions workflow for video processing
name: Video Processing Pipeline

on:
  push:
    paths:
      - 'content/videos/**'

jobs:
  process-videos:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup FFmpeg
        uses: FedericoCarboni/setup-ffmpeg@v2
        
      - name: Process Videos
        run: |
          # Generate multiple quality versions
          ffmpeg -i input.mp4 -vf scale=1920:1080 -c:v h264 -crf 23 output-1080p.mp4
          ffmpeg -i input.mp4 -vf scale=1280:720 -c:v h264 -crf 25 output-720p.mp4
          ffmpeg -i input.mp4 -vf scale=854:480 -c:v h264 -crf 28 output-480p.mp4
          ffmpeg -i input.mp4 -vf scale=640:360 -c:v h264 -crf 30 output-360p.mp4
          
          # Generate HLS playlist
          ffmpeg -i input.mp4 -c:v h264 -c:a aac -hls_time 10 -hls_playlist_type vod playlist.m3u8
          
      - name: Upload to S3
        run: |
          aws s3 sync ./processed/ s3://cloudcrew-academy-videos/ --delete
          
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
```

## Monitoring and Analytics

### Video Analytics Dashboard
```javascript
// Video analytics collection
const trackVideoEvent = (event, data) => {
  analytics.track(event, {
    lessonId: data.lessonId,
    userId: data.userId,
    videoQuality: data.quality,
    playbackPosition: data.currentTime,
    totalDuration: data.duration,
    device: getDeviceInfo(),
    connection: getConnectionInfo(),
    timestamp: new Date().toISOString()
  });
};

// Key metrics to track
const videoMetrics = {
  'video_start': { lessonId, userId, quality },
  'video_pause': { lessonId, userId, currentTime },
  'video_resume': { lessonId, userId, currentTime },
  'video_complete': { lessonId, userId, duration },
  'video_skip': { lessonId, userId, fromTime, toTime },
  'quality_change': { lessonId, userId, fromQuality, toQuality },
  'error': { lessonId, userId, errorCode, errorMessage }
};
```

---

**Last Updated**: October 2025  
**CloudCrew Academy** | Professional Cloud Engineering Education