import { createSeedProjects } from "@/data/seed";
import { hydrateStore, logActivity, saveProject } from "@/lib/store";

const FLAG = "design-ai:seeded:v1";

/** Populates the workspace with demo content the first time it is opened. */
export function seedDemoDataIfNeeded() {
  if (typeof window === "undefined") return;
  hydrateStore();
  if (window.localStorage.getItem(FLAG)) return;
  window.localStorage.setItem(FLAG, "1");

  createSeedProjects()
    .slice()
    .reverse()
    .forEach(saveProject);

  logActivity("QA completed", "30X Podcast — Episode 08");
  logActivity("Design approved", "5 cosas gratis en línea");
  logActivity("Reference analyzed", "Editorial Minimal");
  logActivity("Design generated", "3 errores de publicidad digital");
}
