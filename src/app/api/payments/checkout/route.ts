import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Legacy payment API called, redirecting to new checkout API');
    const body = await request.json();
    
    // Forward to the correct checkout API
    const checkoutResponse = await fetch(new URL('/api/checkout', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await checkoutResponse.json();
    return NextResponse.json(data, { status: checkoutResponse.status });
  } catch (error) {
    console.error('Legacy payment API error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment request' },
      { status: 500 }
    );
  }
}