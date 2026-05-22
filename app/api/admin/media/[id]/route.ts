import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { configureCloudinary } from "@/lib/cloudinary";
import { createNotification } from "@/lib/notifications";
import { MediaAsset } from "@/models/MediaAsset";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const updateSchema = z.object({
  alt: z.string().trim().optional(),
  usedFor: z.string().trim().optional(),
  folder: z.enum(["profile", "projects", "bootcamps", "blog", "gallery", "general"]).optional(),
});

function invalidId() {
  return NextResponse.json({ success: false, error: "Invalid media id." }, { status: 400 });
}

function serialize(asset: any) {
  return {
    ...asset,
    _id: asset._id?.toString(),
    id: asset._id?.toString(),
    createdAt: asset.createdAt?.toISOString?.() || asset.createdAt,
    updatedAt: asset.updatedAt?.toISOString?.() || asset.updatedAt,
  };
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Please check the media details and try again." }, { status: 400 });
    }

    await connectDB();
    const asset = await MediaAsset.findByIdAndUpdate(id, parsed.data, { new: true }).lean();

    if (!asset) {
      return NextResponse.json({ success: false, error: "Media asset not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serialize(asset) });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update media asset." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    await connectDB();
    const asset = await MediaAsset.findById(id);
    if (!asset) {
      return NextResponse.json({ success: false, error: "Media asset not found." }, { status: 404 });
    }

    const cloudinary = configureCloudinary();
    await cloudinary.uploader.destroy(asset.publicId, { resource_type: "image" });
    await asset.deleteOne();

    await createNotification({
      title: "Media deleted",
      message: `Media deleted: ${asset.filename}`,
      type: "media",
      priority: "low",
      link: "/admin/media",
      relatedId: id,
    });

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete media asset." }, { status: 500 });
  }
}
