import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

export const getProfile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
      TableName: process.env.USER_TABLE!,
      Key: { userId },
    };

    const result = await dynamoDb.send(new GetCommand(params));
    
    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const updateProfile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims.sub;
    
    if (!userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { name, email, phone, location, goals, experience } = body;

    const params = {
      TableName: process.env.USER_TABLE!,
      Key: { userId },
      UpdateExpression: 'SET #name = :name, email = :email, phone = :phone, #location = :location, goals = :goals, experience = :experience, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#location': 'location',
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':email': email,
        ':phone': phone,
        ':location': location,
        ':goals': goals,
        ':experience': experience,
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW' as const,
    };

    const result = await dynamoDb.send(new UpdateCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};