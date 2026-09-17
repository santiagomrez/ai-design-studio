import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/design";

const STYLES: Record<ProjectStatus, string> = {
  Draft: "border-border text-muted-foreground",
  "In Review": "border-signal/60 bg-signal/15 text-foreground",
  Approved: "border-success/40 bg-success/10 text-foreground",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        STYLES[status],
        className,
      )}
    >
      {status}
    </span>
  );
}

export function DemoTag({ label = "Demo analysis" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface-sunken px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
  );
}
