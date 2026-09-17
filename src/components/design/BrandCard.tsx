import { cn } from "@/lib/utils";
import type { BrandDNA } from "@/types/design";

export function BrandCard({
  brand,
  selected,
  onSelect,
}: {
  brand: BrandDNA;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "rounded-xl border bg-surface p-5 transition-all",
        onSelect && "cursor-pointer hover:shadow-lift",
        selected ? "border-primary ring-1 ring-primary" : "border-border",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-[13px] font-extrabold tracking-tight text-primary-foreground">
          {brand.logoText}
        </div>
        <div className="flex gap-1">
          {brand.colors.map((c) => (
            <span
              key={c.hex}
              title={`${c.name} ${c.hex}`}
              className="size-5 rounded-full border border-border"
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm font-semibold">{brand.name}</div>
        <div className="mt-1 text-[12px] text-muted-foreground">
          {brand.fonts.map((f) => `${f.family} ${f.weight}`).join(" · ")}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {brand.principles.slice(0, 4).map((p) => (
          <span
            key={p}
            className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
