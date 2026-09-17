import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  ScanSearch,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageBody } from "@/components/layout/AppShell";
import { DesignThumbnail } from "@/components/canvas/DesignRenderer";
import { BrandCard } from "@/components/design/BrandCard";
import { DesignDNAPanel } from "@/components/design/DesignDNAPanel";
import { GenerationProcess } from "@/components/design/GenerationProcess";
import { ReferenceCard } from "@/components/design/ReferenceCard";
import { Field, FieldSelect } from "@/components/common/FieldSelect";
import { ProgressSteps } from "@/components/common/ProgressSteps";
import { UploadZone } from "@/components/common/UploadZone";
import { DemoTag } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BRANDS } from "@/data/brands";
import { CANVAS_FORMATS, HEADLINE_LIMITS, getFormat } from "@/data/formats";
import { DEMO_REFERENCES } from "@/data/references";
import { logActivity, newId, saveProject } from "@/lib/store";
import { cn } from "@/lib/utils";
import { getAIProvider } from "@/services/ai";
import type {
  DesignBrief,
  DesignDNA,
  FormatId,
  LayoutProposal,
  Objective,
  ReferenceImage,
  Tone,
} from "@/types/design";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Design — DESIGN AI" },
      {
        name: "description",
        content:
          "Five guided steps: reference, content, brand, generation and review — producing structured, editable design pieces.",
      },
      { property: "og:title", content: "Create Design — DESIGN AI" },
      {
        property: "og:description",
        content: "Guided AI art direction: reference analysis, brand DNA and three layout directions.",
      },
    ],
  }),
  component: CreateFlow,
});

const STEPS = [
  { index: 1, label: "Reference" },
  { index: 2, label: "Content" },
  { index: 3, label: "Brand" },
  { index: 4, label: "Generate" },
  { index: 5, label: "Review" },
];

const TONES: Tone[] = [
  "Educational",
  "Editorial",
  "Bold",
  "Professional",
  "Playful",
  "Premium",
  "Inspirational",
  "Promotional",
];

const OBJECTIVES: Objective[] = [
  "Educate",
  "Engage",
  "Convert",
  "Build Authority",
  "Announce",
  "Tell a Story",
];

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="max-w-xl">
      <h2 className="text-[22px] font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function CreateFlow() {
  const navigate = useNavigate();
  const provider = getAIProvider();

  const [step, setStep] = useState(1);

  // Step 01 — reference
  const [reference, setReference] = useState<ReferenceImage | null>(null);
  const [uploadPreview, setUploadPreview] = useState<{ src: string; name: string } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dna, setDna] = useState<DesignDNA | null>(null);

  // Step 02 — content
  const [headline, setHeadline] = useState("COSAS GRATIS");
  const [subheadline, setSubheadline] = useState(
    "en línea que vale la pena aprovechar",
  );
  const [body, setBody] = useState("");
  const [cta, setCta] = useState("Desliza");
  const [tone, setTone] = useState<Tone>("Editorial");
  const [objective, setObjective] = useState<Objective>("Educate");

  // Step 03 — brand + format
  const [brandId, setBrandId] = useState("30x");
  const [format, setFormat] = useState<FormatId>("ig-portrait");

  // Step 04 — generation
  const [processing, setProcessing] = useState(false);
  const [proposals, setProposals] = useState<LayoutProposal[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const activeSrc = uploadPreview?.src ?? reference?.src ?? null;
  const headlineLimit = HEADLINE_LIMITS[format];
  const headlineTooLong = headline.length > headlineLimit;

  const brief = useMemo<DesignBrief>(
    () => ({
      headline,
      subheadline,
      body,
      cta,
      tone,
      objective,
      format,
      brandId,
      referenceId: reference?.id,
    }),
    [headline, subheadline, body, cta, tone, objective, format, brandId, reference],
  );

  async function analyzeReference() {
    if (!activeSrc) return;
    setAnalyzing(true);
    try {
      const result = await provider.analyzeReference({
        referenceId: reference?.id,
        src: activeSrc,
      });
      setDna(result);
      logActivity("Reference analyzed", reference?.name ?? uploadPreview?.name ?? "Upload");
      toast.success("Reference analyzed", { description: `Style: ${result.style}` });
    } catch {
      toast.error("Something went wrong while analyzing the reference.", {
        description: "Try again.",
      });
    } finally {
      setAnalyzing(false);
    }
  }

  async function generate() {
    if (!dna) return;
    setProcessing(true);
    setProposals([]);
    setSelected(null);
    try {
      const result = await provider.generateLayouts(brief, dna);
      setProposals(result);
    } catch {
      toast.error("Design generation failed.", { description: "Try again." });
      setProcessing(false);
    }
  }

  function confirmSelection() {
    const proposal = proposals.find((p) => p.design.id === selected);
    if (!proposal) return;
    const projectId = newId("proj");
    const now = new Date().toISOString();
    saveProject({
      id: projectId,
      name: proposal.design.name,
      status: "Draft",
      design: proposal.design,
      brief,
      createdAt: now,
      updatedAt: now,
    });
    logActivity("Design generated", proposal.design.name);
    navigate({ to: "/editor/$projectId", params: { projectId } });
  }

  const canContinue =
    step === 1 ? Boolean(dna) : step === 2 ? headline.trim().length > 0 : true;

  return (
    <AppShell>
      <PageBody className="max-w-[1100px]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
          <div>
            <div className="label-caps">Create design</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Step {String(step).padStart(2, "0")} — {STEPS[step - 1]!.label}
            </h1>
          </div>
          <ProgressSteps steps={STEPS} current={step} onStepClick={setStep} />
        </div>

        {/* ---------------------------------------------------- step 01 */}
        {step === 1 ? (
          <div className="space-y-8">
            <SectionTitle
              title="What's your visual reference?"
              description="Upload a design you want the AI to analyze and use as visual direction. Nothing is copied — only structure, hierarchy and visual language are interpreted."
            />

            <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
              <div className="space-y-4">
                {activeSrc ? (
                  <div className="overflow-hidden rounded-xl border border-border bg-surface">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                      <div className="text-[13px] font-medium">
                        {reference?.name ?? uploadPreview?.name}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-muted-foreground"
                        onClick={() => {
                          setReference(null);
                          setUploadPreview(null);
                          setDna(null);
                        }}
                      >
                        <Trash2 className="size-3.5" />
                        Remove
                      </Button>
                    </div>
                    <div className="flex justify-center bg-surface-sunken p-6">
                      <img
                        src={activeSrc}
                        alt="Reference preview"
                        className="max-h-[420px] rounded-md object-contain shadow-lift"
                      />
                    </div>
                  </div>
                ) : (
                  <UploadZone
                    onUploaded={(src, name) => {
                      setUploadPreview({ src, name });
                      setReference(null);
                      setDna(null);
                    }}
                    onError={(message) => toast.error(message)}
                  />
                )}

                <div>
                  <div className="label-caps pb-3">Or use an example reference</div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {DEMO_REFERENCES.map((item) => (
                      <ReferenceCard
                        key={item.id}
                        reference={item}
                        selected={reference?.id === item.id}
                        onSelect={() => {
                          setReference(item);
                          setUploadPreview(null);
                          setDna(null);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-xl border border-border bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <div className="label-caps">Reference analysis</div>
                    <DemoTag label={provider.isDemo ? "Demo mode" : "Live"} />
                  </div>
                  <p className="mt-3 text-[13px] text-muted-foreground">
                    {!activeSrc
                      ? "Add a reference to continue."
                      : dna
                        ? "Analysis complete. Design DNA extracted."
                        : "Ready to analyze"}
                  </p>
                  <Button
                    className="mt-4 w-full gap-2"
                    disabled={!activeSrc || analyzing || Boolean(dna)}
                    onClick={() => void analyzeReference()}
                  >
                    {analyzing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : dna ? (
                      <Check className="size-4" />
                    ) : (
                      <ScanSearch className="size-4" />
                    )}
                    {dna ? "Reference analyzed" : "Analyze reference"}
                  </Button>
                </div>

                {dna ? <DesignDNAPanel dna={dna} compact /> : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* ---------------------------------------------------- step 02 */}
        {step === 2 ? (
          <div className="space-y-8">
            <SectionTitle
              title="What do you want to communicate?"
              description="The copy stays real editable text in the final piece — never baked into an image."
            />
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5 rounded-xl border border-border bg-surface p-6">
                <Field
                  label="Content / Headline"
                  hint={
                    <span
                      className={cn(
                        "text-[11px] tabular-nums",
                        headlineTooLong ? "text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {headline.length}/{headlineLimit}
                    </span>
                  }
                >
                  <Textarea
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    rows={2}
                    className={cn(
                      "resize-none bg-surface text-base",
                      headlineTooLong && "border-destructive",
                    )}
                  />
                </Field>
                {headlineTooLong ? (
                  <p className="-mt-2 text-[12px] text-destructive">
                    Your content is too long for this layout. It will be scaled down and may lose
                    impact.
                  </p>
                ) : null}

                <Field label="Subheadline">
                  <Textarea
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    rows={2}
                    className="resize-none bg-surface"
                  />
                </Field>

                <Field label="Body / Key points">
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    placeholder="One idea per line"
                    className="resize-none bg-surface"
                  />
                </Field>

                <Field label="CTA">
                  <Input value={cta} onChange={(e) => setCta(e.target.value)} className="bg-surface" />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Tone">
                    <FieldSelect value={tone} onChange={setTone} options={TONES} />
                  </Field>
                  <Field label="Objective">
                    <FieldSelect value={objective} onChange={setObjective} options={OBJECTIVES} />
                  </Field>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-surface p-5">
                  <div className="label-caps">Content check</div>
                  <ul className="mt-3 space-y-2.5 text-[13px]">
                    {[
                      { label: "Headline present", ok: headline.trim().length > 0 },
                      { label: "Fits chosen format", ok: !headlineTooLong },
                      { label: "Secondary text present", ok: subheadline.trim().length > 0 },
                      { label: "CTA defined", ok: cta.trim().length > 0 },
                    ].map((item) => (
                      <li key={item.label} className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "flex size-4 items-center justify-center rounded-full",
                            item.ok ? "bg-primary text-primary-foreground" : "bg-surface-sunken",
                          )}
                        >
                          {item.ok ? <Check className="size-2.5" /> : null}
                        </span>
                        <span className={item.ok ? "" : "text-muted-foreground"}>
                          {item.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {dna ? <DesignDNAPanel dna={dna} compact /> : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* ---------------------------------------------------- step 03 */}
        {step === 3 ? (
          <div className="space-y-8">
            <SectionTitle
              title="Which brand is this for?"
              description="Brand DNA is separate from the reference. Reference DNA gives the visual direction; Brand DNA keeps the piece unmistakably yours."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BRANDS.map((brand) => (
                <BrandCard
                  key={brand.id}
                  brand={brand}
                  selected={brandId === brand.id}
                  onSelect={() => setBrandId(brand.id)}
                />
              ))}
            </div>

            <div>
              <div className="label-caps pb-3">Format</div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {CANVAS_FORMATS.map((item) => {
                  const active = format === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormat(item.id)}
                      className={cn(
                        "rounded-xl border bg-surface p-4 text-left transition-all",
                        active ? "border-primary ring-1 ring-primary" : "border-border hover:shadow-lift",
                      )}
                    >
                      <div className="flex h-16 items-end">
                        <div
                          className="rounded-sm border border-border-strong bg-surface-sunken"
                          style={{
                            height: 56,
                            width: (56 * item.width) / item.height,
                          }}
                        />
                      </div>
                      <div className="mt-3 text-[13px] font-medium">{item.label}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.width} × {item.height} · {item.ratioLabel}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {/* ---------------------------------------------------- step 04 */}
        {step === 4 ? (
          <div className="space-y-8">
            <SectionTitle
              title="Generate design directions"
              description="Three controlled interpretations of the same brief. Everything is produced as structured data — text stays text, images stay images."
            />

            {proposals.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface p-8">
                {processing ? (
                  <GenerationProcess onDone={() => setProcessing(false)} />
                ) : (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <p className="max-w-sm text-sm text-muted-foreground">
                      Reference DNA + Brand DNA + content are ready. Generate the layout
                      proposals whenever you want.
                    </p>
                    <Button size="lg" className="gap-2" onClick={() => void generate()}>
                      <Sparkles className="size-4" />
                      Generate layouts
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-3">
                {proposals.map((proposal) => {
                  const active = selected === proposal.design.id;
                  return (
                    <button
                      key={proposal.design.id}
                      type="button"
                      onClick={() => setSelected(proposal.design.id)}
                      className={cn(
                        "flex flex-col overflow-hidden rounded-xl border bg-surface text-left transition-all",
                        active ? "border-primary ring-1 ring-primary" : "border-border hover:shadow-lift",
                      )}
                    >
                      <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <span className="text-[13px] font-semibold">
                          Option {proposal.direction}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {proposal.title}
                        </span>
                      </div>
                      <div className="flex justify-center bg-surface-sunken p-5">
                        <div className="overflow-hidden rounded-md shadow-lift">
                          <DesignThumbnail design={proposal.design} boxWidth={232} />
                        </div>
                      </div>
                      <p className="border-t border-border p-4 text-[12px] leading-relaxed text-muted-foreground">
                        {proposal.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {proposals.length > 0 ? (
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" onClick={() => void generate()}>
                  Regenerate
                </Button>
                <Button disabled={!selected} onClick={() => setStep(5)} className="gap-2">
                  Continue to review
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---------------------------------------------------- step 05 */}
        {step === 5 ? (
          <div className="space-y-8">
            <SectionTitle
              title="Review and open in the editor"
              description="Compare the chosen direction against the reference, then take over in the design editor."
            />
            {(() => {
              const proposal = proposals.find((p) => p.design.id === selected);
              if (!proposal) {
                return (
                  <p className="text-sm text-muted-foreground">
                    Go back to step 04 and pick a direction first.
                  </p>
                );
              }
              return (
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-xl border border-border bg-surface p-5">
                    <div className="label-caps pb-3">Reference</div>
                    <div className="flex justify-center rounded-lg bg-surface-sunken p-5">
                      {activeSrc ? (
                        <img
                          src={activeSrc}
                          alt="Reference"
                          className="max-h-[420px] rounded-md object-contain shadow-lift"
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-5">
                    <div className="flex items-center justify-between pb-3">
                      <div className="label-caps">Generated · Option {proposal.direction}</div>
                      <span className="text-[11px] text-muted-foreground">
                        {getFormat(proposal.design.format).label}
                      </span>
                    </div>
                    <div className="flex justify-center rounded-lg bg-surface-sunken p-5">
                      <div className="overflow-hidden rounded-md shadow-lift">
                        <DesignThumbnail design={proposal.design} boxWidth={300} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex flex-wrap gap-3">
              <Button size="lg" disabled={!selected} onClick={confirmSelection} className="gap-2">
                Open in editor
                <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => setStep(4)}>
                Choose another direction
              </Button>
            </div>
          </div>
        ) : null}

        {/* ----------------------------------------------------- footer */}
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          {step < 4 ? (
            <Button
              className="gap-2"
              disabled={!canContinue}
              onClick={() => setStep((s) => s + 1)}
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <span className="text-[12px] text-muted-foreground">
              {provider.isDemo
                ? "Demo mode — layouts are composed locally from structured data."
                : provider.label}
            </span>
          )}
        </div>
      </PageBody>
    </AppShell>
  );
}
