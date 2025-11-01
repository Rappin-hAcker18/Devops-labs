import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    console.log('Upload URL API called');
    console.log('API_URL:', API_URL);
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { fileName, fileType, courseId } = body;

    if (!fileName || !fileType || !courseId) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: fileName, fileType, courseId' },
        { status: 400 }
      );
    }

    const backendUrl = `${API_URL}/videos/upload-url`;
    console.log('Calling backend:', backendUrl);
    
    // Call backend Lambda function to get presigned upload URL
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileType,
        courseId
      })
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error text:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      console.error('Backend error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to get upload URL' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload URL API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
