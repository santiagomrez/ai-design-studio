import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, Plus } from "lucide-react";
import { useState } from "react";
import { AppShell, PageBody, PageHeader } from "@/components/layout/AppShell";
import { DesignCard } from "@/components/design/DesignCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/design";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — DESIGN AI" },
      {
        name: "description",
        content: "Every design project in your workspace with its status, format and last update.",
      },
      { property: "og:title", content: "Projects — DESIGN AI" },
      {
        property: "og:description",
        content: "Draft, in review and approved design pieces in one place.",
      },
    ],
  }),
  component: ProjectsPage,
});

const FILTERS: (ProjectStatus | "All")[] = ["All", "Draft", "In Review", "Approved"];

function ProjectsPage() {
  const projects = useProjects();
  const [filter, setFilter] = useState<ProjectStatus | "All">("All");
  const visible = projects.filter((p) => filter === "All" || p.status === filter);

  return (
    <AppShell>
      <PageBody>
        <PageHeader
          title="Projects"
          description="Everything your team has produced with DESIGN AI. Saved locally during the prototype phase."
          actions={
            <Button asChild className="gap-2">
              <Link to="/create">
                <Plus className="size-4" />
                New Design
              </Link>
            </Button>
          }
        />

        <div className="flex flex-wrap gap-2 py-6">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12px] transition-colors",
                filter === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title="Nothing here yet"
            description="Projects you create will show up here with their current review status."
            action={
              <Button asChild>
                <Link to="/create">New Design</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((project) => (
              <DesignCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </PageBody>
    </AppShell>
  );
}
