import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell, PageBody, PageHeader } from "@/components/layout/AppShell";
import { DesignThumbnail } from "@/components/canvas/DesignRenderer";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/data/templates";
import { EDITORIAL_MINIMAL_DNA } from "@/data/references";
import { logActivity, newId, saveProject } from "@/lib/store";
import { buildDesign } from "@/services/design/layout-engine";
import type { DesignBrief, DesignTemplate } from "@/types/design";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — DESIGN AI" },
      {
        name: "description",
        content:
          "Structured layout templates for hero, educational, quote, list, data and promotional pieces.",
      },
      { property: "og:title", content: "Templates — DESIGN AI" },
      {
        property: "og:description",
        content: "Every template is a JSON structure, not a flat image.",
      },
    ],
  }),
  component: TemplatesPage,
});

const PREVIEW_BRIEF: DesignBrief = {
  headline: "COSAS GRATIS",
  subheadline: "en línea que vale la pena aprovechar",
  body: "",
  cta: "Desliza",
  tone: "Editorial",
  objective: "Educate",
  format: "ig-portrait",
  brandId: "30x",
  referenceId: "ref-editorial",
};

function TemplatesPage() {
  const navigate = useNavigate();

  function useTemplate(template: DesignTemplate) {
    const design = buildDesign(PREVIEW_BRIEF, EDITORIAL_MINIMAL_DNA, template.direction);
    const projectId = newId("proj");
    const now = new Date().toISOString();
    saveProject({
      id: projectId,
      name: `${template.name} — untitled`,
      status: "Draft",
      design: { ...design, name: `${template.name} — untitled` },
      brief: PREVIEW_BRIEF,
      createdAt: now,
      updatedAt: now,
    });
    logActivity("Design generated", template.name);
    toast.success(`Started from ${template.name}`);
    navigate({ to: "/editor/$projectId", params: { projectId } });
  }

  return (
    <AppShell>
      <PageBody>
        <PageHeader
          title="Templates"
          description="Reusable layout structures. Each one is a JSON definition of layers, so the AI and the designer can both work on it."
        />

        <div className="grid gap-5 py-6 sm:grid-cols-2 xl:grid-cols-4">
          {TEMPLATES.map((template) => {
            const design = buildDesign(PREVIEW_BRIEF, EDITORIAL_MINIMAL_DNA, template.direction);
            return (
              <div
                key={template.id}
                className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface"
              >
                <div className="flex h-[220px] items-center justify-center bg-surface-sunken p-4">
                  <div className="overflow-hidden rounded shadow-lift">
                    <DesignThumbnail design={design} boxWidth={150} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 border-t border-border p-4">
                  <div>
                    <div className="label-caps">{template.kind}</div>
                    <div className="mt-1 text-[13px] font-medium">{template.name}</div>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.layers.map((layer) => (
                      <span
                        key={layer}
                        className="rounded-full border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {layer}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto"
                    onClick={() => useTemplate(template)}
                  >
                    Use template
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </PageBody>
    </AppShell>
  );
}
