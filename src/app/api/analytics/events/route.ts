import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check for empty request body
    const text = await request.text();
    if (!text || text.trim() === '') {
      return NextResponse.json({ success: true, message: 'Empty event ignored' });
    }

    const body = JSON.parse(text);
    
    // Skip excessive user_inactive events (only log every 5 minutes instead of 30 seconds)
    if (body.event === 'user_inactive') {
      const lastInactiveTime = (globalThis as any).lastInactiveTime || 0;
      const now = Date.now();
      if (now - lastInactiveTime < 300000) { // 5 minutes
        return NextResponse.json({ success: true, message: 'Inactive event throttled' });
      }
      (globalThis as any).lastInactiveTime = now;
    }
    
    // Log analytics events in development (reduced verbosity)
    if (body.event !== 'user_inactive') {
      console.log('📊 Analytics Event:', {
        event: body.event,
        category: body.category,
        action: body.action,
        label: body.label,
        courseId: body.courseId,
        lessonId: body.lessonId,
        timestamp: new Date().toISOString(),
      });
    }

    // Simulate successful response
    return NextResponse.json({ success: true, message: 'Event tracked successfully' });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track event' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Analytics API endpoint is working',
    endpoints: [
      'POST /api/analytics/events - Track single event',
      'POST /api/analytics/events/batch - Track multiple events',
      'GET /api/analytics/dashboard - Get dashboard data'
    ]
  });
}