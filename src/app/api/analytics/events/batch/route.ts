import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events } = body;

    if (!Array.isArray(events)) {
      return NextResponse.json({ error: 'Invalid events array' }, { status: 400 });
    }

    // Log batch events in development
    console.log('📊 Analytics Batch Events:', events.length, 'events');
    events.forEach((event: any) => {
      console.log('  -', event.event, event.category, event.action);
    });

    return NextResponse.json({ 
      success: true, 
      message: `Batch of ${events.length} events tracked successfully`,
      processed: events.length 
    });
  } catch (error) {
    console.error('Batch analytics error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track batch events' }, { status: 500 });
  }
}