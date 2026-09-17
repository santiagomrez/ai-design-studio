import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageBody, PageHeader } from "@/components/layout/AppShell";
import { BrandCard } from "@/components/design/BrandCard";
import { BRANDS } from "@/data/brands";
import { DEMO_REFERENCES } from "@/data/references";

export const Route = createFileRoute("/brand")({
  head: () => ({
    meta: [
      { title: "Brand DNA — DESIGN AI" },
      {
        name: "description",
        content:
          "Manage brand DNA: colors, typography, design principles, CTA and image style, plus what to avoid.",
      },
      { property: "og:title", content: "Brand DNA — DESIGN AI" },
      {
        property: "og:description",
        content: "Brand DNA is separate from reference DNA — the combination produces the design.",
      },
    ],
  }),
  component: BrandPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border py-4 last:border-b-0">
      <div className="label-caps pb-2">{title}</div>
      <div className="text-[13px] leading-relaxed">{children}</div>
    </div>
  );
}

function BrandPage() {
  const [activeId, setActiveId] = useState(BRANDS[0].id);
  const brand = BRANDS.find((b) => b.id === activeId) ?? BRANDS[0];

  return (
    <AppShell>
      <PageBody>
        <PageHeader
          title="Brand DNA"
          description="Brand DNA keeps every piece unmistakably yours. Reference DNA supplies the visual direction — the two stay separate on purpose."
        />

        <div className="grid gap-8 py-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            {BRANDS.map((item) => (
              <BrandCard
                key={item.id}
                brand={item}
                selected={item.id === activeId}
                onSelect={() => setActiveId(item.id)}
              />
            ))}
            <div className="rounded-xl border border-dashed border-border bg-surface p-4 text-[12px] text-muted-foreground">
              Adding new brands from the UI is coming soon. Brand DNA is stored as structured data,
              so it can be edited or imported later.
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-4 border-b border-border pb-5">
              <div className="flex size-14 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground">
                {brand.logoText}
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{brand.name}</h2>
                <p className="text-[12px] text-muted-foreground">Brand DNA · editable structure</p>
              </div>
            </div>

            <Section title="Colors">
              <div className="flex flex-wrap gap-4">
                {brand.colors.map((color) => (
                  <div key={color.hex} className="flex items-center gap-2">
                    <span
                      className="size-8 rounded-md border border-border"
                      style={{ background: color.hex }}
                    />
                    <div>
                      <div className="text-[12px] font-medium">{color.name}</div>
                      <div className="text-[11px] uppercase text-muted-foreground">
                        {color.hex}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Typography">
              <ul className="space-y-1">
                {brand.fonts.map((font) => (
                  <li key={font.role}>
                    <span className="text-muted-foreground">{font.role}:</span> {font.family}{" "}
                    {font.weight}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Design principles">
              <div className="flex flex-wrap gap-1.5">
                {brand.principles.map((principle) => (
                  <span
                    key={principle}
                    className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {principle}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="CTA style">{brand.ctaStyle}</Section>
            <Section title="Image style">{brand.imageStyle}</Section>
            <Section title="Spacing rules">{brand.spacingRules}</Section>
            <Section title="Forbidden styles">
              <ul className="space-y-1 text-muted-foreground">
                {brand.forbidden.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </Section>
            <Section title="Examples">
              <div className="flex gap-3">
                {DEMO_REFERENCES.slice(0, 3).map((reference) => (
                  <img
                    key={reference.id}
                    src={reference.src}
                    alt={reference.name}
                    loading="lazy"
                    className="h-28 w-24 rounded-md border border-border object-cover"
                  />
                ))}
              </div>
            </Section>
          </div>
        </div>
      </PageBody>
    </AppShell>
  );
}
