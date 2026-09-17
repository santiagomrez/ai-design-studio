import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReferenceImage } from "@/types/design";

export function ReferenceCard({
  reference,
  selected,
  onSelect,
  footer,
}: {
  reference: ReferenceImage;
  selected?: boolean;
  onSelect?: () => void;
  footer?: React.ReactNode;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "overflow-hidden rounded-xl border bg-surface transition-all",
        onSelect && "cursor-pointer hover:shadow-lift",
        selected ? "border-primary ring-1 ring-primary" : "border-border",
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-sunken">
        <img
          src={reference.src}
          alt={reference.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {selected ? (
          <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3.5" />
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <div>
          <div className="text-[13px] font-medium">{reference.name}</div>
          <div className="text-[11px] text-muted-foreground">{reference.style}</div>
        </div>
        <div className="flex flex-wrap gap-1">
          {reference.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        {footer}
      </div>
    </div>
  );
}
