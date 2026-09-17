/**
 * Generates controlled variations of an existing design.
 * Brand DNA, content and format stay fixed; composition changes.
 */

import type { ButtonElement, Design, ImageElement, TextElement } from "@/types/design";
import { createId } from "./layout-engine";

interface VariationRecipe {
  label: string;
  note: string;
  apply: (design: Design) => Design;
}

function mapElements(
  design: Design,
  fn: (el: Design["elements"][number]) => Design["elements"][number],
): Design {
  return {
    ...design,
    id: createId("design"),
    elements: design.elements.map((el) => fn({ ...el })),
    updatedAt: new Date().toISOString(),
  };
}

export const VARIATION_RECIPES: VariationRecipe[] = [
  {
    label: "Tighter type",
    note: "Smaller hero, larger headline, CTA anchored left.",
    apply: (design) =>
      mapElements(design, (el) => {
        if (el.type === "image") {
          const img = el as ImageElement;
          img.width = Math.round(img.width * 0.82);
          img.height = Math.round(img.height * 0.82);
          img.x = Math.round((design.width - img.width) / 2);
        }
        if (el.name === "Headline") {
          const t = el as TextElement;
          t.fontSize = Math.round(t.fontSize * 1.12);
        }
        if (el.name === "CTA") {
          el.x = Math.round(design.width * 0.083);
        }
        return el;
      }),
  },
  {
    label: "Hero forward",
    note: "Dominant hero visual, compact copy block.",
    apply: (design) =>
      mapElements(design, (el) => {
        if (el.type === "image") {
          const img = el as ImageElement;
          img.width = Math.round(Math.min(design.width, img.width * 1.22));
          img.height = Math.round(img.height * 1.18);
          img.x = Math.round((design.width - img.width) / 2);
        }
        if (el.name === "Headline") {
          const t = el as TextElement;
          t.fontSize = Math.round(t.fontSize * 0.88);
        }
        if (el.name === "Subtitle") {
          const t = el as TextElement;
          t.fontSize = Math.round(t.fontSize * 0.92);
        }
        return el;
      }),
  },
  {
    label: "Centered calm",
    note: "Everything centered with a wider CTA.",
    apply: (design) =>
      mapElements(design, (el) => {
        if (el.type === "text") {
          const t = el as TextElement;
          t.align = "center";
          t.x = Math.round((design.width - t.width) / 2);
        }
        if (el.name === "CTA") {
          const b = el as ButtonElement;
          b.width = Math.round(design.width * 0.4);
          b.x = Math.round((design.width - b.width) / 2);
        }
        return el;
      }),
  },
];

export function generateVariations(design: Design): { label: string; note: string; design: Design }[] {
  return VARIATION_RECIPES.map((recipe) => ({
    label: recipe.label,
    note: recipe.note,
    design: recipe.apply(design),
  }));
}
