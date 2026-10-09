"use client";

/**
 * Client-side image compression utilities.
 * We downscale large photos and re-encode as JPEG to keep API payloads small.
 */

const MAX_DIMENSION = 1280;       // longest side after resize
const JPEG_QUALITY = 0.82;         // 0..1
const THUMB_DIMENSION = 256;

export interface CompressedImage {
  dataUrl: string;        // full-size compressed data URL
  thumb: string;          // small thumb data URL
  width: number;
  height: number;
  bytes: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Could not load image"));
    img.src = src;
  });
}

function drawToCanvas(img: HTMLImageElement, maxDim: number): { canvas: HTMLCanvasElement; width: number; height: number } {
  let { width, height } = img;
  const ratio = Math.min(1, maxDim / Math.max(width, height));
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0, width, height);
  return { canvas, width, height };
}

export async function compressImage(file: File | Blob | string): Promise<CompressedImage> {
  const src = typeof file === "string" ? file : URL.createObjectURL(file);
  try {
    const img = await loadImage(src);
    const { canvas, width, height } = drawToCanvas(img, MAX_DIMENSION);
    const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

    // Thumbnail
    const { canvas: thumbCanvas } = drawToCanvas(img, THUMB_DIMENSION);
    const thumb = thumbCanvas.toDataURL("image/jpeg", 0.72);

    // Approximate bytes (base64 size minus header, * 3/4)
    const bytes = Math.round((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75);

    return { dataUrl, thumb, width, height, bytes };
  } finally {
    if (typeof file !== "string") URL.revokeObjectURL(src);
  }
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
