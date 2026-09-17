import type {
  Design,
  DesignBrief,
  DesignDNA,
  DesignQA,
  LayoutProposal,
} from "@/types/design";

export interface AutoFixOutcome {
  design: Design;
  fixed: string[];
}

export interface DesignVariation {
  label: string;
  note: string;
  design: Design;
}

export interface AnalyzeReferenceInput {
  referenceId?: string;
  /** Data URL or asset URL of an uploaded reference. */
  src: string;
}

/**
 * Provider-agnostic contract for every AI capability in the product.
 * Swap the implementation (mock / Gemini / OpenAI / orchestrator) without
 * touching a single UI component.
 */
export interface AIProvider {
  readonly id: string;
  readonly label: string;
  /** true when responses are local fixtures rather than model output. */
  readonly isDemo: boolean;

  analyzeReference(input: AnalyzeReferenceInput): Promise<DesignDNA>;
  generateDesignDNA(input: AnalyzeReferenceInput): Promise<DesignDNA>;
  generateLayouts(brief: DesignBrief, dna: DesignDNA): Promise<LayoutProposal[]>;
  evaluateDesign(design: Design): Promise<DesignQA>;
  generateVariations(design: Design): Promise<DesignVariation[]>;
  autoFixDesign(design: Design, qa: DesignQA): Promise<AutoFixOutcome>;
}

export type AIMode = "demo" | "production";
