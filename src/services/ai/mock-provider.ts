import { DEMO_REFERENCES, EDITORIAL_MINIMAL_DNA, getReference } from "@/data/references";
import { buildProposals } from "@/services/design/layout-engine";
import { autoFixDesign, evaluateDesign } from "@/services/design/qa";
import { generateVariations } from "@/services/design/variations";
import type {
  Design,
  DesignBrief,
  DesignDNA,
  DesignQA,
  LayoutProposal,
} from "@/types/design";
import type {
  AIProvider,
  AnalyzeReferenceInput,
  AutoFixOutcome,
  DesignVariation,
} from "./types";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Local, deterministic provider used in Demo Mode.
 * No network calls, no API keys, no paid services.
 */
export class MockAIProvider implements AIProvider {
  readonly id = "mock";
  readonly label = "Demo provider (local fixtures)";
  readonly isDemo = true;

  async analyzeReference(input: AnalyzeReferenceInput): Promise<DesignDNA> {
    await wait(900);
    const known = getReference(input.referenceId);
    if (known?.dna) return known.dna;
    // Uploaded reference: fall back to the editorial fixture with a nudge so
    // the UI can show that this DNA came from an upload.
    return {
      ...EDITORIAL_MINIMAL_DNA,
      confidence: 87,
      notes:
        "Structure inferred from the uploaded reference: single dominant headline, one photographic subject, generous empty space.",
    };
  }

  generateDesignDNA(input: AnalyzeReferenceInput): Promise<DesignDNA> {
    return this.analyzeReference(input);
  }

  async generateLayouts(brief: DesignBrief, dna: DesignDNA): Promise<LayoutProposal[]> {
    await wait(700);
    return buildProposals(brief, dna);
  }

  async evaluateDesign(design: Design): Promise<DesignQA> {
    await wait(650);
    return evaluateDesign(design);
  }

  async generateVariations(design: Design): Promise<DesignVariation[]> {
    await wait(600);
    return generateVariations(design);
  }

  async autoFixDesign(design: Design, qa: DesignQA): Promise<AutoFixOutcome> {
    await wait(400);
    return autoFixDesign(design, qa);
  }
}

export const DEMO_REFERENCE_LIBRARY = DEMO_REFERENCES;
