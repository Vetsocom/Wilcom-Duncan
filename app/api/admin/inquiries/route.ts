import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactInquiry } from "@/models/ContactInquiry";

function serialize(inquiry: any) {
  return {
    ...inquiry,
    _id: inquiry._id?.toString(),
    id: inquiry._id?.toString(),
    createdAt: inquiry.createdAt?.toISOString?.() || inquiry.createdAt,
    updatedAt: inquiry.updatedAt?.toISOString?.() || inquiry.updatedAt,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const query: Record<string, any> = {};

    if (status && ["new", "read", "replied", "archived"].includes(status)) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
        { inquiryType: { $regex: search, $options: "i" } },
      ];
    }

    await connectDB();
    const inquiries = await ContactInquiry.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: inquiries.map(serialize) });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries." },
      { status: 500 }
    );
  }
}
