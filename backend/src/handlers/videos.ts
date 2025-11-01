import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const s3Client = new S3Client({});

const VIDEO_METADATA_TABLE = process.env.VIDEO_METADATA_TABLE || '';
const VIDEO_PROGRESS_TABLE = process.env.VIDEO_PROGRESS_TABLE || '';
const VIDEO_BUCKET = process.env.VIDEO_BUCKET || '';
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// Generate presigned URL for video upload
export const getUploadUrl = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('getUploadUrl called');
    console.log('VIDEO_BUCKET:', VIDEO_BUCKET);
    console.log('Event body:', event.body);
    
    // For admin upload, userId is optional (can be added later with proper admin auth)
    const userId = event.requestContext.authorizer?.claims?.sub || 'admin';

    if (!event.body) {
      console.error('No request body');
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const { fileName, fileType, courseId } = JSON.parse(event.body);
    console.log('Parsed body:', { fileName, fileType, courseId });

    if (!fileName || !fileType || !courseId) {
      console.error('Missing required fields');
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'fileName, fileType, and courseId are required' })
      };
    }

    if (!VIDEO_BUCKET) {
      console.error('VIDEO_BUCKET environment variable not set');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Server configuration error: VIDEO_BUCKET not set' })
      };
    }

    // Generate unique video ID
    const videoId = `${courseId}/${Date.now()}-${fileName}`;
    const key = `videos/${videoId}`;
    console.log('Generated key:', key);

    // Generate presigned URL for upload
    const command = new PutObjectCommand({
      Bucket: VIDEO_BUCKET,
      Key: key,
      ContentType: fileType,
      Metadata: {
        uploadedBy: userId,
        courseId: courseId
      }
    });

    console.log('Generating presigned URL...');
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('Presigned URL generated successfully');

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        uploadUrl,
        videoId,
        key
      })
    };
  } catch (error) {
    console.error('Error in getUploadUrl:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: 'Failed to generate upload URL',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

// Save video metadata after upload
export const saveVideoMetadata = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // For admin upload, userId is optional (can be added later with proper admin auth)
    const userId = event.requestContext.authorizer?.claims?.sub || 'admin';

    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const { videoId, title, description, courseId, duration, thumbnail, order } = JSON.parse(event.body);

    if (!videoId || !title || !courseId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'videoId, title, and courseId are required' })
      };
    }

    const videoMetadata = {
      videoId,
      title,
      description: description || '',
      courseId,
      duration: duration || 0,
      thumbnail: thumbnail || '',
      order: order || 0,
      uploadedBy: userId,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
      viewCount: 0,
      cloudFrontUrl: `https://${CLOUDFRONT_DOMAIN}/videos/${videoId}`
    };

    const command = new PutCommand({
      TableName: VIDEO_METADATA_TABLE,
      Item: videoMetadata
    });

    await docClient.send(command);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Video metadata saved successfully',
        video: videoMetadata
      })
    };
  } catch (error) {
    console.error('Error saving video metadata:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Failed to save video metadata' })
    };
  }
};

// Get video by ID
export const getVideo = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const videoId = event.pathParameters?.videoId;

    if (!videoId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'videoId is required' })
      };
    }

    const command = new GetCommand({
      TableName: VIDEO_METADATA_TABLE,
      Key: { videoId }
    });

    const result = await docClient.send(command);

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Video not found' })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error('Error getting video:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Failed to get video' })
    };
  }
};

// Get videos by course
export const getVideosByCourse = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const courseId = event.pathParameters?.courseId;

    if (!courseId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'courseId is required' })
      };
    }

    const command = new QueryCommand({
      TableName: VIDEO_METADATA_TABLE,
      IndexName: 'CourseIdIndex',
      KeyConditionExpression: 'courseId = :courseId',
      ExpressionAttributeValues: {
        ':courseId': courseId
      }
    });

    const result = await docClient.send(command);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        videos: result.Items || [],
        count: result.Items?.length || 0
      })
    };
  } catch (error) {
    console.error('Error getting videos by course:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Failed to get videos' })
    };
  }
};

// Track video progress
export const trackVideoProgress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub || 'anonymous';

    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const { videoId, currentTime, duration, completed } = JSON.parse(event.body);

    if (!videoId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'videoId is required' })
      };
    }

    const progressData = {
      userId,
      videoId,
      currentTime: currentTime || 0,
      duration: duration || 0,
      completed: completed || false,
      lastWatchedAt: new Date().toISOString(),
      progressPercentage: duration > 0 ? Math.round((currentTime / duration) * 100) : 0
    };

    const command = new PutCommand({
      TableName: VIDEO_PROGRESS_TABLE,
      Item: progressData
    });

    await docClient.send(command);

    // Update video view count if first time watching
    const getCommand = new GetCommand({
      TableName: VIDEO_PROGRESS_TABLE,
      Key: { userId, videoId }
    });

    const existing = await docClient.send(getCommand);

    if (!existing.Item) {
      // Increment view count
      const updateCommand = new UpdateCommand({
        TableName: VIDEO_METADATA_TABLE,
        Key: { videoId },
        UpdateExpression: 'SET viewCount = if_not_exists(viewCount, :zero) + :inc',
        ExpressionAttributeValues: {
          ':zero': 0,
          ':inc': 1
        }
      });

      await docClient.send(updateCommand);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Progress tracked successfully',
        progress: progressData
      })
    };
  } catch (error) {
    console.error('Error tracking video progress:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Failed to track progress' })
    };
  }
};

// Get user's video progress
export const getUserVideoProgress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub || 'anonymous';
    const videoId = event.pathParameters?.videoId;

    if (!videoId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'videoId is required' })
      };
    }

    const command = new GetCommand({
      TableName: VIDEO_PROGRESS_TABLE,
      Key: { userId, videoId }
    });

    const result = await docClient.send(command);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Item || {
        userId,
        videoId,
        currentTime: 0,
        duration: 0,
        completed: false,
        progressPercentage: 0
      })
    };
  } catch (error) {
    console.error('Error getting video progress:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Failed to get progress' })
    };
  }
};
