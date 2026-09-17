import { createSeedProjects } from "@/data/seed";
import { addAsset, hydrateStore, logActivity, newId, saveProject } from "@/lib/store";
import type { AssetItem } from "@/types/design";
import heroPerson from "@/assets/hero-person.jpg";
import heroDevices from "@/assets/hero-devices.jpg";
import bgNeutral from "@/assets/bg-neutral.jpg";

function demoAssets(): AssetItem[] {
  const now = new Date().toISOString();
  return [
    { id: newId("asset"), name: "Presenter portrait", src: heroPerson, category: "People", createdAt: now },
    { id: newId("asset"), name: "Product devices", src: heroDevices, category: "Products", createdAt: now },
    { id: newId("asset"), name: "Neutral backdrop", src: bgNeutral, category: "Backgrounds", createdAt: now },
  ];
}

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

  demoAssets().forEach(addAsset);

  logActivity("QA completed", "30X Podcast — Episode 08");
  logActivity("Design approved", "5 cosas gratis en línea");
  logActivity("Reference analyzed", "Editorial Minimal");
  logActivity("Design generated", "3 errores de publicidad digital");
}
