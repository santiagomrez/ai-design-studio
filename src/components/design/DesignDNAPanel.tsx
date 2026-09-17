import { ConfidenceMeter } from "@/components/common/QualityScore";
import { DemoTag } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils";
import type { DesignDNA } from "@/types/design";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[128px_1fr] gap-4 border-b border-border py-3 last:border-b-0">
      <div className="label-caps pt-0.5">{label}</div>
      <div className="text-[13px] leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

export function DesignDNAPanel({
  dna,
  className,
  compact = false,
}: {
  dna: DesignDNA;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="label-caps">Design DNA</div>
          <div className="mt-1 text-lg font-semibold tracking-tight">{dna.style}</div>
        </div>
        <DemoTag label="Reference DNA" />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-surface-sunken px-3 py-2.5">
        <span className="text-[13px] text-muted-foreground">Visual understanding</span>
        <ConfidenceMeter value={dna.confidence} />
      </div>

      <div className="mt-4">
        <Row label="Color palette">
          <div className="flex flex-wrap items-center gap-2">
            {dna.palette.map((color) => (
              <div key={color.hex} className="flex items-center gap-1.5">
                <span
                  className="size-5 rounded-md border border-border"
                  style={{ background: color.hex }}
                />
                <span className="text-[11px] text-muted-foreground">{color.name}</span>
              </div>
            ))}
          </div>
        </Row>
        <Row label="Typography">
          <div>{dna.typography.headline}</div>
          <div className="text-muted-foreground">{dna.typography.secondary}</div>
          {!compact ? (
            <div className="mt-1 text-[12px] text-muted-foreground">
              {dna.typography.contrast}
            </div>
          ) : null}
        </Row>
        <Row label="Composition">{dna.composition}</Row>
        <Row label="Hierarchy">
          <ol className="space-y-0.5">
            {dna.hierarchy.map((item, i) => (
              <li key={item} className="flex gap-2">
                <span className="w-4 tabular-nums text-muted-foreground">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ol>
        </Row>
        <Row label="Visual language">
          <div className="flex flex-wrap gap-1.5">
            {dna.visualLanguage.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </Row>
        {!compact ? (
          <>
            <Row label="Spacing">{dna.spacing}</Row>
            <Row label="Image treatment">{dna.imageTreatment}</Row>
            <Row label="CTA">{dna.ctaStyle}</Row>
            <Row label="Logo">{dna.logoPlacement}</Row>
            <Row label="Notes">
              <span className="text-muted-foreground">{dna.notes}</span>
            </Row>
          </>
        ) : null}
      </div>
    </div>
  );
}
