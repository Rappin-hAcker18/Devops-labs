import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const COURSE_PROGRESS_TABLE = process.env.COURSE_PROGRESS_TABLE!;

// Helper function to create CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

export const getProgress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const courseId = event.pathParameters?.courseId;
    const userId = event.requestContext.authorizer?.claims?.sub;

    if (!courseId || !userId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Course ID and user ID are required' })
      };
    }

    const getCommand = new GetCommand({
      TableName: COURSE_PROGRESS_TABLE,
      Key: {
        userId,
        courseId
      }
    });

    const result = await docClient.send(getCommand);

    if (!result.Item) {
      // Return default progress if none exists
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          userId,
          courseId,
          progressPercentage: 0,
          completedLessons: [],
          currentLesson: null,
          timeSpent: 0,
          lastAccessedAt: new Date().toISOString(),
          startedAt: new Date().toISOString()
        })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Item)
    };

  } catch (error: any) {
    console.error('Error getting progress:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: error.message || 'Failed to get progress'
      })
    };
  }
};

export const updateProgress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const courseId = event.pathParameters?.courseId;
    const userId = event.requestContext.authorizer?.claims?.sub;

    if (!courseId || !userId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Course ID and user ID are required' })
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const {
      lessonId,
      progressPercentage,
      timeSpent,
      completed,
      quizScores,
      notes
    } = JSON.parse(event.body);

    // Get current progress first
    const getCommand = new GetCommand({
      TableName: COURSE_PROGRESS_TABLE,
      Key: {
        userId,
        courseId
      }
    });

    const currentResult = await docClient.send(getCommand);
    const currentProgress = currentResult.Item || {
      userId,
      courseId,
      progressPercentage: 0,
      completedLessons: [],
      timeSpent: 0,
      startedAt: new Date().toISOString()
    };

    // Update progress data
    const updatedCompletedLessons = [...(currentProgress.completedLessons || [])];
    if (completed && lessonId && !updatedCompletedLessons.includes(lessonId)) {
      updatedCompletedLessons.push(lessonId);
    }

    const updatedProgress: any = {
      ...currentProgress,
      progressPercentage: progressPercentage || currentProgress.progressPercentage,
      completedLessons: updatedCompletedLessons,
      currentLesson: lessonId || currentProgress.currentLesson,
      timeSpent: (currentProgress.timeSpent || 0) + (timeSpent || 0),
      lastAccessedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add quiz scores if provided
    if (quizScores) {
      updatedProgress.quizScores = {
        ...(currentProgress.quizScores || {}),
        [lessonId]: quizScores
      };
    }

    // Add notes if provided
    if (notes) {
      updatedProgress.notes = {
        ...(currentProgress.notes || {}),
        [lessonId]: notes
      };
    }

    const putCommand = new PutCommand({
      TableName: COURSE_PROGRESS_TABLE,
      Item: updatedProgress
    });

    await docClient.send(putCommand);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(updatedProgress)
    };

  } catch (error: any) {
    console.error('Error updating progress:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: error.message || 'Failed to update progress'
      })
    };
  }
};

export const getUserProgressSummary = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;

    if (!userId) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Unauthorized' })
      };
    }

    const queryCommand = new QueryCommand({
      TableName: COURSE_PROGRESS_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    });

    const result = await docClient.send(queryCommand);

    const progressSummary = {
      totalCourses: result.Items?.length || 0,
      totalTimeSpent: result.Items?.reduce((total, item) => total + (item.timeSpent || 0), 0) || 0,
      averageProgress: result.Items?.length 
        ? result.Items.reduce((total, item) => total + (item.progressPercentage || 0), 0) / result.Items.length
        : 0,
      completedCourses: result.Items?.filter(item => (item.progressPercentage || 0) >= 100).length || 0,
      coursesInProgress: result.Items?.filter(item => (item.progressPercentage || 0) > 0 && (item.progressPercentage || 0) < 100).length || 0,
      recentActivity: result.Items?.sort((a, b) => 
        new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
      ).slice(0, 5) || []
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(progressSummary)
    };

  } catch (error: any) {
    console.error('Error getting user progress summary:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: error.message || 'Failed to get progress summary'
      })
    };
  }
};