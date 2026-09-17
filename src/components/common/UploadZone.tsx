import { ImagePlus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { fileToDataUrl, UnsupportedImageError } from "@/lib/image-upload";

export function UploadZone({
  onUploaded,
  onError,
  label = "Drag and drop your reference here",
  hint = "PNG, JPG or WEBP — up to ~8MB",
  className,
}: {
  onUploaded: (dataUrl: string, fileName: string) => void;
  onError?: (message: string) => void;
  label?: string;
  hint?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleFile(file?: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      onUploaded(dataUrl, file.name.replace(/\.[^.]+$/, ""));
    } catch (error) {
      onError?.(
        error instanceof UnsupportedImageError
          ? error.message
          : "Something went wrong while reading that image. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFile(e.dataTransfer.files?.[0]);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-surface px-8 py-16 text-center transition-colors",
        dragging ? "border-primary bg-surface-sunken" : "border-border hover:border-border-strong",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      <div className="flex size-11 items-center justify-center rounded-lg bg-surface-sunken">
        {busy ? (
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        ) : (
          <ImagePlus className="size-5 text-muted-foreground" strokeWidth={1.75} />
        )}
      </div>
      <p className="mt-4 text-sm font-medium">{label}</p>
      <p className="mt-1 text-[13px] text-muted-foreground">{hint}</p>
    </div>
  );
}
