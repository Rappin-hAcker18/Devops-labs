# Video Infrastructure Setup Guide

## Overview
This guide will help you set up the complete video streaming infrastructure for CloudCrew Academy using AWS S3, CloudFront, and DynamoDB.

## Prerequisites
- AWS CLI configured with proper credentials
- Serverless Framework installed
- Node.js 18+ installed

## Step 1: Deploy Video Infrastructure

```powershell
# Navigate to backend directory
cd backend

# Deploy the video infrastructure stack
npx serverless deploy --config video-infrastructure.yml --stage dev
```

This will create:
- **S3 Bucket**: `cloudcrew-videos-dev` for storing video files
- **CloudFront Distribution**: CDN for fast global video delivery
- **DynamoDB Tables**: 
  - `cloudcrew-video-metadata-dev`: Video information
  - `cloudcrew-video-progress-dev`: User watch progress

## Step 2: Update Environment Variables

After deployment, add these to your `.env.local`:

```bash
# Video Infrastructure
NEXT_PUBLIC_VIDEO_BUCKET=cloudcrew-videos-dev
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=<your-cloudfront-domain>.cloudfront.net
NEXT_PUBLIC_VIDEO_METADATA_TABLE=cloudcrew-video-metadata-dev
NEXT_PUBLIC_VIDEO_PROGRESS_TABLE=cloudcrew-video-progress-dev
```

Get your CloudFront domain from the deployment output or AWS Console.

## Step 3: Add Video Functions to Main Backend

The video handler functions are already created in `backend/src/handlers/videos.ts`. Now update your main `serverless.yml` to include them:

```yaml
# Add to provider.environment section
VIDEO_METADATA_TABLE: cloudcrew-video-metadata-${self:provider.stage}
VIDEO_PROGRESS_TABLE: cloudcrew-video-progress-${self:provider.stage}
VIDEO_BUCKET: cloudcrew-videos-${self:provider.stage}
CLOUDFRONT_DOMAIN: ${cf:cloudcrew-video-infrastructure-${self:provider.stage}.VideoCloudFrontDomain}

# Add to provider.iam.role.statements
- Effect: Allow
  Action:
    - s3:GetObject
    - s3:PutObject
    - s3:DeleteObject
  Resource: "arn:aws:s3:::cloudcrew-videos-${self:provider.stage}/*"
- Effect: Allow
  Action:
    - s3:ListBucket
  Resource: "arn:aws:s3:::cloudcrew-videos-${self:provider.stage}"

# Add video functions
functions:
  # ... existing functions ...
  
  # Video Management
  getUploadUrl:
    handler: src/handlers/videos.getUploadUrl
    events:
      - http:
          path: /api/videos/upload-url
          method: post
          cors: true
          authorizer:
            type: COGNITO_USER_POOLS
            arn: ${self:custom.cognitoUserPoolArn}

  saveVideoMetadata:
    handler: src/handlers/videos.saveVideoMetadata
    events:
      - http:
          path: /api/videos/metadata
          method: post
          cors: true
          authorizer:
            type: COGNITO_USER_POOLS
            arn: ${self:custom.cognitoUserPoolArn}

  getVideo:
    handler: src/handlers/videos.getVideo
    events:
      - http:
          path: /api/videos/{videoId}
          method: get
          cors: true

  getVideosByCourse:
    handler: src/handlers/videos.getVideosByCourse
    events:
      - http:
          path: /api/courses/{courseId}/videos
          method: get
          cors: true

  trackVideoProgress:
    handler: src/handlers/videos.trackVideoProgress
    events:
      - http:
          path: /api/videos/progress
          method: post
          cors: true

  getUserVideoProgress:
    handler: src/handlers/videos.getUserVideoProgress
    events:
      - http:
          path: /api/videos/{videoId}/progress
          method: get
          cors: true
```

## Step 4: Deploy Updated Backend

```powershell
# Deploy the main backend with video functions
npx serverless deploy --stage dev
```

## Step 5: Test Video Upload

Use the provided test script:

```powershell
# Test getting upload URL
node scripts/test-video-upload.js
```

## Architecture Overview

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         │ (HTTPS)
         │
┌────────▼─────────────────────────────────────┐
│         CloudFront Distribution              │
│  (Global CDN - Low Latency Video Delivery)   │
└────────┬─────────────────────────────────────┘
         │
         │ (Origin Access Control)
         │
┌────────▼────────┐        ┌──────────────────┐
│   S3 Bucket     │        │  Lambda Functions│
│  Video Storage  │◄───────┤   (Video API)    │
└─────────────────┘        └────────┬─────────┘
                                    │
                          ┌─────────▼──────────┐
                          │  DynamoDB Tables   │
                          │  - Video Metadata  │
                          │  - Video Progress  │
                          └────────────────────┘
```

## Features

### ✅ Implemented
- S3 bucket with CloudFront CDN
- Presigned URL upload
- Video metadata storage
- Progress tracking
- View count analytics
- CORS configuration
- CloudFront caching strategies

### 🚧 Next Steps
1. **HLS Streaming**: Convert videos to adaptive bitrate streaming
2. **Video Transcoding**: AWS MediaConvert for multiple resolutions
3. **Offline Download**: Generate signed download URLs for premium users
4. **DRM Protection**: AWS Elemental MediaPackage for content protection
5. **Thumbnail Generation**: Lambda function to extract video thumbnails
6. **Search & Filter**: ElasticSearch integration for video search

## Security

- **Private S3 Bucket**: No public access, only CloudFront can read
- **Origin Access Control**: CloudFront uses OAC for secure S3 access
- **HTTPS Only**: All video delivery over HTTPS
- **Signed URLs**: Presigned URLs expire after 1 hour
- **Authentication**: Video upload requires Cognito authentication
- **Content Protection**: Videos only accessible through authorized endpoints

## Cost Optimization

- **CloudFront Caching**: Reduces S3 GET requests (default: 24 hours)
- **HLS Segments**: Short cache for manifest files (5 seconds)
- **S3 Lifecycle**: Auto-delete incomplete multipart uploads after 7 days
- **Pay-per-request**: DynamoDB pricing scales with usage
- **Price Class 100**: CloudFront only uses US, Canada, Europe edge locations

## Monitoring

Check CloudWatch metrics for:
- CloudFront: Cache hit ratio, error rates
- S3: GET/PUT requests, data transfer
- DynamoDB: Read/write capacity
- Lambda: Execution duration, errors

## Next: Create Video Upload UI

Now that infrastructure is ready, create an admin interface to upload videos. See `docs/video-admin-ui.md` for details.
