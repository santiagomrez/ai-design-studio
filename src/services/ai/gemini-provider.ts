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
 * Placeholder for the future vision provider (reference analysis, composition
 * extraction, style identification, visual asset generation).
 *
 * Intentionally NOT implemented: the prototype must run without paid APIs and
 * without secrets in the client. Real calls must be made from server code
 * reading credentials from environment variables.
 */
export class GeminiProvider implements AIProvider {
  readonly id = "gemini";
  readonly label = "Vision provider (not configured)";
  readonly isDemo = false;

  private notImplemented(method: string): never {
    throw new Error(
      `GeminiProvider.${method} is not implemented yet. Run in demo mode (VITE_AI_MODE=demo).`,
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
