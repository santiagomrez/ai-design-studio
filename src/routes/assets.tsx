import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageBody, PageHeader } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/common/EmptyState";
import { UploadZone } from "@/components/common/UploadZone";
import { FieldSelect } from "@/components/common/FieldSelect";
import { Button } from "@/components/ui/button";
import { useAssets } from "@/hooks/useAppStore";
import { addAsset, newId, removeAsset } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { AssetCategory } from "@/types/design";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Assets — DESIGN AI" },
      {
        name: "description",
        content: "Team asset library for people, products, backgrounds, logos and icons.",
      },
      { property: "og:title", content: "Assets — DESIGN AI" },
      {
        property: "og:description",
        content: "Upload and organize the imagery your designs pull from.",
      },
    ],
  }),
  component: AssetsPage,
});

const CATEGORIES: AssetCategory[] = [
  "People",
  "Products",
  "Backgrounds",
  "Logos",
  "Icons",
  "Other",
];

function AssetsPage() {
  const assets = useAssets();
  const [category, setCategory] = useState<AssetCategory>("Other");
  const [filter, setFilter] = useState<AssetCategory | "All">("All");
  const visible = assets.filter((a) => filter === "All" || a.category === filter);

  return (
    <AppShell>
      <PageBody>
        <PageHeader
          title="Assets"
          description="Imagery available to every design. Stored locally in this prototype — a real storage backend comes later."
        />

        <div className="grid gap-8 py-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {(["All", ...CATEGORIES] as (AssetCategory | "All")[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[12px] transition-colors",
                    filter === item
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="No assets yet"
                description="Upload photography, product shots or logo files your designs should use."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {visible.map((asset) => (
                  <div
                    key={asset.id}
                    className="group overflow-hidden rounded-xl border border-border bg-surface"
                  >
                    <img
                      src={asset.src}
                      alt={asset.name}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                    <div className="flex items-center justify-between gap-2 border-t border-border p-3">
                      <div className="min-w-0">
                        <div className="truncate text-[12px] font-medium">{asset.name}</div>
                        <div className="text-[11px] text-muted-foreground">{asset.category}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeAsset(asset.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2 rounded-xl border border-border bg-surface p-4">
              <div className="label-caps">Upload category</div>
              <FieldSelect value={category} onChange={setCategory} options={CATEGORIES} />
            </div>
            <UploadZone
              label="Upload an asset"
              hint="PNG, JPG or WEBP"
              className="py-12"
              onError={(message) => toast.error(message)}
              onUploaded={(src, name) => {
                addAsset({
                  id: newId("asset"),
                  name,
                  src,
                  category,
                  createdAt: new Date().toISOString(),
                });
                toast.success("Asset added.");
              }}
            />
          </div>
        </div>
      </PageBody>
    </AppShell>
  );
}
