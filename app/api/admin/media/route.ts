import { NextResponse } from "next/server";
import type { UploadApiResponse } from "cloudinary";
import { connectDB } from "@/lib/db";
import { configureCloudinary } from "@/lib/cloudinary";
import { createNotification } from "@/lib/notifications";
import { MediaAsset } from "@/models/MediaAsset";

const folders = ["profile", "projects", "bootcamps", "blog", "gallery", "general"] as const;
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 5 * 1024 * 1024;
const uploadError = "Please upload a JPG, PNG, or WEBP image under 5MB.";

function serialize(asset: any) {
  return {
    ...asset,
    _id: asset._id?.toString(),
    id: asset._id?.toString(),
    createdAt: asset.createdAt?.toISOString?.() || asset.createdAt,
    updatedAt: asset.updatedAt?.toISOString?.() || asset.updatedAt,
  };
}

function uploadBuffer(buffer: Buffer, folder: string, filename?: string) {
  const cloudinary = configureCloudinary();

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: `wilcom-duncan/${folder}`,
        quality: "auto",
        fetch_format: "auto",
        use_filename: true,
        unique_filename: true,
        filename_override: filename,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed."));
          return;
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder");
    const search = searchParams.get("search");
    const query: Record<string, any> = {};

    if (folder && folders.includes(folder as (typeof folders)[number])) {
      query.folder = folder;
    }

    if (search) {
      query.$or = [
        { filename: { $regex: search, $options: "i" } },
        { originalFilename: { $regex: search, $options: "i" } },
        { alt: { $regex: search, $options: "i" } },
      ];
    }

    await connectDB();
    const assets = await MediaAsset.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: assets.map(serialize) });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load media library." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "general");
    const alt = String(formData.get("alt") || "");
    const usedFor = String(formData.get("usedFor") || "");

    if (!(file instanceof File) || !folders.includes(folder as (typeof folders)[number])) {
      return NextResponse.json({ success: false, error: uploadError }, { status: 400 });
    }

    if (!allowedTypes.includes(file.type) || file.size > maxSize) {
      return NextResponse.json({ success: false, error: uploadError }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadBuffer(buffer, folder, file.name);

    await connectDB();
    const asset = await MediaAsset.create({
      publicId: result.public_id,
      secureUrl: result.secure_url,
      url: result.url,
      folder,
      filename: result.original_filename || file.name,
      originalFilename: file.name,
      format: result.format,
      resourceType: result.resource_type,
      width: result.width,
      height: result.height,
      size: result.bytes,
      alt,
      usedFor,
    });

    await createNotification({
      title: "Media uploaded",
      message: `${file.name} was added to the ${folder} library.`,
      type: "media",
      priority: "normal",
      link: "/admin/media",
      relatedId: asset._id.toString(),
    });

    return NextResponse.json({ success: true, data: serialize(asset.toObject()) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload image.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
