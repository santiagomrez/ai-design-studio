/**
 * Demo Design QA.
 *
 * Scores are DEMO values derived from simple structural heuristics over the
 * design JSON. They are clearly labelled as "Demo analysis" in the UI and are
 * meant to be replaced by a real multimodal evaluation in production mode.
 */

import type {
  ButtonElement,
  Design,
  DesignQA,
  QAMetric,
  QAWarning,
  TextElement,
} from "@/types/design";
import { estimateLineCount } from "./text-metrics";

function findByName<T extends Design["elements"][number]>(
  design: Design,
  name: string,
): T | undefined {
  return design.elements.find((el) => el.name === name) as T | undefined;
}

function clamp(value: number, min = 40, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function evaluateDesign(design: Design): DesignQA {
  const headline = findByName<TextElement>(design, "Headline");
  const subtitle = findByName<TextElement>(design, "Subtitle");
  const cta = findByName<ButtonElement>(design, "CTA");
  const hero = design.elements.find((el) => el.type === "image");
  const logo = design.elements.find((el) => el.type === "logo");

  const warnings: QAWarning[] = [];

  // Hierarchy: headline should clearly dominate secondary text.
  const ratio =
    headline && subtitle ? headline.fontSize / Math.max(1, subtitle.fontSize) : 2.4;
  const hierarchy = clamp(70 + Math.min(30, (ratio - 1.6) * 22));
  if (ratio < 2) {
    warnings.push({
      id: "hierarchy-contrast",
      message: "Headline is not dominant enough against the secondary text.",
      severity: "warning",
      fixable: true,
    });
  }

  // Legibility: CTA label size relative to canvas.
  const ctaRatio = cta ? cta.fontSize / design.width : 0.027;
  const legibility = clamp(78 + (ctaRatio - 0.02) * 900);
  if (cta && ctaRatio < 0.026) {
    warnings.push({
      id: "cta-small",
      message: "CTA may be too small.",
      severity: "warning",
      fixable: true,
    });
  }

  // Spacing: margins and headline line count.
  const margin = Math.min(
    ...design.elements.filter((el) => el.width < design.width).map((el) => el.x),
  );
  const marginScore = (margin / design.width) * 900;
  const headlineLines = headline
    ? estimateLineCount(headline.content, headline.width, headline.fontSize)
    : 2;
  const spacing = clamp(72 + marginScore - Math.max(0, headlineLines - 3) * 6);
  if (headline && headline.width > design.width * 0.86) {
    warnings.push({
      id: "headline-width",
      message: "Headline is approaching maximum width.",
      severity: "warning",
      fixable: true,
    });
  }

  // Brand consistency: colors used come from the brand palette + pill CTA.
  const brandConsistency = clamp(
    88 + (cta && cta.borderRadius >= 999 ? 8 : 0) + (logo ? 4 : -8),
  );

  // Reference alignment: presence of the reference hierarchy roles.
  const roles = [headline, subtitle, hero, cta, logo].filter(Boolean).length;
  const referenceAlignment = clamp(60 + roles * 7);

  // Content completeness.
  const filled = [
    headline?.content,
    subtitle?.content,
    cta?.text,
  ].filter((v) => (v ?? "").trim().length > 0).length;
  const contentCompleteness = clamp((filled / 3) * 100, 0, 100);
  if (contentCompleteness < 100) {
    warnings.push({
      id: "content-missing",
      message: "Some content slots are still empty.",
      severity: "info",
      fixable: false,
    });
  }

  if (hero && headline && hero.y < headline.y + headline.height) {
    warnings.push({
      id: "hero-overlap",
      message: "Hero image competes slightly with the headline.",
      severity: "warning",
      fixable: true,
    });
  }

  const metrics: QAMetric[] = [
    { key: "hierarchy", label: "Hierarchy", score: hierarchy },
    { key: "legibility", label: "Legibility", score: legibility },
    { key: "spacing", label: "Spacing", score: spacing },
    { key: "brandConsistency", label: "Brand consistency", score: brandConsistency },
    { key: "referenceAlignment", label: "Reference alignment", score: referenceAlignment },
    { key: "contentCompleteness", label: "Content completeness", score: contentCompleteness },
  ];

  return {
    metrics,
    warnings,
    overall: Math.round(
      metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length,
    ),
    demo: true,
    evaluatedAt: new Date().toISOString(),
  };
}

export interface AutoFixResult {
  design: Design;
  fixed: string[];
}

/** Applies small, explainable changes to the design JSON. */
export function autoFixDesign(design: Design, qa: DesignQA): AutoFixResult {
  const fixed: string[] = [];
  const elements = design.elements.map((el) => ({ ...el }));

  const headline = elements.find((el) => el.name === "Headline") as
    | TextElement
    | undefined;
  const subtitle = elements.find((el) => el.name === "Subtitle") as
    | TextElement
    | undefined;
  const cta = elements.find((el) => el.name === "CTA") as ButtonElement | undefined;
  const hero = elements.find((el) => el.type === "image");

  for (const warning of qa.warnings) {
    if (warning.id === "cta-small" && cta) {
      cta.fontSize = Math.round(cta.fontSize * 1.18);
      cta.height = Math.round(cta.height * 1.12);
      fixed.push("CTA size increased");
    }
    if (warning.id === "headline-width" && headline) {
      headline.width = Math.round(headline.width * 0.86);
      fixed.push("Headline width reduced");
    }
    if (warning.id === "hierarchy-contrast" && headline && subtitle) {
      subtitle.fontSize = Math.round(headline.fontSize / 2.6);
      fixed.push("Secondary text rebalanced");
    }
    if (warning.id === "hero-overlap" && hero && headline) {
      hero.y = Math.round(headline.y + headline.height + design.height * 0.04);
      fixed.push("Hero image repositioned");
    }
  }

  if (fixed.length === 0 && cta) {
    cta.fontSize = Math.round(cta.fontSize * 1.08);
    fixed.push("CTA emphasis refined");
  }

  return {
    design: { ...design, elements, updatedAt: new Date().toISOString() },
    fixed,
  };
}
