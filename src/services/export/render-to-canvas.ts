/**
 * Renders a `Design` (structured JSON) onto a real 2D canvas for export.
 * Text is drawn as text, images as images, shapes as shapes — the exported
 * file mirrors exactly what the editor shows.
 */

import type {
  ButtonElement,
  Design,
  DesignElement,
  ImageElement,
  LogoElement,
  ShapeElement,
  TextElement,
} from "@/types/design";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image-load-failed"));
    img.src = src;
  });
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  content: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  for (const paragraph of content.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = words[0]!;
    for (const word of words.slice(1)) {
      const candidate = `${current} ${word}`;
      if (ctx.measureText(candidate).width <= maxWidth) current = candidate;
      else {
        lines.push(current);
        current = word;
      }
    }
    lines.push(current);
  }
  return lines;
}

function drawText(ctx: CanvasRenderingContext2D, el: TextElement) {
  const content = el.textTransform === "uppercase" ? el.content.toUpperCase() : el.content;
  ctx.font = `${el.fontWeight} ${el.fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
  ctx.letterSpacing = `${el.letterSpacing}px`;
  ctx.fillStyle = el.color;
  ctx.textBaseline = "top";
  ctx.textAlign = el.align === "center" ? "center" : el.align === "right" ? "right" : "left";

  const lines = wrapLines(ctx, content, el.width);
  const lineHeight = el.fontSize * el.lineHeight;
  const originX =
    el.align === "center" ? el.x + el.width / 2 : el.align === "right" ? el.x + el.width : el.x;

  lines.forEach((line, i) => {
    ctx.fillText(line, originX, el.y + i * lineHeight + (lineHeight - el.fontSize) / 2);
  });
  ctx.letterSpacing = "0px";
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawShape(ctx: CanvasRenderingContext2D, el: ShapeElement) {
  roundedRect(ctx, el.x, el.y, el.width, el.height, el.borderRadius);
  ctx.fillStyle = el.fill;
  ctx.fill();
  if (el.borderWidth > 0 && el.borderColor !== "transparent") {
    ctx.lineWidth = el.borderWidth;
    ctx.strokeStyle = el.borderColor;
    ctx.stroke();
  }
}

function drawButton(ctx: CanvasRenderingContext2D, el: ButtonElement) {
  roundedRect(ctx, el.x, el.y, el.width, el.height, el.borderRadius);
  ctx.fillStyle = el.background;
  ctx.fill();
  ctx.font = `${el.fontWeight} ${el.fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
  ctx.letterSpacing = `${el.letterSpacing}px`;
  ctx.fillStyle = el.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(el.text, el.x + el.width / 2, el.y + el.height / 2 + 1);
  ctx.letterSpacing = "0px";
}

function drawLogo(ctx: CanvasRenderingContext2D, el: LogoElement) {
  ctx.font = `${el.fontWeight} ${el.fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
  ctx.letterSpacing = `${el.letterSpacing}px`;
  ctx.fillStyle = el.color;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(el.text, el.x, el.y + el.height / 2);
  ctx.letterSpacing = "0px";
}

async function drawImageElement(ctx: CanvasRenderingContext2D, el: ImageElement) {
  const img = await loadImage(el.src);
  const boxRatio = el.width / el.height;
  const imgRatio = img.width / img.height;

  ctx.save();
  roundedRect(ctx, el.x, el.y, el.width, el.height, el.borderRadius);
  ctx.clip();

  if (el.objectFit === "cover") {
    let sw = img.width;
    let sh = img.height;
    if (imgRatio > boxRatio) sw = img.height * boxRatio;
    else sh = img.width / boxRatio;
    ctx.drawImage(
      img,
      (img.width - sw) / 2,
      (img.height - sh) / 2,
      sw,
      sh,
      el.x,
      el.y,
      el.width,
      el.height,
    );
  } else {
    let dw = el.width;
    let dh = el.height;
    if (imgRatio > boxRatio) dh = el.width / imgRatio;
    else dw = el.height * imgRatio;
    ctx.drawImage(
      img,
      el.x + (el.width - dw) / 2,
      el.y + (el.height - dh) / 2,
      dw,
      dh,
    );
  }
  ctx.restore();
}

async function drawElement(ctx: CanvasRenderingContext2D, el: DesignElement) {
  if (!el.visible) return;
  ctx.save();
  ctx.globalAlpha = el.opacity;
  if (el.rotation) {
    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;
    ctx.translate(cx, cy);
    ctx.rotate((el.rotation * Math.PI) / 180);
    ctx.translate(-cx, -cy);
  }

  switch (el.type) {
    case "text":
      drawText(ctx, el);
      break;
    case "shape":
      drawShape(ctx, el);
      break;
    case "button":
      drawButton(ctx, el);
      break;
    case "logo":
      drawLogo(ctx, el);
      break;
    case "image":
      await drawImageElement(ctx, el);
      break;
  }
  ctx.restore();
}

export async function renderDesignToCanvas(design: Design): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = design.width;
  canvas.height = design.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-unavailable");

  ctx.fillStyle = design.background.color;
  ctx.fillRect(0, 0, design.width, design.height);
  if (design.background.type === "image" && design.background.src) {
    await drawImageElement(ctx, {
      id: "bg",
      type: "image",
      name: "Background",
      src: design.background.src,
      x: 0,
      y: 0,
      width: design.width,
      height: design.height,
      rotation: 0,
      zIndex: 0,
      opacity: 1,
      visible: true,
      locked: true,
      objectFit: "cover",
      borderRadius: 0,
      scale: 1,
    });
  }

  const ordered = [...design.elements].sort((a, b) => a.zIndex - b.zIndex);
  for (const el of ordered) {
    await drawElement(ctx, el);
  }
  return canvas;
}

export async function exportDesign(design: Design, format: "png" | "jpg") {
  if (typeof document !== "undefined" && "fonts" in document) {
    try {
      await document.fonts.ready;
    } catch {
      /* fonts API unavailable — fall back to system metrics */
    }
  }
  const canvas = await renderDesignToCanvas(design);
  const mime = format === "png" ? "image/png" : "image/jpeg";
  const dataUrl = canvas.toDataURL(mime, format === "jpg" ? 0.94 : undefined);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${design.name.replace(/[^\w\- ]+/g, "").trim() || "design"}.${format}`;
  link.click();
}
