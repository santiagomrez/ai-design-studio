/**
 * Central design type definitions.
 *
 * A finished piece is ALWAYS represented as structured data (`Design`) — never
 * as a flat generated image. This keeps the piece editable, exportable and
 * portable to external editors (e.g. Canva) in future versions.
 */

/* ------------------------------------------------------------------ formats */

export type FormatId =
  | "ig-portrait"
  | "ig-square"
  | "ig-story"
  | "li-portrait"
  | "fb-post";

export interface CanvasFormat {
  id: FormatId;
  label: string;
  platform: string;
  width: number;
  height: number;
  ratioLabel: string;
}

/* ----------------------------------------------------------------- elements */

export type ElementType = "text" | "image" | "shape" | "button" | "logo";

export interface BaseElement {
  id: string;
  type: ElementType;
  /** Human readable name shown in the Layers panel. */
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
}

export type TextAlign = "left" | "center" | "right";

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  color: string;
  align: TextAlign;
  textTransform: "none" | "uppercase";
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  objectFit: "cover" | "contain";
  borderRadius: number;
  scale: number;
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  fill: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
}

export interface ButtonElement extends BaseElement {
  type: "button";
  text: string;
  background: string;
  color: string;
  borderRadius: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
}

export interface LogoElement extends BaseElement {
  type: "logo";
  text: string;
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
}

export type DesignElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | ButtonElement
  | LogoElement;

/* ------------------------------------------------------------------- design */

export interface DesignBackground {
  type: "color" | "image";
  color: string;
  src?: string;
}

export interface Design {
  id: string;
  name: string;
  format: FormatId;
  width: number;
  height: number;
  background: DesignBackground;
  elements: DesignElement[];
  referenceId?: string;
  brandId?: string;
  designDNA?: DesignDNA;
  /** Which generated direction this design came from. */
  direction?: LayoutDirection;
  createdAt: string;
  updatedAt: string;
}

/* ---------------------------------------------------------------- reference */

export interface ReferenceImage {
  id: string;
  name: string;
  src: string;
  style: string;
  tags: string[];
  /** Populated once the reference has been analyzed. */
  dna?: DesignDNA;
}

export interface DesignDNA {
  style: string;
  palette: { name: string; hex: string }[];
  typography: {
    headline: string;
    secondary: string;
    contrast: string;
  };
  composition: string;
  hierarchy: string[];
  visualLanguage: string[];
  spacing: string;
  imageTreatment: string;
  ctaStyle: string;
  logoPlacement: string;
  /** Demo signal only — not a scientific measurement. */
  confidence: number;
  notes: string;
}

/* -------------------------------------------------------------------- brand */

export interface BrandDNA {
  id: string;
  name: string;
  logoText: string;
  colors: { name: string; hex: string }[];
  fonts: { role: string; family: string; weight: number }[];
  principles: string[];
  ctaStyle: string;
  imageStyle: string;
  spacingRules: string;
  forbidden: string[];
}

/* -------------------------------------------------------------------- brief */

export type Tone =
  | "Educational"
  | "Editorial"
  | "Bold"
  | "Professional"
  | "Playful"
  | "Premium"
  | "Inspirational"
  | "Promotional";

export type Objective =
  | "Educate"
  | "Engage"
  | "Convert"
  | "Build Authority"
  | "Announce"
  | "Tell a Story";

export interface DesignBrief {
  headline: string;
  subheadline: string;
  body: string;
  cta: string;
  tone: Tone;
  objective: Objective;
  format: FormatId;
  brandId: string;
  referenceId?: string;
}

/* ----------------------------------------------------------------------- QA */

export type QAMetricKey =
  | "hierarchy"
  | "legibility"
  | "spacing"
  | "brandConsistency"
  | "referenceAlignment"
  | "contentCompleteness";

export interface QAMetric {
  key: QAMetricKey;
  label: string;
  score: number;
}

export interface QAWarning {
  id: string;
  message: string;
  severity: "info" | "warning";
  fixable: boolean;
}

export interface DesignQA {
  metrics: QAMetric[];
  warnings: QAWarning[];
  overall: number;
  /** true when produced by the mock provider (Demo Mode). */
  demo: boolean;
  evaluatedAt: string;
}

/* ------------------------------------------------------------------ layouts */

export type LayoutDirection = "A" | "B" | "C";

export interface LayoutProposal {
  direction: LayoutDirection;
  title: string;
  description: string;
  design: Design;
}

/* ----------------------------------------------------------------- projects */

export type ProjectStatus = "Draft" | "In Review" | "Approved";

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  design: Design;
  brief?: DesignBrief;
  qa?: DesignQA;
  createdAt: string;
  updatedAt: string;
}

export type ActivityKind =
  | "Design generated"
  | "Reference analyzed"
  | "Design approved"
  | "QA completed"
  | "Design exported"
  | "Auto-fix applied";

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  target: string;
  at: string;
}

/* ------------------------------------------------------------------- assets */

export type AssetCategory =
  | "People"
  | "Products"
  | "Backgrounds"
  | "Logos"
  | "Icons"
  | "Other";

export interface AssetItem {
  id: string;
  name: string;
  src: string;
  category: AssetCategory;
  createdAt: string;
}

/* ---------------------------------------------------------------- templates */

export type TemplateKind =
  | "Hero"
  | "Educational"
  | "Quote"
  | "List"
  | "Storytelling"
  | "Data"
  | "Announcement"
  | "Promotional";

export interface DesignTemplate {
  id: string;
  name: string;
  kind: TemplateKind;
  description: string;
  layers: string[];
  direction: LayoutDirection;
}
