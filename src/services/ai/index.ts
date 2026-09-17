import { MockAIProvider } from "./mock-provider";
import type { AIMode, AIProvider } from "./types";

/**
 * AI mode is configuration, never hardcoded business logic.
 * `demo` uses local fixtures. `production` will route to real providers
 * through a server-side orchestrator (not implemented in this prototype).
 */
export const AI_MODE: AIMode =
  (import.meta.env.VITE_AI_MODE as AIMode | undefined) ?? "demo";

const mockProvider = new MockAIProvider();

let activeProvider: AIProvider = mockProvider;

export function getAIProvider(): AIProvider {
  return activeProvider;
}

/** Escape hatch for future providers / tests. */
export function setAIProvider(provider: AIProvider): void {
  activeProvider = provider;
}

export const isDemoMode = () => getAIProvider().isDemo;

export type { AIProvider } from "./types";
