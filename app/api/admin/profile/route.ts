import { NextResponse } from 'next/server';
import { getProfile, updateProfile } from '@/lib/cms';

export async function GET() {
  try {
    const data = await getProfile();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const updated = await updateProfile(data);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
