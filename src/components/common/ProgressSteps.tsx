import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepDef {
  index: number;
  label: string;
}

export function ProgressSteps({
  steps,
  current,
  onStepClick,
}: {
  steps: StepDef[];
  current: number;
  onStepClick?: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {steps.map((step, i) => {
        const done = step.index < current;
        const active = step.index === current;
        return (
          <div key={step.label} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!onStepClick || step.index > current}
              onClick={() => onStepClick?.(step.index)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] transition-colors",
                active && "border-primary bg-primary text-primary-foreground",
                done && "border-border bg-surface text-foreground hover:bg-surface-sunken",
                !active && !done && "border-border bg-transparent text-muted-foreground",
              )}
            >
              <span className="tabular-nums font-semibold">
                {done ? <Check className="size-3" /> : String(step.index).padStart(2, "0")}
              </span>
              <span className="font-medium uppercase tracking-wider">{step.label}</span>
            </button>
            {i < steps.length - 1 ? <span className="h-px w-6 bg-border" /> : null}
          </div>
        );
      })}
    </div>
  );
}
