import { AlertTriangle, Info, Loader2, ShieldCheck, Undo2, Wand2 } from "lucide-react";
import { QualityScore } from "@/components/common/QualityScore";
import { DemoTag } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import type { DesignQA } from "@/types/design";

export function QAPanel({
  qa,
  running,
  fixing,
  canUndo,
  onRun,
  onAutoFix,
  onUndo,
}: {
  qa?: DesignQA;
  running: boolean;
  fixing: boolean;
  canUndo: boolean;
  onRun: () => void;
  onAutoFix: () => void;
  onUndo: () => void;
}) {
  return (
    <div className="space-y-5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="label-caps">Design QA</div>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
            Structural review of hierarchy, legibility, spacing and brand fit.
          </p>
        </div>
        {qa?.demo ? <DemoTag /> : null}
      </div>

      <Button className="w-full gap-2" onClick={onRun} disabled={running}>
        {running ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
        {qa ? "Run QA again" : "Run Design QA"}
      </Button>

      {qa ? (
        <>
          <div className="flex items-baseline justify-between rounded-lg bg-surface-sunken px-3 py-2.5">
            <span className="text-[12px] text-muted-foreground">Overall</span>
            <span className="text-lg font-semibold tabular-nums">{qa.overall}</span>
          </div>

          <div className="space-y-3">
            {qa.metrics.map((metric) => (
              <QualityScore key={metric.key} label={metric.label} score={metric.score} />
            ))}
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <div className="label-caps">Warnings</div>
            {qa.warnings.length === 0 ? (
              <p className="text-[12px] text-muted-foreground">
                No structural issues detected.
              </p>
            ) : (
              qa.warnings.map((warning) => (
                <div
                  key={warning.id}
                  className="flex gap-2 rounded-md border border-border bg-surface px-2.5 py-2"
                >
                  {warning.severity === "warning" ? (
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />
                  ) : (
                    <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <span className="text-[12px] leading-relaxed">{warning.message}</span>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={onAutoFix}
              disabled={fixing || qa.warnings.every((w) => !w.fixable)}
            >
              {fixing ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              Fix automatically
            </Button>
            <Button
              variant="ghost"
              className="w-full gap-2 text-muted-foreground"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo2 className="size-4" />
              Undo last change
            </Button>
          </div>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Demo analysis: scores come from local structural heuristics, not a vision model. In
            production this panel is produced by a multimodal review.
          </p>
        </>
      ) : null}
    </div>
  );
}
