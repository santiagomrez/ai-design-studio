import { cn } from "@/lib/utils";

export function QualityScore({
  label,
  score,
  className,
}: {
  label: string;
  score: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] text-muted-foreground">{label}</span>
        <span className="text-[13px] font-semibold tabular-nums">{score}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-surface-sunken">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            score >= 92 ? "bg-primary" : score >= 80 ? "bg-signal" : "bg-warning",
          )}
          style={{ width: `${Math.max(4, Math.min(100, score))}%` }}
        />
      </div>
    </div>
  );
}

export function ConfidenceMeter({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-1 w-24 overflow-hidden rounded-full bg-surface-sunken">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
      <span className="text-sm font-semibold tabular-nums">{value}%</span>
    </div>
  );
}
