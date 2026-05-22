import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Application } from "@/models/Application";

export async function GET() {
  try {
    await connectDB();
    const applications = await Application.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications." },
      { status: 500 }
    );
  }
}
