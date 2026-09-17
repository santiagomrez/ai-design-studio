import { Link } from "@tanstack/react-router";
import { DesignThumbnail } from "@/components/canvas/DesignRenderer";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getFormat } from "@/data/formats";
import type { Project } from "@/types/design";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function DesignCard({ project }: { project: Project }) {
  const format = getFormat(project.design.format);

  return (
    <Link
      to="/editor/$projectId"
      params={{ projectId: project.id }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-lift"
    >
      <div className="flex h-[248px] items-center justify-center overflow-hidden bg-surface-sunken p-4">
        <div className="overflow-hidden rounded-md shadow-lift">
          <DesignThumbnail design={project.design} boxWidth={180} />
        </div>
      </div>
      <div className="flex items-start justify-between gap-3 border-t border-border p-4">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-medium">{project.name}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {format.label} · {formatDate(project.updatedAt)}
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>
    </Link>
  );
}
