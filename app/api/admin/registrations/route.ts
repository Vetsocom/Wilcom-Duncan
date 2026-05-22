import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Registration } from "@/models/Registration";

function serialize(registration: any) {
  return {
    ...registration,
    _id: registration._id?.toString(),
    id: registration._id?.toString(),
    createdAt: registration.createdAt?.toISOString?.() || registration.createdAt,
    updatedAt: registration.updatedAt?.toISOString?.() || registration.updatedAt,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const search = searchParams.get("search");
    const bootcampSlug = searchParams.get("bootcampSlug");
    const query: Record<string, any> = {};

    if (status && ["new", "reviewed", "accepted", "rejected", "waitlisted"].includes(status)) {
      query.status = status;
    }

    if (source && ["bootcamp", "calendar", "project-event", "general"].includes(source)) {
      query.source = source;
    }

    if (bootcampSlug) {
      query.bootcampSlug = bootcampSlug;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
        { bootcampTitle: { $regex: search, $options: "i" } },
      ];
    }

    await connectDB();
    const registrations = await Registration.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: registrations.map(serialize) });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch registrations." }, { status: 500 });
  }
}
