import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Image as ImageIcon, Layers, Palette, Ruler, Type as TypeIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DesignRenderer, DesignThumbnail } from "@/components/canvas/DesignRenderer";
import { CanvasToolbar } from "@/components/editor/CanvasToolbar";
import { LayersPanel } from "@/components/editor/LayersPanel";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { QAPanel } from "@/components/editor/QAPanel";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/common/EmptyState";
import { UploadZone } from "@/components/common/UploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBrand } from "@/data/brands";
import { CANVAS_FORMATS } from "@/data/formats";
import { getReference } from "@/data/references";
import { useDesignEditor } from "@/hooks/useDesignEditor";
import { useAssets, useProject } from "@/hooks/useAppStore";
import { addAsset, logActivity, newId, setProjectStatus } from "@/lib/store";
import { cn } from "@/lib/utils";
import { getAIProvider } from "@/services/ai";
import { DEMO_HERO_IMAGES, createId } from "@/services/design/layout-engine";
import { applyFormat } from "@/services/design/format-change";
import { exportDesign } from "@/services/export/render-to-canvas";
import type {
  Design,
  DesignElement,
  FormatId,
  ImageElement,
  ProjectStatus,
  TextElement,
} from "@/types/design";

export const Route = createFileRoute("/editor/$projectId")({
  head: () => ({
    meta: [
      { title: "Design editor — DESIGN AI" },
      {
        name: "description",
        content:
          "Structured design editor: layers, properties, AI design QA, auto-fix, variations and PNG/JPG export.",
      },
      { property: "og:title", content: "Design editor — DESIGN AI" },
      {
        property: "og:description",
        content: "Edit real text, images and shapes — the piece is always structured data.",
      },
    ],
  }),
  component: EditorScreen,
});

function EditorScreen() {
  const { projectId } = useParams({ from: "/editor/$projectId" });
  const project = useProject(projectId);

  if (!project) {
    return (
      <AppShell>
        <div className="mx-auto max-w-xl px-8 py-24">
          <EmptyState
            icon={Layers}
            title="This project isn't available"
            description="It may have been removed from this browser. Open one of your projects or start a new design."
            action={
              <Button asChild>
                <Link to="/projects">Go to projects</Link>
              </Button>
            }
          />
        </div>
      </AppShell>
    );
  }

  return <Editor key={project.id} project={project} />;
}

function Editor({ project }: { project: NonNullable<ReturnType<typeof useProject>> }) {
  const provider = getAIProvider();
  const assets = useAssets();
  const editor = useDesignEditor(project);
  const { design, selectedElement, selectedId } = editor;

  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [zoom, setZoom] = useState(0.32);
  const [runningQA, setRunningQA] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [variationsOpen, setVariationsOpen] = useState(false);
  const [variations, setVariations] = useState<{ label: string; note: string; design: Design }[]>([]);
  const [imagePickerFor, setImagePickerFor] = useState<string | null>(null);
  const canvasArea = useRef<HTMLDivElement>(null);

  const fitZoom = useCallback(() => {
    const box = canvasArea.current;
    if (!box) return;
    const available = Math.min(
      (box.clientHeight - 80) / design.height,
      (box.clientWidth - 80) / design.width,
    );
    setZoom(Math.max(0.08, Math.min(1, available)));
  }, [design.height, design.width]);

  useEffect(() => {
    fitZoom();
  }, [fitZoom]);

  const reference = getReference(design.referenceId);
  const brand = getBrand(design.brandId ?? "30x");
  const textLayers = design.elements.filter((el) => el.type === "text") as TextElement[];

  async function runQA() {
    setRunningQA(true);
    try {
      const result = await provider.evaluateDesign(design);
      editor.setQa(result);
      logActivity("QA completed", design.name);
      toast.success(`Design QA complete — overall ${result.overall}`, {
        description: `${result.warnings.length} note(s) to review.`,
      });
    } catch {
      toast.error("Something went wrong while reviewing the design.", {
        description: "Try again.",
      });
    } finally {
      setRunningQA(false);
    }
  }

  async function autoFix() {
    if (!editor.qa) return;
    setFixing(true);
    try {
      const { design: fixed, fixed: changes } = await provider.autoFixDesign(design, editor.qa);
      editor.commit(fixed);
      const next = await provider.evaluateDesign(fixed);
      editor.setQa(next);
      logActivity("Auto-fix applied", design.name);
      toast.success(`${changes.length} design issue${changes.length === 1 ? "" : "s"} fixed.`, {
        description: changes.join(" · "),
      });
    } catch {
      toast.error("Auto-fix couldn't be applied.", { description: "Try again." });
    } finally {
      setFixing(false);
    }
  }

  async function openVariations() {
    setVariationsOpen(true);
    setVariations([]);
    const result = await provider.generateVariations(design);
    setVariations(result);
  }

  async function handleExport(format: "png" | "jpg") {
    setExporting(true);
    try {
      await exportDesign(design, format);
      logActivity("Design exported", `${design.name} (${format.toUpperCase()})`);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch {
      toast.error("Export failed.", { description: "Try again." });
    } finally {
      setExporting(false);
    }
  }

  function changeFormat(formatId: FormatId) {
    editor.commit(applyFormat(design, formatId));
    setTimeout(fitZoom, 0);
  }

  function addTextLayer() {
    editor.addElement({
      id: createId("txt"),
      type: "text",
      name: "New text",
      content: "New text layer",
      x: Math.round(design.width * 0.083),
      y: Math.round(design.height * 0.42),
      width: Math.round(design.width * 0.6),
      height: Math.round(design.width * 0.08),
      rotation: 0,
      zIndex: 200,
      opacity: 1,
      visible: true,
      locked: false,
      fontFamily: "Inter",
      fontSize: Math.round(design.width * 0.045),
      fontWeight: 500,
      lineHeight: 1.25,
      letterSpacing: 0,
      color: brand.colors[1]?.hex ?? "#111111",
      align: "left",
      textTransform: "none",
    } as TextElement);
  }

  function addShapeLayer() {
    editor.addElement({
      id: createId("shp"),
      type: "shape",
      name: "New shape",
      x: Math.round(design.width * 0.4),
      y: Math.round(design.height * 0.4),
      width: Math.round(design.width * 0.2),
      height: Math.round(design.width * 0.2),
      rotation: 0,
      zIndex: 150,
      opacity: 1,
      visible: true,
      locked: false,
      fill: brand.colors[3]?.hex ?? "#E8C547",
      borderColor: "transparent",
      borderWidth: 0,
      borderRadius: 0,
    });
  }

  function setImageSrc(elementId: string, src: string) {
    editor.updateElement(elementId, { src } as Partial<ImageElement>, true);
    setImagePickerFor(null);
  }

  const imageLayers = design.elements.filter((el) => el.type === "image") as ImageElement[];

  return (
    <AppShell bare>
      <div className="flex h-screen flex-col">
        <CanvasToolbar
          name={design.name}
          status={status}
          saveStatus={editor.saveStatus}
          zoom={zoom}
          exporting={exporting}
          onZoom={(delta) => setZoom((z) => Math.max(0.08, Math.min(1.5, z + delta)))}
          onZoomFit={fitZoom}
          onStatusChange={(next) => {
            setStatus(next);
            setProjectStatus(project.id, next);
            if (next === "Approved") logActivity("Design approved", design.name);
          }}
          onCompare={() => setCompareOpen(true)}
          onVariations={() => void openVariations()}
          onExport={(format) => void handleExport(format)}
          onCanva={() =>
            toast("Canva integration coming soon.", {
              description: "The design JSON is already structured for it.",
            })
          }
        />

        <div className="flex min-h-0 flex-1">
          {/* ------------------------------------------------ left panel */}
          <aside className="hidden w-[268px] shrink-0 flex-col border-r border-border bg-sidebar md:flex">
            <Tabs defaultValue="layers" className="flex min-h-0 flex-1 flex-col gap-0">
              <TabsList className="m-2 grid grid-cols-5 bg-surface-sunken">
                <TabsTrigger value="layers" title="Layers">
                  <Layers className="size-3.5" />
                </TabsTrigger>
                <TabsTrigger value="text" title="Text">
                  <TypeIcon className="size-3.5" />
                </TabsTrigger>
                <TabsTrigger value="images" title="Images">
                  <ImageIcon className="size-3.5" />
                </TabsTrigger>
                <TabsTrigger value="brand" title="Brand">
                  <Palette className="size-3.5" />
                </TabsTrigger>
                <TabsTrigger value="layout" title="Layout">
                  <Ruler className="size-3.5" />
                </TabsTrigger>
              </TabsList>

              <div className="min-h-0 flex-1 overflow-y-auto p-2">
                <TabsContent value="layers" className="mt-0">
                  <LayersPanel
                    design={design}
                    selectedId={selectedId}
                    onSelect={editor.setSelectedId}
                    onUpdate={(id, patch) => editor.updateElement(id, patch)}
                    onReorder={editor.reorderElement}
                  />
                  <div className="mt-4 space-y-2 border-t border-border pt-4">
                    <div className="label-caps px-2">Add element</div>
                    <Button variant="outline" size="sm" className="w-full" onClick={addTextLayer}>
                      Add text
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={addShapeLayer}>
                      Add shape
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="mt-0 space-y-3">
                  <div className="label-caps px-1">Text layers</div>
                  {textLayers.map((layer) => (
                    <div key={layer.id} className="space-y-1.5">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[12px] text-muted-foreground">{layer.name}</span>
                        <button
                          type="button"
                          className="text-[11px] text-muted-foreground underline-offset-2 hover:underline"
                          onClick={() => editor.setSelectedId(layer.id)}
                        >
                          Select
                        </button>
                      </div>
                      <Input
                        value={layer.content}
                        onChange={(e) =>
                          editor.updateElement(layer.id, {
                            content: e.target.value,
                          } as Partial<TextElement>)
                        }
                        className="h-8 bg-surface text-[13px]"
                      />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="images" className="mt-0 space-y-3">
                  <div className="label-caps px-1">Image layers</div>
                  {imageLayers.length === 0 ? (
                    <p className="px-1 text-[12px] text-muted-foreground">
                      This design has no image layer.
                    </p>
                  ) : (
                    imageLayers.map((layer) => (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() => setImagePickerFor(layer.id)}
                        className="flex w-full items-center gap-2.5 rounded-md border border-border bg-surface p-2 text-left hover:shadow-lift"
                      >
                        <img
                          src={layer.src}
                          alt={layer.name}
                          className="size-10 rounded object-cover"
                        />
                        <span className="text-[12px]">
                          {layer.name}
                          <span className="block text-[11px] text-muted-foreground">
                            Replace image
                          </span>
                        </span>
                      </button>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="brand" className="mt-0 space-y-4 px-1">
                  <div>
                    <div className="label-caps">Brand DNA</div>
                    <div className="mt-1 text-[13px] font-medium">{brand.name}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {brand.colors.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        title={`Apply ${color.name}`}
                        onClick={() => {
                          if (!selectedElement) {
                            toast("Select a layer first.");
                            return;
                          }
                          const patch: Partial<DesignElement> =
                            selectedElement.type === "shape"
                              ? { fill: color.hex }
                              : selectedElement.type === "button"
                                ? { background: color.hex }
                                : { color: color.hex };
                          editor.updateElement(selectedElement.id, patch, true);
                        }}
                        className="size-8 rounded-md border border-border"
                        style={{ background: color.hex }}
                      />
                    ))}
                  </div>
                  <div className="space-y-1 text-[12px] text-muted-foreground">
                    <div>CTA: {brand.ctaStyle}</div>
                    <div>Images: {brand.imageStyle}</div>
                    <div>Spacing: {brand.spacingRules}</div>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="label-caps pb-1.5">Avoid</div>
                    <ul className="space-y-1 text-[12px] text-muted-foreground">
                      {brand.forbidden.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="mt-0 space-y-2 px-1">
                  <div className="label-caps">Format</div>
                  {CANVAS_FORMATS.map((format) => (
                    <button
                      key={format.id}
                      type="button"
                      onClick={() => changeFormat(format.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md border px-2.5 py-2 text-left text-[12px]",
                        design.format === format.id
                          ? "border-primary bg-surface"
                          : "border-border hover:bg-surface",
                      )}
                    >
                      <span>{format.label}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {format.ratioLabel}
                      </span>
                    </button>
                  ))}
                </TabsContent>
              </div>
            </Tabs>
          </aside>

          {/* ---------------------------------------------------- canvas */}
          <div
            ref={canvasArea}
            className="canvas-backdrop flex min-h-0 flex-1 items-center justify-center overflow-auto p-8"
          >
            <div className="shadow-canvas">
              <DesignRenderer
                design={design}
                scale={zoom}
                interactive
                selectedId={selectedId}
                onSelectElement={editor.setSelectedId}
              />
            </div>
          </div>

          {/* ----------------------------------------------- right panel */}
          <aside className="hidden w-[300px] shrink-0 border-l border-border bg-sidebar lg:block">
            <Tabs defaultValue="properties" className="flex h-full min-h-0 flex-col gap-0">
              <TabsList className="m-2 grid grid-cols-2 bg-surface-sunken">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="qa">Design QA</TabsTrigger>
              </TabsList>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <TabsContent value="properties" className="mt-0">
                  <PropertiesPanel
                    element={selectedElement}
                    onUpdate={(patch) =>
                      selectedElement && editor.updateElement(selectedElement.id, patch)
                    }
                    onDelete={() => selectedElement && editor.removeElement(selectedElement.id)}
                    onReplaceImage={() =>
                      selectedElement && setImagePickerFor(selectedElement.id)
                    }
                  />
                </TabsContent>
                <TabsContent value="qa" className="mt-0">
                  <QAPanel
                    qa={editor.qa}
                    running={runningQA}
                    fixing={fixing}
                    canUndo={editor.canUndo}
                    onRun={() => void runQA()}
                    onAutoFix={() => void autoFix()}
                    onUndo={() => {
                      if (editor.undo()) toast("Last change reverted.");
                    }}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </aside>
        </div>
      </div>

      {/* ------------------------------------------------------- dialogs */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Reference vs generated</DialogTitle>
            <DialogDescription>
              Visual comparison against the analyzed reference. Future versions will score
              similarity automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="label-caps pb-3">Reference</div>
              <div className="flex justify-center rounded bg-surface-sunken p-4">
                {reference ? (
                  <img
                    src={reference.src}
                    alt="Reference"
                    className="max-h-[380px] rounded object-contain"
                  />
                ) : (
                  <p className="py-16 text-[13px] text-muted-foreground">
                    No reference attached to this design.
                  </p>
                )}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="label-caps pb-3">Generated</div>
              <div className="flex justify-center rounded bg-surface-sunken p-4">
                <div className="overflow-hidden rounded shadow-lift">
                  <DesignThumbnail design={design} boxWidth={260} />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={variationsOpen} onOpenChange={setVariationsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Design variations</DialogTitle>
            <DialogDescription>
              Same brand DNA, content and format — different composition decisions.
            </DialogDescription>
          </DialogHeader>
          {variations.length === 0 ? (
            <p className="py-12 text-center text-[13px] text-muted-foreground">
              Generating variations…
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {variations.map((variation) => (
                <button
                  key={variation.design.id}
                  type="button"
                  onClick={() => {
                    editor.commit(variation.design);
                    setVariationsOpen(false);
                    setTimeout(fitZoom, 0);
                    toast.success(`Applied variation: ${variation.label}`);
                  }}
                  className="overflow-hidden rounded-lg border border-border bg-surface text-left transition-shadow hover:shadow-lift"
                >
                  <div className="flex justify-center bg-surface-sunken p-4">
                    <div className="overflow-hidden rounded shadow-lift">
                      <DesignThumbnail design={variation.design} boxWidth={180} />
                    </div>
                  </div>
                  <div className="border-t border-border p-3">
                    <div className="text-[13px] font-medium">{variation.label}</div>
                    <div className="text-[11px] text-muted-foreground">{variation.note}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(imagePickerFor)}
        onOpenChange={(open) => !open && setImagePickerFor(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose an image</DialogTitle>
            <DialogDescription>
              Pick from the asset library or upload a new image.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3">
            {[...DEMO_HERO_IMAGES, ...assets.map((a) => a.src)].map((src) => (
              <button
                key={src.slice(0, 48)}
                type="button"
                onClick={() => imagePickerFor && setImageSrc(imagePickerFor, src)}
                className="overflow-hidden rounded-lg border border-border hover:shadow-lift"
              >
                <img src={src} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
          <UploadZone
            label="Upload a new image"
            hint="PNG, JPG or WEBP"
            className="py-10"
            onError={(message) => toast.error(message)}
            onUploaded={(src, name) => {
              addAsset({
                id: newId("asset"),
                name,
                src,
                category: "Other",
                createdAt: new Date().toISOString(),
              });
              if (imagePickerFor) setImageSrc(imagePickerFor, src);
            }}
          />
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
