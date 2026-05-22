import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/cms';

export async function GET() {
  try {
    const data = await getSettings();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const updated = await updateSettings(data);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
