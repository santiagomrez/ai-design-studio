import type { BrandDNA } from "@/types/design";

export const BRANDS: BrandDNA[] = [
  {
    id: "30x",
    name: "30X",
    logoText: "30X",
    colors: [
      { name: "Off-white", hex: "#F5F3EE" },
      { name: "Charcoal", hex: "#242422" },
      { name: "Black", hex: "#0E0E0D" },
      { name: "Yellow accent", hex: "#E8C547" },
    ],
    fonts: [
      { role: "Headline", family: "Inter", weight: 800 },
      { role: "Secondary", family: "Inter", weight: 300 },
      { role: "Label", family: "Inter", weight: 500 },
    ],
    principles: [
      "High negative space",
      "Editorial",
      "Minimal",
      "Strong hierarchy",
      "Modern",
      "Premium",
    ],
    ctaStyle: "Pill CTA, dark fill, light label",
    imageStyle: "High contrast studio imagery, single subject, soft shadow",
    spacingRules: "Generous margins (min 8% of canvas width), one idea per piece",
    forbidden: [
      "Heavy gradients",
      "Saturated color blocking",
      "Drop shadows on text",
      "More than two typefaces",
    ],
  },
  {
    id: "demo",
    name: "Demo Brand",
    logoText: "DEMO",
    colors: [
      { name: "Paper", hex: "#FFFFFF" },
      { name: "Ink", hex: "#111111" },
      { name: "Slate", hex: "#6B7280" },
      { name: "Accent", hex: "#2563EB" },
    ],
    fonts: [
      { role: "Headline", family: "Inter", weight: 700 },
      { role: "Secondary", family: "Inter", weight: 400 },
      { role: "Label", family: "Inter", weight: 500 },
    ],
    principles: ["Neutral", "Functional", "Readable", "Systematic"],
    ctaStyle: "Rounded rectangle, accent fill",
    imageStyle: "Neutral product and lifestyle photography",
    spacingRules: "8pt spacing scale",
    forbidden: ["Decorative typefaces"],
  },
];

export function getBrand(id: string): BrandDNA {
  return BRANDS.find((b) => b.id === id) ?? BRANDS[0]!;
}
