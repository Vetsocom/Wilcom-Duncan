import { NextResponse } from 'next/server';
import { getBootcamps, saveBootcamps } from '@/lib/cms';

export async function GET() {
  try {
    const data = await getBootcamps();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bootcamps' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newBootcamp = await request.json();
    const bootcamps = await getBootcamps();
    newBootcamp.id = `b${Date.now()}`;
    bootcamps.push(newBootcamp);
    await saveBootcamps(bootcamps);
    return NextResponse.json(newBootcamp, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create bootcamp' }, { status: 500 });
  }
}
