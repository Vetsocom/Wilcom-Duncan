"use client";

import ImagePicker from "./ImagePicker";
import { ArrowDown, ArrowUp, X } from "lucide-react";

type MultiImagePickerProps = {
  label: string;
  value?: string[];
  onChange: (value: string[]) => void;
  folder?: string;
};

export default function MultiImagePicker({
  label,
  value = [],
  onChange,
  folder = "gallery",
}: MultiImagePickerProps) {
  const addImage = (url: string) => {
    if (!url) return;
    onChange(value.includes(url) ? value : [...value, url]);
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, currentIndex) => currentIndex !== index));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= value.length) return;
    const next = [...value];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <ImagePicker
        label={label}
        folder={folder}
        value=""
        onChange={addImage}
        helperText="Add images from the media library or upload new JPG, PNG, or WEBP images."
      />

      {value.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {value.map((image, index) => (
            <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <img src={image} alt={`${label} ${index + 1}`} className="aspect-square w-full object-cover" />
              <div className="flex items-center justify-between gap-1 p-2">
                <button type="button" onClick={() => moveImage(index, -1)} className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white" aria-label="Move image up">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => moveImage(index, 1)} className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white" aria-label="Move image down">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => removeImage(index)} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10" aria-label="Remove image">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">
          No gallery images selected yet.
        </div>
      )}
    </div>
  );
}
