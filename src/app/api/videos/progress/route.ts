import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, courseId, currentTime, duration, completed } = body;

    if (!videoId || !courseId) {
      return NextResponse.json(
        { error: 'videoId and courseId are required' },
        { status: 400 }
      );
    }

    // Call backend Lambda function to track video progress
    const response = await fetch(`${API_URL}/videos/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add Authorization header with user token
      },
      body: JSON.stringify({
        videoId,
        courseId,
        currentTime: currentTime || 0,
        duration: duration || 0,
        completed: completed || false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to track video progress' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Progress tracking API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
