import type {
  AIProvider,
  AnalyzeReferenceInput,
  AutoFixOutcome,
  DesignVariation,
} from "./types";
import type {
  Design,
  DesignBrief,
  DesignDNA,
  DesignQA,
  LayoutProposal,
} from "@/types/design";

/**
 * Placeholder for the future reasoning provider (art direction, copy,
 * content structuring, QA, orchestration). Not implemented on purpose.
 */
export class OpenAIProvider implements AIProvider {
  readonly id = "openai";
  readonly label = "Reasoning provider (not configured)";
  readonly isDemo = false;

  private notImplemented(method: string): never {
    throw new Error(
      `OpenAIProvider.${method} is not implemented yet. Run in demo mode (VITE_AI_MODE=demo).`,
    );
  }

  analyzeReference(_input: AnalyzeReferenceInput): Promise<DesignDNA> {
    this.notImplemented("analyzeReference");
  }
  generateDesignDNA(_input: AnalyzeReferenceInput): Promise<DesignDNA> {
    this.notImplemented("generateDesignDNA");
  }
  generateLayouts(_brief: DesignBrief, _dna: DesignDNA): Promise<LayoutProposal[]> {
    this.notImplemented("generateLayouts");
  }
  evaluateDesign(_design: Design): Promise<DesignQA> {
    this.notImplemented("evaluateDesign");
  }
  generateVariations(_design: Design): Promise<DesignVariation[]> {
    this.notImplemented("generateVariations");
  }
  autoFixDesign(_design: Design, _qa: DesignQA): Promise<AutoFixOutcome> {
    this.notImplemented("autoFixDesign");
  }
}
