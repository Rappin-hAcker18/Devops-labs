import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, title, description, courseId, order, duration, thumbnail } = body;

    if (!videoId || !title || !courseId) {
      return NextResponse.json(
        { error: 'Missing required fields: videoId, title, courseId' },
        { status: 400 }
      );
    }

    // Call backend Lambda function to save video metadata
    const response = await fetch(`${API_URL}/videos/metadata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId,
        title,
        description: description || '',
        courseId,
        order: order || 1,
        duration: duration || 0,
        thumbnail: thumbnail || ''
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to save video metadata' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Metadata API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const videoId = searchParams.get('videoId');
    const courseId = searchParams.get('courseId');

    if (!videoId && !courseId) {
      return NextResponse.json(
        { error: 'Either videoId or courseId is required' },
        { status: 400 }
      );
    }

    // Build query params
    const params = new URLSearchParams();
    if (videoId) params.append('videoId', videoId);
    if (courseId) params.append('courseId', courseId);

    const response = await fetch(`${API_URL}/videos/metadata?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to get video metadata' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get metadata API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
