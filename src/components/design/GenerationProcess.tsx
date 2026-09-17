import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STAGES = [
  "Analyzing reference",
  "Extracting visual hierarchy",
  "Understanding typography",
  "Mapping composition",
  "Applying Brand DNA",
  "Generating layouts",
];

/** Honest, restrained progress view over the mock pipeline. */
export function GenerationProcess({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage >= STAGES.length) {
      onDone();
      return;
    }
    const timer = setTimeout(() => setStage((s) => s + 1), stage === 0 ? 500 : 420);
    return () => clearTimeout(timer);
  }, [stage, onDone]);

  return (
    <div className="mx-auto max-w-md space-y-1 py-6">
      {STAGES.map((label, i) => {
        const done = i < stage;
        const active = i === stage;
        return (
          <div
            key={label}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors",
              active && "bg-surface-sunken",
              !done && !active && "opacity-40",
            )}
          >
            <span className="flex size-4 items-center justify-center">
              {done ? (
                <Check className="size-3.5 text-foreground" />
              ) : active ? (
                <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
              ) : (
                <span className="size-1.5 rounded-full bg-border-strong" />
              )}
            </span>
            <span className={cn(done ? "text-foreground" : "text-muted-foreground")}>
              {label}
              {active ? "…" : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
