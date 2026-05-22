import { NextResponse } from 'next/server';
import { getCalendarActivities, saveCalendarActivities } from '@/lib/cms';

export async function GET() {
  try {
    const data = await getCalendarActivities();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newActivity = await request.json();
    const activities = await getCalendarActivities();
    newActivity.id = `cal${Date.now()}`;
    activities.push(newActivity);
    await saveCalendarActivities(activities);
    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
