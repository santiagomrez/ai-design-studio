import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell, PageBody, PageHeader } from "@/components/layout/AppShell";
import { DemoTag } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { AI_MODE, getAIProvider } from "@/services/ai";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — DESIGN AI" },
      {
        name: "description",
        content:
          "Workspace settings: AI mode, provider routing and the integrations planned for later phases.",
      },
      { property: "og:title", content: "Settings — DESIGN AI" },
      {
        property: "og:description",
        content: "Demo mode runs the full workflow locally, with no paid APIs and no API keys.",
      },
    ],
  }),
  component: SettingsPage,
});

const FUTURE_PROVIDERS = [
  {
    name: "Vision analysis",
    role: "Reference interpretation, composition extraction, style identification",
    status: "Planned",
  },
  {
    name: "Reasoning",
    role: "Art direction, copy structuring, design critique, orchestration",
    status: "Planned",
  },
  {
    name: "Visual generation",
    role: "Hero visuals, product scenes, advanced imagery",
    status: "Planned",
  },
  {
    name: "External editor",
    role: "Hand off the design JSON for continued editing",
    status: "Coming soon",
  },
];

function SettingsPage() {
  const provider = getAIProvider();

  return (
    <AppShell>
      <PageBody className="max-w-[880px]">
        <PageHeader
          title="Settings"
          description="Configuration for this workspace. The prototype runs entirely on local data."
        />

        <section className="mt-8 rounded-xl border border-border bg-surface p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">AI mode</h2>
              <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-muted-foreground">
                {AI_MODE === "demo"
                  ? "Demo mode: reference analysis, layout generation, QA and auto-fix are produced from local fixtures and deterministic rules. No external calls, no API keys, no costs."
                  : "Production mode: requests are routed to configured providers through server-side code."}
              </p>
            </div>
            <DemoTag label={AI_MODE === "demo" ? "Demo mode" : "Production"} />
          </div>
          <div className="mt-5 grid gap-3 border-t border-border pt-5 text-[13px] sm:grid-cols-2">
            <div>
              <div className="label-caps">Active provider</div>
              <div className="mt-1">{provider.label}</div>
            </div>
            <div>
              <div className="label-caps">Switching mode</div>
              <div className="mt-1 text-muted-foreground">
                Set VITE_AI_MODE=production once real providers are wired up.
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold">Provider routing</h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            The orchestrator will route each task to the provider that handles it best. The
            interface stays identical, so the UI never changes when a provider does.
          </p>
          <div className="mt-5 divide-y divide-border">
            {FUTURE_PROVIDERS.map((item) => (
              <div key={item.name} className="flex items-center gap-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium">{item.name}</div>
                  <div className="text-[12px] text-muted-foreground">{item.role}</div>
                </div>
                <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold">Workspace data</h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Projects, assets and references are stored in this browser during the prototype phase.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (typeof window === "undefined") return;
                window.localStorage.removeItem("design-ai:state:v1");
                window.localStorage.removeItem("design-ai:seeded:v1");
                toast.success("Workspace reset. Reloading…");
                setTimeout(() => window.location.assign("/"), 700);
              }}
            >
              Reset workspace data
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => toast("Team management coming soon.")}
            >
              Team &amp; permissions
            </Button>
          </div>
        </section>
      </PageBody>
    </AppShell>
  );
}
