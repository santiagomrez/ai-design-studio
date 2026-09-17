/**
 * Layout engine.
 *
 * Turns REFERENCE DNA + BRAND DNA + CONTENT into structured `Design` objects.
 * Purely deterministic: no model call, no generated flat image. Directions are
 * intentionally different but controlled.
 */

import { getFormat } from "@/data/formats";
import { getBrand } from "@/data/brands";
import { EDITORIAL_MINIMAL_DNA } from "@/data/references";
import heroPerson from "@/assets/hero-person.jpg";
import heroDevices from "@/assets/hero-devices.jpg";
import type {
  ButtonElement,
  Design,
  DesignBrief,
  DesignDNA,
  DesignElement,
  ImageElement,
  LayoutDirection,
  LayoutProposal,
  LogoElement,
  ShapeElement,
  TextElement,
} from "@/types/design";
import { estimateTextHeight, fitFontSize } from "./text-metrics";

export const DEMO_HERO_IMAGES = [heroDevices, heroPerson];

export function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function text(partial: Partial<TextElement> & Pick<TextElement, "name" | "content">): TextElement {
  return {
    id: createId("txt"),
    type: "text",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0,
    zIndex: 1,
    opacity: 1,
    visible: true,
    locked: false,
    fontFamily: "Inter",
    fontSize: 48,
    fontWeight: 400,
    lineHeight: 1.1,
    letterSpacing: 0,
    color: "#111111",
    align: "left",
    textTransform: "none",
    ...partial,
  };
}

function image(partial: Partial<ImageElement> & Pick<ImageElement, "name" | "src">): ImageElement {
  return {
    id: createId("img"),
    type: "image",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0,
    zIndex: 1,
    opacity: 1,
    visible: true,
    locked: false,
    objectFit: "contain",
    borderRadius: 0,
    scale: 1,
    ...partial,
  };
}

function button(partial: Partial<ButtonElement> & Pick<ButtonElement, "name" | "text">): ButtonElement {
  return {
    id: createId("btn"),
    type: "button",
    x: 0,
    y: 0,
    width: 300,
    height: 90,
    rotation: 0,
    zIndex: 2,
    opacity: 1,
    visible: true,
    locked: false,
    background: "#141413",
    color: "#F5F3EE",
    borderRadius: 999,
    fontFamily: "Inter",
    fontSize: 30,
    fontWeight: 600,
    letterSpacing: 0.5,
    ...partial,
  };
}

function logo(partial: Partial<LogoElement> & Pick<LogoElement, "name" | "text">): LogoElement {
  return {
    id: createId("logo"),
    type: "logo",
    x: 0,
    y: 0,
    width: 200,
    height: 60,
    rotation: 0,
    zIndex: 3,
    opacity: 1,
    visible: true,
    locked: false,
    color: "#141413",
    fontFamily: "Inter",
    fontSize: 40,
    fontWeight: 800,
    letterSpacing: 1,
    ...partial,
  };
}

function shape(partial: Partial<ShapeElement> & Pick<ShapeElement, "name">): ShapeElement {
  return {
    id: createId("shp"),
    type: "shape",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0,
    zIndex: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: "#E8C547",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
    ...partial,
  };
}

interface BuildContext {
  W: number;
  H: number;
  margin: number;
  ink: string;
  paper: string;
  accent: string;
  muted: string;
  headlineWeight: number;
  hero: string;
  brief: DesignBrief;
}

function buildDirectionA(ctx: BuildContext): DesignElement[] {
  const { W, H, margin, ink, paper, brief, hero } = ctx;
  const boxWidth = W - margin * 2;
  const headlineSize = fitFontSize(brief.headline || "HEADLINE", boxWidth, H * 0.26, {
    max: Math.round(W * 0.17),
    min: Math.round(W * 0.055),
    lineHeight: 1.08,
    letterSpacing: -0.02,
  });
  const headlineHeight = estimateTextHeight(
    brief.headline || "HEADLINE",
    boxWidth,
    headlineSize,
    0.95,
  );
  const subSize = Math.round(W * 0.042);

  return [
    text({
      name: "Headline",
      content: brief.headline,
      x: margin,
      y: H * 0.085,
      width: boxWidth,
      height: headlineHeight,
      fontSize: headlineSize,
      fontWeight: ctx.headlineWeight,
      lineHeight: 1.08,
      letterSpacing: -headlineSize * 0.02,
      color: ink,
      textTransform: "uppercase",
      zIndex: 3,
    }),
    text({
      name: "Subtitle",
      content: brief.subheadline,
      x: margin,
      y: H * 0.085 + headlineHeight + H * 0.022,
      width: boxWidth * 0.82,
      height: estimateTextHeight(brief.subheadline, boxWidth * 0.82, subSize, 1.35),
      fontSize: subSize,
      fontWeight: 300,
      lineHeight: 1.35,
      color: ctx.muted,
      zIndex: 3,
    }),
    image({
      name: "Hero Image",
      src: hero,
      x: W * 0.16,
      y: H * 0.47,
      width: W * 0.68,
      height: H * 0.36,
      objectFit: "contain",
      zIndex: 2,
    }),
    button({
      name: "CTA",
      text: brief.cta,
      x: W - margin - W * 0.3,
      y: H - margin - H * 0.062,
      width: W * 0.3,
      height: H * 0.062,
      fontSize: Math.round(W * 0.028),
      background: ink,
      color: paper,
    }),
    logo({
      name: "Logo",
      text: getBrand(brief.brandId).logoText,
      x: margin,
      y: H - margin - H * 0.045,
      width: W * 0.2,
      height: H * 0.045,
      fontSize: Math.round(W * 0.038),
      color: ink,
    }),
  ];
}

function buildDirectionB(ctx: BuildContext): DesignElement[] {
  const { W, H, margin, ink, paper, brief, hero } = ctx;
  const boxWidth = W - margin * 3;
  const headlineSize = fitFontSize(brief.headline || "HEADLINE", boxWidth, H * 0.3, {
    max: Math.round(W * 0.14),
    min: Math.round(W * 0.05),
    lineHeight: 1.08,
  });
  const headlineHeight = estimateTextHeight(brief.headline, boxWidth, headlineSize, 1.08);
  const eyebrowSize = Math.round(W * 0.024);
  const subSize = Math.round(W * 0.038);
  const subY = H * 0.13 + headlineHeight + H * 0.025;

  return [
    text({
      name: "Eyebrow",
      content: ctx.brief.objective.toUpperCase(),
      x: margin * 1.5,
      y: H * 0.075,
      width: boxWidth,
      height: eyebrowSize * 1.4,
      fontSize: eyebrowSize,
      fontWeight: 600,
      letterSpacing: eyebrowSize * 0.18,
      color: ctx.muted,
      align: "center",
      textTransform: "uppercase",
      zIndex: 3,
    }),
    text({
      name: "Headline",
      content: brief.headline,
      x: margin * 1.5,
      y: H * 0.13,
      width: boxWidth,
      height: headlineHeight,
      fontSize: headlineSize,
      fontWeight: ctx.headlineWeight,
      lineHeight: 1.08,
      letterSpacing: -headlineSize * 0.015,
      color: ink,
      align: "center",
      zIndex: 3,
    }),
    text({
      name: "Subtitle",
      content: brief.subheadline,
      x: margin * 2,
      y: subY,
      width: W - margin * 4,
      height: estimateTextHeight(brief.subheadline, W - margin * 4, subSize, 1.4),
      fontSize: subSize,
      fontWeight: 300,
      lineHeight: 1.4,
      color: ctx.muted,
      align: "center",
      zIndex: 3,
    }),
    shape({
      name: "Divider",
      x: W / 2 - W * 0.05,
      y: subY + H * 0.075,
      width: W * 0.1,
      height: 3,
      fill: ctx.accent,
      zIndex: 2,
    }),
    image({
      name: "Hero Image",
      src: hero,
      x: W * 0.22,
      y: H * 0.55,
      width: W * 0.56,
      height: H * 0.28,
      objectFit: "contain",
      zIndex: 2,
    }),
    button({
      name: "CTA",
      text: brief.cta,
      x: W / 2 - W * 0.16,
      y: H - margin - H * 0.06,
      width: W * 0.32,
      height: H * 0.06,
      fontSize: Math.round(W * 0.027),
      background: ink,
      color: paper,
    }),
    logo({
      name: "Logo",
      text: getBrand(brief.brandId).logoText,
      x: W / 2 - W * 0.1,
      y: margin * 0.35,
      width: W * 0.2,
      height: H * 0.035,
      fontSize: Math.round(W * 0.03),
      color: ink,
    }),
  ];
}

function buildDirectionC(ctx: BuildContext): DesignElement[] {
  const { W, H, margin, ink, paper, brief, hero } = ctx;
  const boxWidth = W * 0.74;
  const headlineSize = fitFontSize(brief.headline || "HEADLINE", boxWidth, H * 0.2, {
    max: Math.round(W * 0.13),
    min: Math.round(W * 0.05),
    lineHeight: 1.08,
  });
  const headlineHeight = estimateTextHeight(brief.headline, boxWidth, headlineSize, 1.08);
  const subSize = Math.round(W * 0.034);
  const headlineY = H * 0.63;

  return [
    image({
      name: "Hero Image",
      src: hero,
      x: 0,
      y: 0,
      width: W,
      height: H * 0.56,
      objectFit: "cover",
      zIndex: 1,
    }),
    shape({
      name: "Accent Block",
      x: W - margin - W * 0.14,
      y: H * 0.5,
      width: W * 0.14,
      height: W * 0.14,
      fill: ctx.accent,
      zIndex: 2,
    }),
    text({
      name: "Headline",
      content: brief.headline,
      x: margin,
      y: headlineY,
      width: boxWidth,
      height: headlineHeight,
      fontSize: headlineSize,
      fontWeight: ctx.headlineWeight,
      lineHeight: 1.08,
      letterSpacing: -headlineSize * 0.015,
      color: ink,
      textTransform: "uppercase",
      zIndex: 3,
    }),
    text({
      name: "Subtitle",
      content: brief.subheadline,
      x: margin,
      y: headlineY + headlineHeight + H * 0.02,
      width: boxWidth * 0.9,
      height: estimateTextHeight(brief.subheadline, boxWidth * 0.9, subSize, 1.4),
      fontSize: subSize,
      fontWeight: 300,
      lineHeight: 1.4,
      color: ctx.muted,
      zIndex: 3,
    }),
    button({
      name: "CTA",
      text: brief.cta,
      x: margin,
      y: H - margin - H * 0.058,
      width: W * 0.27,
      height: H * 0.058,
      fontSize: Math.round(W * 0.026),
      background: ink,
      color: paper,
    }),
    logo({
      name: "Logo",
      text: getBrand(brief.brandId).logoText,
      x: W - margin - W * 0.18,
      y: H - margin - H * 0.042,
      width: W * 0.18,
      height: H * 0.042,
      fontSize: Math.round(W * 0.034),
      color: ink,
    }),
  ];
}

const BUILDERS: Record<LayoutDirection, (ctx: BuildContext) => DesignElement[]> = {
  A: buildDirectionA,
  B: buildDirectionB,
  C: buildDirectionC,
};

const DIRECTION_META: Record<
  LayoutDirection,
  { title: string; description: string }
> = {
  A: {
    title: "Closest to reference",
    description: "Maximum visual fidelity to the reference structure.",
  },
  B: {
    title: "Balanced",
    description: "Reference-inspired with stronger content hierarchy.",
  },
  C: {
    title: "Creative",
    description: "More original interpretation while maintaining brand DNA.",
  },
};

export function buildDesign(
  brief: DesignBrief,
  dna: DesignDNA,
  direction: LayoutDirection,
  heroSrc?: string,
): Design {
  const format = getFormat(brief.format);
  const brand = getBrand(brief.brandId);
  const paper = brand.colors[0]?.hex ?? "#F5F3EE";
  const ink = brand.colors.find((c) => /black|ink/i.test(c.name))?.hex ?? "#111111";
  const accent = brand.colors[brand.colors.length - 1]?.hex ?? "#E8C547";

  const ctx: BuildContext = {
    W: format.width,
    H: format.height,
    margin: Math.round(format.width * 0.083),
    ink,
    paper,
    accent,
    muted: "#6E6B64",
    headlineWeight: brand.fonts[0]?.weight ?? 800,
    hero: heroSrc ?? DEMO_HERO_IMAGES[0]!,
    brief,
  };

  const elements = BUILDERS[direction](ctx).map((el, index) => ({
    ...el,
    zIndex: el.zIndex * 10 + index,
  }));

  const now = new Date().toISOString();
  return {
    id: createId("design"),
    name: brief.headline.slice(0, 40) || "Untitled design",
    format: brief.format,
    width: format.width,
    height: format.height,
    background: { type: "color", color: paper },
    elements,
    referenceId: brief.referenceId,
    brandId: brief.brandId,
    designDNA: dna,
    direction,
    createdAt: now,
    updatedAt: now,
  };
}

export function buildProposals(
  brief: DesignBrief,
  dna: DesignDNA = EDITORIAL_MINIMAL_DNA,
): LayoutProposal[] {
  return (["A", "B", "C"] as LayoutDirection[]).map((direction, i) => ({
    direction,
    ...DIRECTION_META[direction],
    design: buildDesign(brief, dna, direction, DEMO_HERO_IMAGES[i % DEMO_HERO_IMAGES.length]),
  }));
}
