import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const USER_POOL_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID!;
const USER_TABLE = process.env.USER_TABLE!;

// Helper function to create CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// Helper function to generate secret hash for Cognito
function generateSecretHash(username: string, clientId: string, clientSecret: string): string {
  return crypto.createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

export const register = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const { email, password, firstName, lastName } = JSON.parse(event.body);

    if (!email || !password || !firstName || !lastName) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Email, password, firstName, and lastName are required' })
      };
    }

    // Register user with Cognito
    const signUpCommand = new SignUpCommand({
      ClientId: USER_POOL_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName }
      ]
    });

    const cognitoResponse = await cognitoClient.send(signUpCommand);

    // Create user profile in DynamoDB
    const userId = cognitoResponse.UserSub!;
    const userProfile = {
      userId,
      email,
      firstName,
      lastName,
      subscriptionTier: 'free',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEmailVerified: false
    };

    const putCommand = new PutCommand({
      TableName: USER_TABLE,
      Item: userProfile
    });

    await docClient.send(putCommand);

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'User registered successfully',
        userId,
        confirmationRequired: !cognitoResponse.UserConfirmed
      })
    };

  } catch (error: any) {
    console.error('Registration error:', error);
    
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        message: error.message || 'Registration failed'
      })
    };
  }
};

export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Email and password are required' })
      };
    }

    // Authenticate with Cognito
    const authCommand = new InitiateAuthCommand({
      ClientId: USER_POOL_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    });

    const authResponse = await cognitoClient.send(authCommand);

    if (!authResponse.AuthenticationResult) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Authentication failed' })
      };
    }

    const { AccessToken, RefreshToken, IdToken } = authResponse.AuthenticationResult;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Login successful',
        tokens: {
          accessToken: AccessToken,
          refreshToken: RefreshToken,
          idToken: IdToken
        }
      })
    };

  } catch (error: any) {
    console.error('Login error:', error);
    
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        message: error.message || 'Login failed'
      })
    };
  }
};

export const confirmSignUp = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const { email, confirmationCode } = JSON.parse(event.body);

    if (!email || !confirmationCode) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Email and confirmation code are required' })
      };
    }

    const confirmCommand = new ConfirmSignUpCommand({
      ClientId: USER_POOL_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode
    });

    await cognitoClient.send(confirmCommand);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Email confirmed successfully'
      })
    };

  } catch (error: any) {
    console.error('Confirmation error:', error);
    
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        message: error.message || 'Email confirmation failed'
      })
    };
  }
};