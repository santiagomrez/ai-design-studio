import { EDITORIAL_MINIMAL_DNA, BOLD_TYPE_DNA } from "@/data/references";
import { buildDesign, DEMO_HERO_IMAGES } from "@/services/design/layout-engine";
import type { DesignBrief, LayoutDirection, Project, ProjectStatus } from "@/types/design";

interface SeedSpec {
  headline: string;
  subheadline: string;
  cta: string;
  direction: LayoutDirection;
  status: ProjectStatus;
  daysAgo: number;
}

const SEEDS: SeedSpec[] = [
  {
    headline: "5 cosas gratis en línea",
    subheadline: "que vale la pena aprovechar hoy mismo",
    cta: "Desliza",
    direction: "A",
    status: "Approved",
    daysAgo: 1,
  },
  {
    headline: "3 errores de publicidad digital",
    subheadline: "que están quemando tu presupuesto",
    cta: "Ver más",
    direction: "B",
    status: "In Review",
    daysAgo: 2,
  },
  {
    headline: "Cómo crear contenido que convierte",
    subheadline: "Un método simple para equipos pequeños",
    cta: "Desliza",
    direction: "C",
    status: "Draft",
    daysAgo: 4,
  },
  {
    headline: "30X Podcast — Episode 08",
    subheadline: "Marketing sin humo, con datos",
    cta: "Escucha",
    direction: "A",
    status: "Approved",
    daysAgo: 6,
  },
];

/** Demo projects so the dashboard is never empty during a walkthrough. */
export function createSeedProjects(): Project[] {
  return SEEDS.map((seed, i) => {
    const brief: DesignBrief = {
      headline: seed.headline,
      subheadline: seed.subheadline,
      body: "",
      cta: seed.cta,
      tone: "Editorial",
      objective: "Educate",
      format: "ig-portrait",
      brandId: "30x",
      referenceId: i === 1 ? "ref-bold" : "ref-editorial",
    };
    const design = buildDesign(
      brief,
      i === 1 ? BOLD_TYPE_DNA : EDITORIAL_MINIMAL_DNA,
      seed.direction,
      DEMO_HERO_IMAGES[i % DEMO_HERO_IMAGES.length],
    );
    const at = new Date(Date.now() - seed.daysAgo * 86_400_000).toISOString();
    return {
      id: `seed-${i + 1}`,
      name: seed.headline,
      status: seed.status,
      design: { ...design, createdAt: at, updatedAt: at },
      brief,
      createdAt: at,
      updatedAt: at,
    };
  });
}
