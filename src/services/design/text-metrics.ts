/**
 * Lightweight text metrics used by the layout engine and the QA pass.
 * These are approximations (no font loading required) which is enough for
 * layout decisions; the canvas renderer measures precisely at paint time.
 */

const AVG_GLYPH_RATIO = 0.54;

export function estimateLineCount(
  text: string,
  boxWidth: number,
  fontSize: number,
  letterSpacing = 0,
): number {
  const glyphWidth = fontSize * AVG_GLYPH_RATIO + letterSpacing;
  const charsPerLine = Math.max(1, Math.floor(boxWidth / glyphWidth));
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 1;

  let lines = 1;
  let current = 0;
  for (const word of words) {
    const next = current === 0 ? word.length : current + 1 + word.length;
    if (next > charsPerLine) {
      lines += 1;
      current = word.length;
    } else {
      current = next;
    }
  }
  return lines;
}

export function estimateTextHeight(
  text: string,
  boxWidth: number,
  fontSize: number,
  lineHeight: number,
  letterSpacing = 0,
): number {
  return (
    estimateLineCount(text, boxWidth, fontSize, letterSpacing) * fontSize * lineHeight
  );
}

/** Largest font size that keeps `text` inside `boxWidth` x `maxHeight`. */
export function fitFontSize(
  text: string,
  boxWidth: number,
  maxHeight: number,
  options: { max: number; min: number; lineHeight: number; letterSpacing?: number },
): number {
  const { max, min, lineHeight, letterSpacing = 0 } = options;
  for (let size = max; size > min; size -= 2) {
    const height = estimateTextHeight(
      text,
      boxWidth,
      size,
      lineHeight,
      letterSpacing * size,
    );
    if (height <= maxHeight) return size;
  }
  return min;
}
