"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImageIcon, Loader2, Search, Upload, X } from "lucide-react";

type MediaAsset = {
  id: string;
  _id?: string;
  secureUrl: string;
  filename: string;
  originalFilename?: string;
  folder: string;
  alt?: string;
  format?: string;
};

type ImagePickerProps = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  folder?: string;
  helperText?: string;
};

const folders = ["profile", "projects", "bootcamps", "blog", "gallery", "general"];
const inputCls =
  "w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors";

export default function ImagePicker({
  label,
  value = "",
  onChange,
  folder = "general",
  helperText = "Upload a JPG, PNG, or WEBP image. Recommended size: 1600x1000px.",
}: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(folder);
  const [alt, setAlt] = useState("");
  const [error, setError] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const previewSrc = value || "";

  const loadAssets = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (selectedFolder !== "all") params.set("folder", selectedFolder);
      if (search.trim()) params.set("search", search.trim());
      const response = await fetch(`/api/admin/media?${params.toString()}`);
      const result = await response.json();
      setAssets(result.success ? result.data : []);
    } catch {
      setError("Unable to load the media library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadAssets();
    }
  }, [open, selectedFolder]);

  const filteredAssets = useMemo(() => assets, [assets]);

  const uploadFile = async (file?: File) => {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", selectedFolder === "all" ? folder : selectedFolder);
      formData.append("alt", alt);

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Please upload a JPG, PNG, or WEBP image under 5MB.");
      }

      setAlt("");
      onChange(result.data.secureUrl);
      await loadAssets();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm text-gray-300 mb-2">{label}</label>
        <p className="text-xs text-gray-500">{helperText}</p>
      </div>

      {previewSrc ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <img src={previewSrc} alt={label} className="h-48 w-full object-cover" />
          <div className="flex flex-wrap items-center justify-between gap-3 p-3">
            <span className="max-w-full truncate text-xs text-gray-400">{previewSrc}</span>
            <button type="button" onClick={() => onChange("")} className="text-sm text-red-300 hover:text-red-200">
              Remove image
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/3 text-gray-500">
          <div className="text-center">
            <ImageIcon className="mx-auto mb-2 h-7 w-7 text-[#d4af37]" />
            <p className="text-sm">No image selected yet.</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-[#d4af37] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#e5c158]"
        >
          Choose from Media Library
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setTimeout(() => fileRef.current?.click(), 100);
          }}
          className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#d4af37]/40"
        >
          Upload New Image
        </button>
      </div>

      <button type="button" onClick={() => setAdvanced(!advanced)} className="text-xs text-gray-500 hover:text-gray-300">
        Advanced: paste image URL
      </button>
      {advanced && (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputCls}
          placeholder="Optional image URL"
        />
      )}

      {open && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close image picker" />
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-[#d4af37]/20 bg-[#090909] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h3 className="text-lg font-semibold text-white">Choose or upload an image</h3>
                <p className="text-sm text-gray-500">Select visually from the media library.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid max-h-[calc(90vh-88px)] overflow-y-auto lg:grid-cols-[320px,1fr]">
              <div className="space-y-4 border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
                <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <Upload className="h-4 w-4 text-[#d4af37]" />
                    Upload from device
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => uploadFile(event.target.files?.[0])}
                  />
                  <select value={selectedFolder} onChange={(event) => setSelectedFolder(event.target.value)} className={`${inputCls} mb-3`}>
                    {folders.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <input value={alt} onChange={(event) => setAlt(event.target.value)} className={`${inputCls} mb-3`} placeholder="Alt text" />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#d4af37] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading ? "Uploading..." : "Upload Image"}
                  </button>
                  {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") loadAssets();
                      }}
                      className={`${inputCls} pl-10`}
                      placeholder="Search images"
                    />
                  </div>
                  <button type="button" onClick={loadAssets} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white hover:border-[#d4af37]/40">
                    Search
                  </button>
                </div>

                {loading ? (
                  <div className="flex h-56 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />
                  </div>
                ) : filteredAssets.length ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                    {filteredAssets.map((asset) => (
                      <button
                        type="button"
                        key={asset.id || asset._id}
                        onClick={() => {
                          onChange(asset.secureUrl);
                          setOpen(false);
                        }}
                        className="group overflow-hidden rounded-2xl border border-white/10 bg-white/3 text-left transition hover:border-[#d4af37]/50"
                      >
                        <img src={asset.secureUrl} alt={asset.alt || asset.filename} className="aspect-square w-full object-cover" />
                        <div className="p-3">
                          <p className="truncate text-sm font-medium text-white">{asset.filename}</p>
                          <p className="text-xs capitalize text-gray-500">{asset.folder}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 text-center text-gray-500">
                    No images uploaded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
