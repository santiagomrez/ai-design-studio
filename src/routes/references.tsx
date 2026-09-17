import { createFileRoute } from "@tanstack/react-router";
import { Loader2, ScanSearch } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageBody, PageHeader } from "@/components/layout/AppShell";
import { DesignDNAPanel } from "@/components/design/DesignDNAPanel";
import { ReferenceCard } from "@/components/design/ReferenceCard";
import { UploadZone } from "@/components/common/UploadZone";
import { Button } from "@/components/ui/button";
import { DEMO_REFERENCES } from "@/data/references";
import { useUploadedReferences } from "@/hooks/useAppStore";
import { addUploadedReference, logActivity, newId } from "@/lib/store";
import { getAIProvider } from "@/services/ai";
import type { DesignDNA, ReferenceImage } from "@/types/design";

export const Route = createFileRoute("/references")({
  head: () => ({
    meta: [
      { title: "References — DESIGN AI" },
      {
        name: "description",
        content:
          "Reference library: analyze visual references and turn them into reusable Design DNA rules.",
      },
      { property: "og:title", content: "References — DESIGN AI" },
      {
        property: "og:description",
        content: "Analyze references and extract style, hierarchy and composition rules.",
      },
    ],
  }),
  component: ReferencesPage,
});

function ReferencesPage() {
  const provider = getAIProvider();
  const uploaded = useUploadedReferences();
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [dna, setDna] = useState<{ name: string; dna: DesignDNA } | null>(null);

  const all: ReferenceImage[] = [...uploaded, ...DEMO_REFERENCES];

  async function analyze(reference: ReferenceImage) {
    setAnalyzingId(reference.id);
    try {
      const result = await provider.analyzeReference({
        referenceId: reference.id,
        src: reference.src,
      });
      setDna({ name: reference.name, dna: result });
      logActivity("Reference analyzed", reference.name);
    } catch {
      toast.error("Something went wrong while analyzing the reference.", {
        description: "Try again.",
      });
    } finally {
      setAnalyzingId(null);
    }
  }

  return (
    <AppShell>
      <PageBody>
        <PageHeader
          title="References"
          description="The visual inputs your team trusts. Analyzing a reference produces Design DNA — a set of visual rules, never a copy."
        />

        <div className="grid gap-8 py-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <UploadZone
              label="Add a new reference"
              hint="PNG, JPG or WEBP"
              className="py-12"
              onError={(message) => toast.error(message)}
              onUploaded={(src, name) => {
                addUploadedReference({
                  id: newId("ref"),
                  name,
                  src,
                  style: "Uploaded",
                  tags: ["Uploaded"],
                });
                toast.success("Reference added to the library.");
              }}
            />

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {all.map((reference) => (
                <ReferenceCard
                  key={reference.id}
                  reference={reference}
                  footer={
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1 w-full gap-1.5"
                      disabled={analyzingId === reference.id}
                      onClick={() => void analyze(reference)}
                    >
                      {analyzingId === reference.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <ScanSearch className="size-3.5" />
                      )}
                      Analyze reference
                    </Button>
                  }
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {dna ? (
              <>
                <div className="label-caps">Analysis · {dna.name}</div>
                <DesignDNAPanel dna={dna.dna} />
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-[13px] leading-relaxed text-muted-foreground">
                Analyze a reference to see its Design DNA: style, palette, typography,
                composition, hierarchy and image treatment.
              </div>
            )}
          </div>
        </div>
      </PageBody>
    </AppShell>
  );
}
