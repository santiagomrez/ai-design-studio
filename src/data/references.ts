import type { DesignDNA, ReferenceImage } from "@/types/design";

import refEditorial from "@/assets/ref-editorial-minimal.jpg";
import refBold from "@/assets/ref-bold-typography.jpg";
import refProduct from "@/assets/ref-premium-product.jpg";

/**
 * Demo DNA sets. In production these are produced by a multimodal model;
 * in Demo Mode they are local, deterministic fixtures.
 */
export const EDITORIAL_MINIMAL_DNA: DesignDNA = {
  style: "Editorial Minimal",
  palette: [
    { name: "Off-white", hex: "#F5F3EE" },
    { name: "Charcoal", hex: "#242422" },
    { name: "Black", hex: "#0E0E0D" },
    { name: "Accent", hex: "#E8C547" },
  ],
  typography: {
    headline: "Bold Sans Serif",
    secondary: "Light Sans Serif",
    contrast: "Extreme weight contrast, tight headline tracking",
  },
  composition: "Centered, hero visual anchored low",
  hierarchy: ["Headline", "Secondary text", "Hero visual", "CTA", "Logo"],
  visualLanguage: ["Premium", "Minimal", "Modern", "Editorial"],
  spacing: "Generous",
  imageTreatment: "High contrast, studio-like",
  ctaStyle: "Rounded pill",
  logoPlacement: "Bottom left",
  confidence: 92,
  notes:
    "Reference relies on a single dominant headline, one photographic subject and large empty areas to create a premium editorial feel.",
};

export const BOLD_TYPE_DNA: DesignDNA = {
  style: "Bold Typography",
  palette: [
    { name: "Ink", hex: "#141413" },
    { name: "Bone", hex: "#EAE7DE" },
    { name: "Yellow", hex: "#F2CB05" },
  ],
  typography: {
    headline: "Heavy Display Sans",
    secondary: "Mono label",
    contrast: "Type as image, near edge-to-edge",
  },
  composition: "Typographic full bleed, off-grid crops",
  hierarchy: ["Headline", "Accent shape", "Secondary text", "Logo"],
  visualLanguage: ["Bold", "Graphic", "Confident"],
  spacing: "Tight",
  imageTreatment: "Minimal / typographic",
  ctaStyle: "Underlined label",
  logoPlacement: "Bottom right",
  confidence: 88,
  notes: "Type carries the composition; imagery is secondary or absent.",
};

export const PREMIUM_PRODUCT_DNA: DesignDNA = {
  style: "Premium Product",
  palette: [
    { name: "Sand", hex: "#EFE7DA" },
    { name: "Warm gray", hex: "#B8AC9C" },
    { name: "Espresso", hex: "#2B211A" },
  ],
  typography: {
    headline: "Refined Sans, wide tracking",
    secondary: "Small caps label",
    contrast: "Subtle, restrained",
  },
  composition: "Single subject, elevated, centered",
  hierarchy: ["Hero visual", "Headline", "Secondary text", "CTA", "Logo"],
  visualLanguage: ["Premium", "Warm", "Quiet"],
  spacing: "Very generous",
  imageTreatment: "Soft directional light, natural shadow",
  ctaStyle: "Text link with rule",
  logoPlacement: "Top center",
  confidence: 90,
  notes: "Product is the hero; typography stays supportive and quiet.",
};

export const DEMO_REFERENCES: ReferenceImage[] = [
  {
    id: "ref-editorial",
    name: "Editorial Minimal",
    src: refEditorial,
    style: "Editorial Minimal",
    tags: ["Off-white", "Negative space", "Pill CTA", "Studio hero"],
    dna: EDITORIAL_MINIMAL_DNA,
  },
  {
    id: "ref-bold",
    name: "Bold Typography",
    src: refBold,
    style: "Bold Typography",
    tags: ["High contrast", "Type as image", "Accent"],
    dna: BOLD_TYPE_DNA,
  },
  {
    id: "ref-product",
    name: "Premium Product",
    src: refProduct,
    style: "Premium Product",
    tags: ["Warm neutrals", "Single subject", "Quiet type"],
    dna: PREMIUM_PRODUCT_DNA,
  },
];

export function getReference(id?: string): ReferenceImage | undefined {
  if (!id) return undefined;
  return DEMO_REFERENCES.find((r) => r.id === id);
}
