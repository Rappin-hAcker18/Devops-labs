import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Get all courses
export const getCourses = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const params = {
      TableName: process.env.COURSE_TABLE!,
    };

    const result = await dynamoDb.send(new ScanCommand(params));
    
    // If no courses exist, return sample data
    if (!result.Items || result.Items.length === 0) {
      const sampleCourses = [
        {
          courseId: 'aws-fundamentals',
          title: 'AWS Cloud Fundamentals',
          description: 'Master the basics of AWS cloud computing for urban professionals',
          difficulty: 'Beginner',
          duration: '4 weeks',
          tier: 'free',
          modules: 12,
          createdAt: new Date().toISOString()
        },
        {
          courseId: 'serverless-development',
          title: 'Serverless Development with AWS Lambda',
          description: 'Build scalable applications without managing servers',
          difficulty: 'Intermediate',
          duration: '6 weeks',
          tier: 'standard',
          modules: 18,
          createdAt: new Date().toISOString()
        },
        {
          courseId: 'cloud-architecture',
          title: 'Cloud Architecture & DevOps',
          description: 'Design and deploy enterprise-grade cloud solutions',
          difficulty: 'Advanced',
          duration: '8 weeks',
          tier: 'premium',
          modules: 24,
          createdAt: new Date().toISOString()
        }
      ];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          courses: sampleCourses,
          message: 'Sample courses data - no database entries found'
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ courses: result.Items }),
    };
  } catch (error) {
    console.error('Get courses error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to retrieve courses' }),
    };
  }
};

// Get single course by ID
export const getCourse = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const courseId = event.pathParameters?.courseId;
    
    if (!courseId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Course ID is required' }),
      };
    }

    const params = {
      TableName: process.env.COURSE_TABLE!,
      Key: { courseId },
    };

    const result = await dynamoDb.send(new GetCommand(params));
    
    if (!result.Item) {
      // Return sample course if not found in database
      const sampleCourse = {
        courseId,
        title: `Course ${courseId}`,
        description: `Learn ${courseId} with hands-on projects designed for urban professionals`,
        difficulty: 'Intermediate',
        duration: '6 weeks',
        tier: 'standard',
        modules: 15,
        lessons: [
          { id: 1, title: 'Introduction', duration: '10 mins', type: 'video' },
          { id: 2, title: 'Getting Started', duration: '15 mins', type: 'hands-on' },
          { id: 3, title: 'Core Concepts', duration: '20 mins', type: 'video' }
        ],
        createdAt: new Date().toISOString()
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          course: sampleCourse,
          message: 'Sample course data - no database entry found'
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ course: result.Item }),
    };
  } catch (error) {
    console.error('Get course error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to retrieve course' }),
    };
  }
};

// Course progress tracking
export const getCourseProgress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims.sub;
    const courseId = event.pathParameters?.courseId;
    
    if (!userId || !courseId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing userId or courseId' }),
      };
    }

    const params = {
      TableName: process.env.COURSE_PROGRESS_TABLE!,
      Key: { 
        userId,
        courseId 
      },
    };

    const result = await dynamoDb.send(new GetCommand(params));
    
    if (!result.Item) {
      // Return empty progress if no record exists
      const defaultProgress = {
        courseId,
        userId,
        progress: 0,
        completedLessons: [],
        timeSpent: 0,
        lastAccessed: new Date().toISOString(),
        certificateEarned: false
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(defaultProgress),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error('Error getting course progress:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const updateCourseProgress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims.sub;
    const courseId = event.pathParameters?.courseId;
    const body = JSON.parse(event.body || '{}');
    
    if (!userId || !courseId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing userId or courseId' }),
      };
    }

    const { lessonId, completed, timeSpent = 0 } = body;

    // Get current progress
    const getParams = {
      TableName: process.env.COURSE_PROGRESS_TABLE!,
      Key: { userId, courseId },
    };
    
    const currentProgress = await dynamoDb.send(new GetCommand(getParams));
    const progress = currentProgress.Item || {
      userId,
      courseId,
      progress: 0,
      completedLessons: [],
      timeSpent: 0,
      lastAccessed: new Date().toISOString(),
      certificateEarned: false
    };

    // Update completed lessons
    const completedLessons = progress.completedLessons || [];
    if (completed && !completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    } else if (!completed && completedLessons.includes(lessonId)) {
      const index = completedLessons.indexOf(lessonId);
      completedLessons.splice(index, 1);
    }

    // Calculate progress percentage (assuming we know total lessons per course)
    const totalLessons = getTotalLessonsForCourse(courseId);
    const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100);

    const updatedProgress = {
      ...progress,
      completedLessons,
      progress: progressPercentage,
      timeSpent: (progress.timeSpent || 0) + timeSpent,
      lastAccessed: new Date().toISOString(),
      certificateEarned: progressPercentage === 100,
    };

    const updateParams = {
      TableName: process.env.COURSE_PROGRESS_TABLE!,
      Key: { userId, courseId },
      Item: updatedProgress,
    };

    await dynamoDb.send(new PutCommand(updateParams));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedProgress),
    };
  } catch (error) {
    console.error('Error updating course progress:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const enrollInCourse = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims.sub;
    const body = JSON.parse(event.body || '{}');
    const { courseId, tier } = body;
    
    if (!userId || !courseId || !tier) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Check if user's subscription tier allows this course
    const userProfile = await getUserProfile(userId);
    if (!userProfile || !canAccessCourse(userProfile.subscriptionTier, tier)) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Subscription tier does not allow access to this course' }),
      };
    }

    const enrollment = {
      userId,
      courseId,
      tier,
      enrolledAt: new Date().toISOString(),
      status: 'active',
    };

    const params = {
      TableName: process.env.ENROLLMENT_TABLE!,
      Item: enrollment,
    };

    await dynamoDb.send(new PutCommand(params));

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(enrollment),
    };
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const getUserEnrollments = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims.sub;
    
    if (!userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const params = {
      TableName: process.env.ENROLLMENT_TABLE!,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    const result = await dynamoDb.send(new QueryCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items || []),
    };
  } catch (error) {
    console.error('Error getting user enrollments:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const getUserCourseProgress = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims.sub;
    
    if (!userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const params = {
      TableName: process.env.COURSE_PROGRESS_TABLE!,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    const result = await dynamoDb.send(new QueryCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items || []),
    };
  } catch (error) {
    console.error('Error getting user course progress:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Helper functions
async function getUserProfile(userId: string) {
  try {
    const params = {
      TableName: process.env.USER_TABLE!,
      Key: { userId },
    };
    
    const result = await dynamoDb.send(new GetCommand(params));
    return result.Item;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

function canAccessCourse(userTier: string, requiredTier: string): boolean {
  const tierLevels = {
    'free': 0,
    'standard': 1,
    'premium': 2,
  };
  
  const userLevel = tierLevels[userTier as keyof typeof tierLevels] || 0;
  const requiredLevel = tierLevels[requiredTier as keyof typeof tierLevels] || 0;
  
  return userLevel >= requiredLevel;
}

function getTotalLessonsForCourse(courseId: string): number {
  // This should come from course configuration or database
  const courseLessons = {
    'aws-fundamentals': 16,
    'serverless-architecture': 24,
    'cloud-security': 32,
  };
  
  return courseLessons[courseId as keyof typeof courseLessons] || 16;
}