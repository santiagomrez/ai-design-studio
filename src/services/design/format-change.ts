import { getFormat } from "@/data/formats";
import type { Design, FormatId, TextElement } from "@/types/design";

/**
 * Re-flows a design into another canvas format by scaling every element
 * proportionally. Structure and hierarchy are preserved.
 */
export function applyFormat(design: Design, formatId: FormatId): Design {
  const format = getFormat(formatId);
  const sx = format.width / design.width;
  const sy = format.height / design.height;
  const typeScale = Math.min(sx, sy);

  return {
    ...design,
    format: formatId,
    width: format.width,
    height: format.height,
    updatedAt: new Date().toISOString(),
    elements: design.elements.map((el) => {
      const next = {
        ...el,
        x: Math.round(el.x * sx),
        y: Math.round(el.y * sy),
        width: Math.round(el.width * sx),
        height: Math.round(el.height * sy),
      };
      if ("fontSize" in next) {
        (next as TextElement).fontSize = Math.round(
          (el as TextElement).fontSize * typeScale,
        );
      }
      return next;
    }),
  };
}
