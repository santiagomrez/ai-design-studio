import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Columns2,
  Download,
  ExternalLink,
  Loader2,
  Minus,
  Plus,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/common/StatusBadge";
import { FieldSelect } from "@/components/common/FieldSelect";
import type { ProjectStatus, SaveStatusLabel } from "./toolbar-types";

export interface CanvasToolbarProps {
  name: string;
  status: ProjectStatus;
  saveStatus: SaveStatusLabel;
  zoom: number;
  exporting: boolean;
  onZoom: (delta: number) => void;
  onZoomFit: () => void;
  onStatusChange: (status: ProjectStatus) => void;
  onCompare: () => void;
  onVariations: () => void;
  onExport: (format: "png" | "jpg") => void;
  onCanva: () => void;
}

export function CanvasToolbar({
  name,
  status,
  saveStatus,
  zoom,
  exporting,
  onZoom,
  onZoomFit,
  onStatusChange,
  onCompare,
  onVariations,
  onExport,
  onCanva,
}: CanvasToolbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      <Button asChild variant="ghost" size="icon" className="size-8">
        <Link to="/projects" aria-label="Back to projects">
          <ArrowLeft className="size-4" />
        </Link>
      </Button>

      <div className="min-w-0">
        <div className="truncate text-[13px] font-medium">{name}</div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {saveStatus === "saving" ? (
            <>
              <Loader2 className="size-3 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Check className="size-3" /> Saved
            </>
          )}
        </div>
      </div>

      <div className="ml-2 w-[132px]">
        <FieldSelect
          value={status}
          onChange={(next) => onStatusChange(next as ProjectStatus)}
          options={["Draft", "In Review", "Approved"]}
        />
      </div>
      <StatusBadge status={status} className="hidden xl:inline-flex" />

      <div className="ml-auto flex items-center gap-1 rounded-md border border-border px-1">
        <Button variant="ghost" size="icon" className="size-7" onClick={() => onZoom(-0.05)}>
          <Minus className="size-3.5" />
        </Button>
        <button
          type="button"
          onClick={onZoomFit}
          className="min-w-11 text-[12px] tabular-nums text-muted-foreground hover:text-foreground"
        >
          {Math.round(zoom * 100)}%
        </button>
        <Button variant="ghost" size="icon" className="size-7" onClick={() => onZoom(0.05)}>
          <Plus className="size-3.5" />
        </Button>
      </div>

      <Button variant="outline" size="sm" className="gap-1.5" onClick={onCompare}>
        <Columns2 className="size-3.5" />
        Compare
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={onVariations}>
        <Shuffle className="size-3.5" />
        Variations
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={onCanva}>
        <ExternalLink className="size-3.5" />
        Open in Canva
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="gap-1.5" disabled={exporting}>
            {exporting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onExport("png")}>Export PNG</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport("jpg")}>Export JPG</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
