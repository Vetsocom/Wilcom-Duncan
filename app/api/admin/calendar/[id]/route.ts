import { NextResponse } from 'next/server';
import { getCalendarActivities, saveCalendarActivities } from '@/lib/cms';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const activities = await getCalendarActivities();
    const index = activities.findIndex((a: any) => a.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    activities[index] = { ...activities[index], ...updates };
    await saveCalendarActivities(activities);
    return NextResponse.json(activities[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const activities = await getCalendarActivities();
    const filtered = activities.filter((a: any) => a.id !== id);
    if (filtered.length === activities.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await saveCalendarActivities(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}
