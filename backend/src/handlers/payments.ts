import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import Stripe from 'stripe';

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const PAYMENT_TABLE = process.env.PAYMENT_TABLE!;
const USER_TABLE = process.env.USER_TABLE!;

// Helper function to create CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// Price mapping for the 3-tier system
const SUBSCRIPTION_PRICES = {
  free: {
    amount: 0,
    currency: 'usd',
    tier: 'free'
  },
  standard: {
    amount: 4900, // $49.00 in cents
    currency: 'usd',
    tier: 'standard'
  },
  premium: {
    amount: 14900, // $149.00 in cents
    currency: 'usd',
    tier: 'premium'
  }
};

export const createPaymentIntent = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;

    if (!userId) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Unauthorized' })
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const { subscriptionTier, billingPeriod } = JSON.parse(event.body);

    if (!subscriptionTier || !SUBSCRIPTION_PRICES[subscriptionTier as keyof typeof SUBSCRIPTION_PRICES]) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Invalid subscription tier' })
      };
    }

    const priceInfo = SUBSCRIPTION_PRICES[subscriptionTier as keyof typeof SUBSCRIPTION_PRICES];

    // For free tier, no payment intent needed
    if (subscriptionTier === 'free') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Free tier selected, no payment required',
          subscriptionTier: 'free'
        })
      };
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceInfo.amount,
      currency: priceInfo.currency,
      metadata: {
        userId,
        subscriptionTier,
        billingPeriod: billingPeriod || 'monthly'
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    // Store payment record in DynamoDB
    const paymentRecord = {
      paymentId: paymentIntent.id,
      userId,
      subscriptionTier,
      amount: priceInfo.amount,
      currency: priceInfo.currency,
      status: 'pending',
      billingPeriod: billingPeriod || 'monthly',
      createdAt: new Date().toISOString(),
      stripePaymentIntentId: paymentIntent.id
    };

    const putCommand = new PutCommand({
      TableName: PAYMENT_TABLE,
      Item: paymentRecord
    });

    await docClient.send(putCommand);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: priceInfo.amount,
        currency: priceInfo.currency
      })
    };

  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: error.message || 'Failed to create payment intent'
      })
    };
  }
};

export const confirmPayment = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const { paymentIntentId } = JSON.parse(event.body);

    if (!paymentIntentId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Payment intent ID is required' })
      };
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Payment not completed' })
      };
    }

    const userId = paymentIntent.metadata.userId;
    const subscriptionTier = paymentIntent.metadata.subscriptionTier;

    // Update payment record in DynamoDB
    const updatePaymentCommand = new UpdateCommand({
      TableName: PAYMENT_TABLE,
      Key: {
        paymentId: paymentIntentId
      },
      UpdateExpression: 'SET #status = :status, confirmedAt = :confirmedAt, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'completed',
        ':confirmedAt': new Date().toISOString(),
        ':updatedAt': new Date().toISOString()
      }
    });

    await docClient.send(updatePaymentCommand);

    // Update user subscription tier
    const updateUserCommand = new UpdateCommand({
      TableName: USER_TABLE,
      Key: {
        userId
      },
      UpdateExpression: 'SET subscriptionTier = :tier, subscriptionUpdatedAt = :updatedAt, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':tier': subscriptionTier,
        ':updatedAt': new Date().toISOString()
      }
    });

    await docClient.send(updateUserCommand);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Payment confirmed successfully',
        subscriptionTier,
        paymentStatus: 'completed'
      })
    };

  } catch (error: any) {
    console.error('Error confirming payment:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: error.message || 'Failed to confirm payment'
      })
    };
  }
};

export const getPaymentHistory = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;

    if (!userId) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Unauthorized' })
      };
    }

    // Query payment history for user
    // Note: This would require a GSI on userId in the payment table
    const queryCommand = new QueryCommand({
      TableName: PAYMENT_TABLE,
      IndexName: 'UserIdIndex', // GSI name
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    });

    const result = await docClient.send(queryCommand);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        payments: result.Items || [],
        total: result.Items?.length || 0
      })
    };

  } catch (error: any) {
    console.error('Error getting payment history:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: error.message || 'Failed to get payment history'
      })
    };
  }
};

export const cancelSubscription = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;

    if (!userId) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Unauthorized' })
      };
    }

    // Update user subscription tier to free
    const updateUserCommand = new UpdateCommand({
      TableName: USER_TABLE,
      Key: {
        userId
      },
      UpdateExpression: 'SET subscriptionTier = :tier, subscriptionCancelledAt = :cancelledAt, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':tier': 'free',
        ':cancelledAt': new Date().toISOString(),
        ':updatedAt': new Date().toISOString()
      }
    });

    await docClient.send(updateUserCommand);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Subscription cancelled successfully',
        subscriptionTier: 'free'
      })
    };

  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: error.message || 'Failed to cancel subscription'
      })
    };
  }
};