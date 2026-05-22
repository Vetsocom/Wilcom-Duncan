import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactInquiry } from "@/models/ContactInquiry";

export async function GET() {
  try {
    await connectDB();
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: inquiries });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries." },
      { status: 500 }
    );
  }
}
