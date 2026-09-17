const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];
const MAX_EDGE = 1200;

export class UnsupportedImageError extends Error {
  constructor() {
    super("Your image format isn't supported.");
  }
}

/**
 * Reads a user file and returns a downscaled data URL so the prototype can
 * keep everything in localStorage without a backend.
 */
export async function fileToDataUrl(file: File): Promise<string> {
  if (!ACCEPTED.includes(file.type)) throw new UnsupportedImageError();

  const original = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read-failed"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("decode-failed"));
    element.src = original;
  });

  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
  if (scale === 1 && original.length < 900_000) return original;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.86);
}

export const ACCEPTED_IMAGE_TYPES = ACCEPTED;
