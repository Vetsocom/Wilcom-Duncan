"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle, Copy, Eye, ImageIcon, Loader2, Search, Trash2, Upload, X } from "lucide-react";

type MediaAsset = {
  id: string;
  _id?: string;
  secureUrl: string;
  filename: string;
  originalFilename: string;
  folder: string;
  format: string;
  size: number;
  width: number;
  height: number;
  alt?: string;
  createdAt?: string;
};

const folders = ["profile", "projects", "bootcamps", "blog", "gallery", "general"];
const inputCls =
  "w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors";

function formatSize(size: number) {
  if (!size) return "0 KB";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState("general");
  const [filterFolder, setFilterFolder] = useState("all");
  const [search, setSearch] = useState("");
  const [alt, setAlt] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<MediaAsset | null>(null);
  const [deleting, setDeleting] = useState<MediaAsset | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterFolder !== "all") params.set("folder", filterFolder);
      if (search.trim()) params.set("search", search.trim());
      const response = await fetch(`/api/admin/media?${params.toString()}`);
      const result = await response.json();
      setAssets(result.success ? result.data : []);
    } catch {
      setError("Failed to load the media library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filterFolder]);

  const uploadFile = async (file?: File) => {
    if (!file) return;

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("alt", alt);

      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Please upload a JPG, PNG, or WEBP image under 5MB.");
      }

      setAlt("");
      setMessage("Image uploaded successfully.");
      await load();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setUploading(false);
      setDragging(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setMessage("Image URL copied.");
    setTimeout(() => setMessage(""), 2200);
  };

  const deleteAsset = async () => {
    if (!deleting) return;
    const id = deleting.id || deleting._id;
    setError("");
    try {
      const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete image.");
      }
      setMessage("Image deleted.");
      setDeleting(null);
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete image.");
    }
  };

  const visibleAssets = useMemo(() => assets, [assets]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Media Library</h1>
          <p className="mt-1 text-gray-400">Upload images from your computer and reuse them across the website.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px,1fr]">
        <section className="rounded-3xl border border-white/10 bg-[#111] p-5 shadow-xl shadow-black/20">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10">
              <Upload className="h-5 w-5 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Upload Image</h2>
              <p className="text-sm text-gray-500">JPG, PNG, or WEBP under 5MB.</p>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => uploadFile(event.target.files?.[0])}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              uploadFile(event.dataTransfer.files?.[0]);
            }}
            className={`mb-4 flex h-44 w-full items-center justify-center rounded-3xl border border-dashed text-center transition ${
              dragging ? "border-[#d4af37] bg-[#d4af37]/10" : "border-white/15 bg-white/[0.03] hover:border-[#d4af37]/40"
            }`}
          >
            <div>
              <ImageIcon className="mx-auto mb-3 h-8 w-8 text-[#d4af37]" />
              <p className="font-medium text-white">Drop image here or click to browse</p>
              <p className="mt-1 text-sm text-gray-500">Choose a local image from this device.</p>
            </div>
          </button>

          <div className="space-y-3">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Category / Folder</label>
              <select value={folder} onChange={(event) => setFolder(event.target.value)} className={inputCls}>
                {folders.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-300">Alt text</label>
              <input value={alt} onChange={(event) => setAlt(event.target.value)} className={inputCls} placeholder="Describe the image for accessibility" />
            </div>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#d4af37] px-5 py-3 font-semibold text-black transition hover:bg-[#e5c158] disabled:opacity-60"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>

          {message ? (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              <CheckCircle className="h-4 w-4" />
              {message}
            </div>
          ) : null}
          {error ? <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#111] p-5 shadow-xl shadow-black/20">
          <div className="mb-5 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") load();
                }}
                className={`${inputCls} pl-10`}
                placeholder="Search by filename or alt text"
              />
            </div>
            <select value={filterFolder} onChange={(event) => setFilterFolder(event.target.value)} className={`${inputCls} md:w-52`}>
              <option value="all">All categories</option>
              {folders.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button type="button" onClick={load} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white hover:border-[#d4af37]/40">
              Search
            </button>
          </div>

          {loading ? (
            <div className="flex h-80 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />
            </div>
          ) : visibleAssets.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {visibleAssets.map((asset) => (
                <article key={asset.id || asset._id} className="overflow-hidden rounded-3xl border border-white/10 bg-black/25">
                  <button type="button" onClick={() => setPreview(asset)} className="group relative block w-full">
                    <img src={asset.secureUrl} alt={asset.alt || asset.filename} className="aspect-square w-full object-cover transition group-hover:scale-105" />
                    <span className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur">
                      <Eye className="h-4 w-4" />
                    </span>
                  </button>
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="truncate font-medium text-white">{asset.filename}</p>
                      <p className="text-xs capitalize text-gray-500">
                        {asset.folder} · {asset.format?.toUpperCase()} · {formatSize(asset.size)}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">{asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : ""}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => copyUrl(asset.secureUrl)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white hover:border-[#d4af37]/40">
                        <Copy className="h-4 w-4" />
                        Copy URL
                      </button>
                      <button type="button" onClick={() => setDeleting(asset)} className="rounded-lg border border-red-400/20 px-3 py-2 text-red-300 hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center rounded-3xl border border-dashed border-white/10 text-center">
              <div>
                <ImageIcon className="mx-auto mb-3 h-9 w-9 text-[#d4af37]" />
                <p className="font-medium text-white">No images uploaded yet.</p>
                <p className="mt-1 text-sm text-gray-500">Upload the first website image from the card on the left.</p>
              </div>
            </div>
          )}
        </section>
      </div>

      {preview ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/80" onClick={() => setPreview(null)} aria-label="Close preview" />
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#090909]">
            <button type="button" onClick={() => setPreview(null)} className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white">
              <X className="h-5 w-5" />
            </button>
            <img src={preview.secureUrl} alt={preview.alt || preview.filename} className="max-h-[78vh] w-full object-contain bg-black" />
            <div className="p-4">
              <p className="font-semibold text-white">{preview.filename}</p>
              <p className="break-all text-sm text-gray-500">{preview.secureUrl}</p>
            </div>
          </div>
        </div>
      ) : null}

      {deleting ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/80" onClick={() => setDeleting(null)} aria-label="Cancel delete" />
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-6">
            <h3 className="text-lg font-semibold text-white">Delete this image?</h3>
            <p className="mt-2 text-sm text-gray-400">This removes it from Cloudinary and the media library.</p>
            <p className="mt-4 truncate rounded-xl bg-black/30 px-3 py-2 text-sm text-gray-300">{deleting.filename}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleting(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white">
                Cancel
              </button>
              <button type="button" onClick={deleteAsset} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
