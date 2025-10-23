import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { CloudWatchClient, PutMetricDataCommand, StandardUnit } from '@aws-sdk/client-cloudwatch';

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const cloudwatchClient = new CloudWatchClient({ region: process.env.AWS_REGION });

const ANALYTICS_TABLE = `${process.env.DYNAMODB_TABLE_PREFIX}-analytics`;
const USER_TABLE = `${process.env.DYNAMODB_TABLE_PREFIX}-users`;
const COURSE_TABLE = `${process.env.DYNAMODB_TABLE_PREFIX}-courses`;
const PROGRESS_TABLE = `${process.env.DYNAMODB_TABLE_PREFIX}-progress`;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
};

// Track analytics events
export const trackEvent = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { 
      event: eventName, 
      category, 
      action, 
      label, 
      value, 
      userId, 
      courseId, 
      lessonId, 
      sessionId,
      metadata 
    } = body;

    if (!eventName || !category || !action) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    const timestamp = new Date().toISOString();
    const analyticsEvent = {
      id: `${sessionId}_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
      event: eventName,
      category,
      action,
      label,
      value: value || 0,
      userId,
      courseId,
      lessonId,
      sessionId,
      timestamp,
      metadata: metadata || {},
      ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year retention
    };

    // Store in DynamoDB
    await docClient.send(new PutCommand({
      TableName: ANALYTICS_TABLE,
      Item: analyticsEvent,
    }));

    // Send metrics to CloudWatch for real-time monitoring
    await sendCloudWatchMetrics(analyticsEvent);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true }),
    };
  } catch (error: any) {
    console.error('Error tracking event:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

// Track batch events (for offline sync)
export const trackBatchEvents = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { events } = body;

    if (!Array.isArray(events) || events.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Invalid events array' }),
      };
    }

    // Process events in batches of 25 (DynamoDB limit)
    const batchSize = 25;
    const results = [];

    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      
      const putRequests = batch.map((analyticsEvent: any) => ({
        PutRequest: {
          Item: {
            ...analyticsEvent,
            id: analyticsEvent.id || `${analyticsEvent.sessionId}_${analyticsEvent.timestamp}_${Math.random().toString(36).substr(2, 9)}`,
            ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60),
          },
        },
      }));

      // Use batch write for better performance
      const batchWriteCommand = {
        RequestItems: {
          [ANALYTICS_TABLE]: putRequests,
        },
      };

      try {
        await docClient.send(new (require('@aws-sdk/lib-dynamodb').BatchWriteCommand)(batchWriteCommand));
        results.push({ success: true, processed: batch.length });
      } catch (batchError: any) {
        console.error('Batch write error:', batchError);
        results.push({ success: false, processed: 0, error: batchError.message });
      }
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ results, totalEvents: events.length }),
    };
  } catch (error: any) {
    console.error('Error tracking batch events:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

// Get analytics dashboard data
export const getDashboard = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    // Extract time range from query parameters
    const timeRange = event.queryStringParameters?.timeRange || '30d';
    const startDate = getStartDate(timeRange);
    
    // Get dashboard metrics
    const [
      totalUsers,
      activeUsers,
      courseCompletions,
      userGrowth,
      courseProgress,
      userEngagement,
      revenue
    ] = await Promise.all([
      getTotalUsers(),
      getActiveUsers(startDate),
      getCourseCompletions(startDate),
      getUserGrowth(startDate),
      getCourseProgress(),
      getUserEngagement(startDate),
      getRevenue(startDate),
    ]);

    const dashboardData = {
      totalUsers,
      activeUsers,
      courseCompletions,
      totalRevenue: revenue.total,
      userGrowth,
      courseProgress,
      userEngagement,
      revenueByTier: revenue.byTier,
      topCourses: await getTopCourses(),
      userRetention: await getUserRetention(),
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(dashboardData),
    };
  } catch (error: any) {
    console.error('Error getting dashboard data:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

// Helper functions
async function sendCloudWatchMetrics(analyticsEvent: any) {
  const metricData = [
    {
      MetricName: 'UserEvents',
      Dimensions: [
        { Name: 'Category', Value: analyticsEvent.category },
        { Name: 'Action', Value: analyticsEvent.action },
      ],
      Value: 1,
      Unit: StandardUnit.Count,
      Timestamp: new Date(analyticsEvent.timestamp),
    },
  ];

  // Add course-specific metrics
  if (analyticsEvent.courseId) {
    metricData.push({
      MetricName: 'CourseEvents',
      Dimensions: [
        { Name: 'CourseId', Value: analyticsEvent.courseId },
        { Name: 'Action', Value: analyticsEvent.action },
      ],
      Value: 1,
      Unit: StandardUnit.Count,
      Timestamp: new Date(analyticsEvent.timestamp),
    });
  }

  // Add user engagement metrics
  if (analyticsEvent.value && analyticsEvent.action === 'lesson_complete') {
    metricData.push({
      MetricName: 'LessonDuration',
      Dimensions: [
        { Name: 'CourseId', Value: analyticsEvent.courseId || 'unknown' },
      ],
      Value: analyticsEvent.value,
      Unit: 'Seconds' as any,
      Timestamp: new Date(analyticsEvent.timestamp),
    });
  }

  try {
    await cloudwatchClient.send(new PutMetricDataCommand({
      Namespace: 'CloudCrewAcademy',
      MetricData: metricData,
    }));
  } catch (error) {
    console.error('Failed to send CloudWatch metrics:', error);
  }
}

function getStartDate(timeRange: string): string {
  const now = new Date();
  switch (timeRange) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
}

async function getTotalUsers(): Promise<number> {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: USER_TABLE,
      Select: 'COUNT',
    }));
    return result.Count || 0;
  } catch (error) {
    console.error('Error getting total users:', error);
    return 0;
  }
}

async function getActiveUsers(startDate: string): Promise<number> {
  try {
    const result = await docClient.send(new QueryCommand({
      TableName: ANALYTICS_TABLE,
      IndexName: 'TimestampIndex',
      KeyConditionExpression: '#timestamp > :startDate',
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp',
      },
      ExpressionAttributeValues: {
        ':startDate': startDate,
      },
      ProjectionExpression: 'userId',
    }));

    // Get unique user IDs
    const uniqueUsers = new Set();
    result.Items?.forEach(item => {
      if (item.userId) {
        uniqueUsers.add(item.userId);
      }
    });

    return uniqueUsers.size;
  } catch (error) {
    console.error('Error getting active users:', error);
    return 0;
  }
}

async function getCourseCompletions(startDate: string): Promise<number> {
  try {
    const result = await docClient.send(new QueryCommand({
      TableName: ANALYTICS_TABLE,
      IndexName: 'TimestampIndex',
      KeyConditionExpression: '#timestamp > :startDate',
      FilterExpression: '#event = :event',
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp',
        '#event': 'event',
      },
      ExpressionAttributeValues: {
        ':startDate': startDate,
        ':event': 'course_complete',
      },
      Select: 'COUNT',
    }));

    return result.Count || 0;
  } catch (error) {
    console.error('Error getting course completions:', error);
    return 0;
  }
}

async function getUserGrowth(startDate: string): Promise<{ date: string; users: number }[]> {
  try {
    // This would need a more sophisticated implementation with time-series data
    // For now, return mock data structure
    const days = [];
    const start = new Date(startDate);
    const end = new Date();
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        date: d.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 100) + 50, // Mock data
      });
    }
    
    return days;
  } catch (error) {
    console.error('Error getting user growth:', error);
    return [];
  }
}

async function getCourseProgress(): Promise<{ courseId: string; courseName: string; enrollments: number; completions: number }[]> {
  try {
    // This would aggregate data from enrollments and completions
    // For now, return structure for integration
    return [
      { courseId: 'aws-fundamentals', courseName: 'AWS Fundamentals', enrollments: 0, completions: 0 },
    ];
  } catch (error) {
    console.error('Error getting course progress:', error);
    return [];
  }
}

async function getUserEngagement(startDate: string): Promise<{ date: string; sessions: number; duration: number }[]> {
  try {
    // This would aggregate session data
    return [];
  } catch (error) {
    console.error('Error getting user engagement:', error);
    return [];
  }
}

async function getRevenue(startDate: string): Promise<{ total: number; byTier: { tier: string; revenue: number; users: number }[] }> {
  try {
    // This would aggregate payment data
    return {
      total: 0,
      byTier: [
        { tier: 'Free', revenue: 0, users: 0 },
        { tier: 'Standard', revenue: 0, users: 0 },
        { tier: 'Premium', revenue: 0, users: 0 },
      ],
    };
  } catch (error) {
    console.error('Error getting revenue:', error);
    return { total: 0, byTier: [] };
  }
}

async function getTopCourses(): Promise<{ courseId: string; courseName: string; enrollments: number; rating: number }[]> {
  try {
    // This would aggregate course enrollment and rating data
    return [];
  } catch (error) {
    console.error('Error getting top courses:', error);
    return [];
  }
}

async function getUserRetention(): Promise<{ week: number; retention: number }[]> {
  try {
    // This would calculate user retention cohorts
    return [
      { week: 1, retention: 100 },
      { week: 2, retention: 75 },
      { week: 4, retention: 50 },
      { week: 8, retention: 35 },
      { week: 12, retention: 25 },
    ];
  } catch (error) {
    console.error('Error getting user retention:', error);
    return [];
  }
}