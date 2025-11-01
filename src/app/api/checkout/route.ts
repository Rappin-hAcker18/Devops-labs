import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Checkout API called');
    const body = await request.json();
    const { tier, successUrl, cancelUrl } = body;

    console.log('Checkout request body:', { tier, successUrl, cancelUrl });

    if (!tier) {
      return NextResponse.json(
        { error: 'Tier is required' },
        { status: 400 }
      );
    }

    // Forward the request to our backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vhavj29513.execute-api.us-east-1.amazonaws.com/dev';
    const fullUrl = `${backendUrl}/api/payments/checkout`;
    
    console.log('Calling backend URL:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        tier,
        successUrl,
        cancelUrl
      }),
    });

    console.log('Backend response status:', response.status);
    const data = await response.json();
    console.log('Backend response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to create checkout session' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}