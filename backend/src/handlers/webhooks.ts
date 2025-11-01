import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Stripe from 'stripe';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-09-30.clover'
});

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const PAYMENT_TABLE = process.env.PAYMENT_TABLE || '';
const USER_TABLE = process.env.USER_TABLE || '';
const ENROLLMENT_TABLE = process.env.ENROLLMENT_TABLE || '';
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,Stripe-Signature',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

export const handleWebhook = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Stripe webhook received');
    
    const signature = event.headers['Stripe-Signature'] || event.headers['stripe-signature'];
    
    if (!signature) {
      console.error('No Stripe signature found');
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'No signature found' })
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'No event body' })
      };
    }

    let stripeEvent: Stripe.Event;

    try {
      // Verify webhook signature
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        signature,
        WEBHOOK_SECRET
      );
      console.log('Webhook signature verified:', stripeEvent.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Webhook signature verification failed' })
      };
    }

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(stripeEvent.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(stripeEvent.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(stripeEvent.data.object as Stripe.PaymentIntent);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(stripeEvent.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object as Stripe.Subscription);
        break;
      
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('Webhook handler error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Webhook handler failed' })
    };
  }
};

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout session completed:', session.id);

  try {
    const userId = session.metadata?.userId;
    const tier = session.metadata?.tier;
    const priceId = session.metadata?.priceId;

    if (!userId || !tier) {
      console.error('Missing metadata in checkout session:', session.metadata);
      return;
    }

    // Save payment record
    const paymentRecord = {
      paymentId: session.id,
      userId,
      tier,
      priceId,
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      status: 'completed',
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      customerEmail: session.customer_email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: PAYMENT_TABLE,
      Item: paymentRecord
    }));
    console.log('Payment record saved');

    // Update user subscription status
    await docClient.send(new UpdateCommand({
      TableName: USER_TABLE,
      Key: { userId },
      UpdateExpression: 'SET subscriptionTier = :tier, subscriptionStatus = :status, subscriptionStartDate = :startDate, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':tier': tier,
        ':status': 'active',
        ':startDate': new Date().toISOString(),
        ':updatedAt': new Date().toISOString()
      }
    }));
    console.log('User subscription updated');

    // Grant course access based on tier
    await grantCourseAccess(userId, tier);

    // TODO: Send confirmation email
    console.log('Payment processing completed for user:', userId);
  } catch (error) {
    console.error('Error processing checkout session:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);

  try {
    // Update payment status if exists
    await docClient.send(new UpdateCommand({
      TableName: PAYMENT_TABLE,
      Key: { paymentId: paymentIntent.id },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'succeeded',
        ':updatedAt': new Date().toISOString()
      }
    }));
    console.log('Payment status updated to succeeded');
  } catch (error) {
    console.error('Error updating payment intent:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id);

  try {
    await docClient.send(new UpdateCommand({
      TableName: PAYMENT_TABLE,
      Key: { paymentId: paymentIntent.id },
      UpdateExpression: 'SET #status = :status, failureReason = :reason, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'failed',
        ':reason': paymentIntent.last_payment_error?.message || 'Unknown error',
        ':updatedAt': new Date().toISOString()
      }
    }));
    console.log('Payment status updated to failed');
  } catch (error) {
    console.error('Error updating failed payment:', error);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('Subscription changed:', subscription.id);

  try {
    const userId = subscription.metadata?.userId;
    if (!userId) {
      console.error('No userId in subscription metadata');
      return;
    }

    await docClient.send(new UpdateCommand({
      TableName: USER_TABLE,
      Key: { userId },
      UpdateExpression: 'SET subscriptionId = :subId, subscriptionStatus = :status, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':subId': subscription.id,
        ':status': subscription.status,
        ':updatedAt': new Date().toISOString()
      }
    }));
    console.log('User subscription status updated');
  } catch (error) {
    console.error('Error updating subscription:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  try {
    const userId = subscription.metadata?.userId;
    if (!userId) {
      console.error('No userId in subscription metadata');
      return;
    }

    await docClient.send(new UpdateCommand({
      TableName: USER_TABLE,
      Key: { userId },
      UpdateExpression: 'SET subscriptionStatus = :status, subscriptionEndDate = :endDate, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':status': 'cancelled',
        ':endDate': new Date().toISOString(),
        ':updatedAt': new Date().toISOString()
      }
    }));
    console.log('User subscription cancelled');
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

async function grantCourseAccess(userId: string, tier: string) {
  console.log('Granting course access for tier:', tier);

  try {
    // Define course access by tier
    const coursesByTier: Record<string, string[]> = {
      'free': ['aws-fundamentals-intro'],
      'standard': ['aws-fundamentals', 'serverless-architecture', 'cloud-security', 'cloud-engineering-all-levels'],
      'premium': ['aws-fundamentals', 'serverless-architecture', 'cloud-security', 'cloud-architecture', 'advanced-topics']
    };

    const courses = coursesByTier[tier.toLowerCase()] || [];

    // Create enrollment records for each course
    for (const courseId of courses) {
      const enrollmentId = `${userId}-${courseId}`;
      
      await docClient.send(new PutCommand({
        TableName: ENROLLMENT_TABLE,
        Item: {
          enrollmentId,
          userId,
          courseId,
          tier,
          enrolledAt: new Date().toISOString(),
          status: 'active',
          progress: 0
        }
      }));
    }

    console.log(`Granted access to ${courses.length} courses`);
  } catch (error) {
    console.error('Error granting course access:', error);
    throw error;
  }
}
