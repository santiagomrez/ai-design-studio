import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CheckCircle2,
  Plus,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useEffect } from "react";
import { AppShell, PageBody } from "@/components/layout/AppShell";
import { DesignCard } from "@/components/design/DesignCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useActivity, useProjects } from "@/hooks/useAppStore";
import { seedDemoDataIfNeeded } from "@/lib/seed-demo";
import type { ActivityKind } from "@/types/design";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — DESIGN AI" },
      {
        name: "description",
        content:
          "Your creative workspace: recent design projects, activity and one click to start a new AI-assisted piece.",
      },
      { property: "og:title", content: "Dashboard — DESIGN AI" },
      {
        property: "og:description",
        content: "Recent design projects, team activity and AI-assisted creation in one place.",
      },
    ],
  }),
  component: Dashboard,
});

const ACTIVITY_ICONS: Record<ActivityKind, typeof Sparkles> = {
  "Design generated": Wand2,
  "Reference analyzed": ScanSearch,
  "Design approved": CheckCircle2,
  "QA completed": ShieldCheck,
  "Design exported": ArrowUpRight,
  "Auto-fix applied": Sparkles,
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 19) return "Good afternoon";
  return "Good evening";
}

function relative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function Dashboard() {
  const projects = useProjects();
  const activity = useActivity();

  useEffect(() => {
    seedDemoDataIfNeeded();
  }, []);

  return (
    <AppShell>
      <PageBody>
        <header className="flex flex-wrap items-end justify-between gap-6 pb-10">
          <div>
            <p className="text-sm text-muted-foreground">{greeting()}, Santiago</p>
            <h1 className="mt-1 text-[34px] font-semibold leading-tight tracking-tight">
              Create something great.
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Reference + content + brand DNA. The AI proposes art direction and structure —
              you stay the designer who decides.
            </p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link to="/create">
              <Plus className="size-4" />
              New Design
            </Link>
          </Button>
        </header>

        <section>
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-sm font-semibold">Recent Projects</h2>
            <Link
              to="/projects"
              className="text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="pt-6">
            {projects.length === 0 ? (
              <EmptyState
                icon={Wand2}
                title="No projects yet"
                description="Start from a visual reference and let the AI propose three art directions."
                action={
                  <Button asChild>
                    <Link to="/create">New Design</Link>
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {projects.slice(0, 8).map((project) => (
                  <DesignCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-sm font-semibold">Design Activity</h2>
            <span className="label-caps">Last 30 events</span>
          </div>
          <div className="divide-y divide-border">
            {activity.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">
                Activity will appear here as your team analyzes references and generates designs.
              </p>
            ) : (
              activity.slice(0, 8).map((entry) => {
                const Icon = ACTIVITY_ICONS[entry.kind] ?? Sparkles;
                return (
                  <div key={entry.id} className="flex items-center gap-3 py-3.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-sunken">
                      <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
                    </span>
                    <span className="text-[13px] font-medium">{entry.kind}</span>
                    <span className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">
                      {entry.target}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      {relative(entry.at)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </PageBody>
    </AppShell>
  );
}
