import { NextResponse } from 'next/server';
import { getBootcamps, saveBootcamps } from '@/lib/cms';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const bootcamps = await getBootcamps();
    const bootcamp = bootcamps.find((b: any) => b.id === id);
    if (!bootcamp) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(bootcamp);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bootcamp' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const bootcamps = await getBootcamps();
    const index = bootcamps.findIndex((b: any) => b.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    bootcamps[index] = { ...bootcamps[index], ...updates };
    await saveBootcamps(bootcamps);
    return NextResponse.json(bootcamps[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update bootcamp' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const bootcamps = await getBootcamps();
    const filtered = bootcamps.filter((b: any) => b.id !== id);
    if (filtered.length === bootcamps.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await saveBootcamps(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete bootcamp' }, { status: 500 });
  }
}
