import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Lock,
  MousePointer,
  Square,
  Type,
  Unlock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Design, DesignElement } from "@/types/design";

const ICONS = {
  text: Type,
  image: ImageIcon,
  shape: Square,
  button: MousePointer,
  logo: Type,
} as const;

export function LayersPanel({
  design,
  selectedId,
  onSelect,
  onUpdate,
  onReorder,
}: {
  design: Design;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, patch: Partial<DesignElement>) => void;
  onReorder: (id: string, direction: -1 | 1) => void;
}) {
  const ordered = [...design.elements].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="space-y-1">
      {ordered.map((element) => {
        const Icon = ICONS[element.type];
        const active = selectedId === element.id;
        return (
          <div
            key={element.id}
            onClick={() => onSelect(element.id)}
            className={cn(
              "group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px]",
              active ? "bg-sidebar-accent font-medium" : "hover:bg-sidebar-accent/60",
              !element.visible && "opacity-50",
            )}
          >
            <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <span className="min-w-0 flex-1 truncate">{element.name}</span>
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                title="Move up"
                className="rounded p-0.5 hover:bg-surface"
                onClick={(e) => {
                  e.stopPropagation();
                  onReorder(element.id, 1);
                }}
              >
                <ChevronUp className="size-3.5 text-muted-foreground" />
              </button>
              <button
                type="button"
                title="Move down"
                className="rounded p-0.5 hover:bg-surface"
                onClick={(e) => {
                  e.stopPropagation();
                  onReorder(element.id, -1);
                }}
              >
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
              <button
                type="button"
                title={element.locked ? "Unlock" : "Lock"}
                className="rounded p-0.5 hover:bg-surface"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(element.id, { locked: !element.locked });
                }}
              >
                {element.locked ? (
                  <Lock className="size-3.5 text-muted-foreground" />
                ) : (
                  <Unlock className="size-3.5 text-muted-foreground" />
                )}
              </button>
            </div>
            <button
              type="button"
              title={element.visible ? "Hide" : "Show"}
              className="rounded p-0.5 hover:bg-surface"
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(element.id, { visible: !element.visible });
              }}
            >
              {element.visible ? (
                <Eye className="size-3.5 text-muted-foreground" />
              ) : (
                <EyeOff className="size-3.5 text-muted-foreground" />
              )}
            </button>
          </div>
        );
      })}
      <div className="px-2 pt-3 text-[11px] leading-relaxed text-muted-foreground">
        Background is defined by the design itself and always sits behind every layer.
      </div>
    </div>
  );
}
