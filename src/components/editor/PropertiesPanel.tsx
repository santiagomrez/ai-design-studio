import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldSelect } from "@/components/common/FieldSelect";
import { Slider } from "@/components/ui/slider";
import type {
  ButtonElement,
  DesignElement,
  ImageElement,
  LogoElement,
  ShapeElement,
  TextAlign,
  TextElement,
} from "@/types/design";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[86px_1fr] items-center gap-3">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  step = 1,
}: {
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <Input
      type="number"
      step={step}
      value={Math.round(value * 100) / 100}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-8 bg-surface text-[13px]"
    />
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value.startsWith("#") ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="size-8 cursor-pointer rounded-md border border-border bg-surface"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 bg-surface text-[13px]"
      />
    </div>
  );
}

export function PropertiesPanel({
  element,
  onUpdate,
  onDelete,
  onReplaceImage,
}: {
  element: DesignElement | null;
  onUpdate: (patch: Partial<DesignElement>) => void;
  onDelete: () => void;
  onReplaceImage: () => void;
}) {
  if (!element) {
    return (
      <div className="p-5 text-[13px] leading-relaxed text-muted-foreground">
        Select a layer on the canvas to edit its properties. Text stays real text — edit it and
        the design JSON updates instantly.
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="label-caps">{element.type}</div>
          <div className="text-[13px] font-medium">{element.name}</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground"
          onClick={onDelete}
          title="Delete layer"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {element.type === "text" ? (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <span className="text-[12px] text-muted-foreground">Content</span>
            <Textarea
              value={(element as TextElement).content}
              onChange={(e) => onUpdate({ content: e.target.value } as Partial<TextElement>)}
              rows={3}
              className="resize-none bg-surface text-[13px]"
            />
          </div>
          <Row label="Font size">
            <NumberInput
              value={(element as TextElement).fontSize}
              onChange={(fontSize) => onUpdate({ fontSize } as Partial<TextElement>)}
            />
          </Row>
          <Row label="Weight">
            <FieldSelect
              value={String((element as TextElement).fontWeight)}
              onChange={(weight) =>
                onUpdate({ fontWeight: Number(weight) } as Partial<TextElement>)
              }
              options={["300", "400", "500", "600", "700", "800", "900"]}
            />
          </Row>
          <Row label="Line height">
            <NumberInput
              step={0.05}
              value={(element as TextElement).lineHeight}
              onChange={(lineHeight) => onUpdate({ lineHeight } as Partial<TextElement>)}
            />
          </Row>
          <Row label="Tracking">
            <NumberInput
              step={0.5}
              value={(element as TextElement).letterSpacing}
              onChange={(letterSpacing) => onUpdate({ letterSpacing } as Partial<TextElement>)}
            />
          </Row>
          <Row label="Align">
            <FieldSelect
              value={(element as TextElement).align}
              onChange={(align) => onUpdate({ align: align as TextAlign } as Partial<TextElement>)}
              options={["left", "center", "right"]}
            />
          </Row>
          <Row label="Case">
            <FieldSelect
              value={(element as TextElement).textTransform}
              onChange={(textTransform) =>
                onUpdate({
                  textTransform: textTransform as "none" | "uppercase",
                } as Partial<TextElement>)
              }
              options={["none", "uppercase"]}
            />
          </Row>
          <Row label="Color">
            <ColorInput
              value={(element as TextElement).color}
              onChange={(color) => onUpdate({ color } as Partial<TextElement>)}
            />
          </Row>
        </div>
      ) : null}

      {element.type === "button" ? (
        <div className="space-y-3">
          <Row label="Label">
            <Input
              value={(element as ButtonElement).text}
              onChange={(e) => onUpdate({ text: e.target.value } as Partial<ButtonElement>)}
              className="h-8 bg-surface text-[13px]"
            />
          </Row>
          <Row label="Font size">
            <NumberInput
              value={(element as ButtonElement).fontSize}
              onChange={(fontSize) => onUpdate({ fontSize } as Partial<ButtonElement>)}
            />
          </Row>
          <Row label="Radius">
            <NumberInput
              value={(element as ButtonElement).borderRadius}
              onChange={(borderRadius) => onUpdate({ borderRadius } as Partial<ButtonElement>)}
            />
          </Row>
          <Row label="Fill">
            <ColorInput
              value={(element as ButtonElement).background}
              onChange={(background) => onUpdate({ background } as Partial<ButtonElement>)}
            />
          </Row>
          <Row label="Label color">
            <ColorInput
              value={(element as ButtonElement).color}
              onChange={(color) => onUpdate({ color } as Partial<ButtonElement>)}
            />
          </Row>
        </div>
      ) : null}

      {element.type === "logo" ? (
        <div className="space-y-3">
          <Row label="Text">
            <Input
              value={(element as LogoElement).text}
              onChange={(e) => onUpdate({ text: e.target.value } as Partial<LogoElement>)}
              className="h-8 bg-surface text-[13px]"
            />
          </Row>
          <Row label="Font size">
            <NumberInput
              value={(element as LogoElement).fontSize}
              onChange={(fontSize) => onUpdate({ fontSize } as Partial<LogoElement>)}
            />
          </Row>
          <Row label="Color">
            <ColorInput
              value={(element as LogoElement).color}
              onChange={(color) => onUpdate({ color } as Partial<LogoElement>)}
            />
          </Row>
        </div>
      ) : null}

      {element.type === "image" ? (
        <div className="space-y-3">
          <Button variant="outline" size="sm" className="w-full" onClick={onReplaceImage}>
            Replace image
          </Button>
          <Row label="Fit">
            <FieldSelect
              value={(element as ImageElement).objectFit}
              onChange={(objectFit) =>
                onUpdate({ objectFit: objectFit as "cover" | "contain" } as Partial<ImageElement>)
              }
              options={["cover", "contain"]}
            />
          </Row>
          <Row label="Radius">
            <NumberInput
              value={(element as ImageElement).borderRadius}
              onChange={(borderRadius) => onUpdate({ borderRadius } as Partial<ImageElement>)}
            />
          </Row>
          <Row label="Scale">
            <div className="flex items-center gap-2">
              <Slider
                value={[(element as ImageElement).scale * 100]}
                min={50}
                max={150}
                step={1}
                onValueChange={(values) =>
                  onUpdate({ scale: (values[0] ?? 100) / 100 } as Partial<ImageElement>)
                }
              />
              <span className="w-10 text-right text-[12px] tabular-nums text-muted-foreground">
                {Math.round((element as ImageElement).scale * 100)}%
              </span>
            </div>
          </Row>
        </div>
      ) : null}

      {element.type === "shape" ? (
        <div className="space-y-3">
          <Row label="Fill">
            <ColorInput
              value={(element as ShapeElement).fill}
              onChange={(fill) => onUpdate({ fill } as Partial<ShapeElement>)}
            />
          </Row>
          <Row label="Border">
            <NumberInput
              value={(element as ShapeElement).borderWidth}
              onChange={(borderWidth) => onUpdate({ borderWidth } as Partial<ShapeElement>)}
            />
          </Row>
          <Row label="Radius">
            <NumberInput
              value={(element as ShapeElement).borderRadius}
              onChange={(borderRadius) => onUpdate({ borderRadius } as Partial<ShapeElement>)}
            />
          </Row>
        </div>
      ) : null}

      <div className="space-y-3 border-t border-border pt-4">
        <div className="label-caps">Position &amp; size</div>
        <div className="grid grid-cols-2 gap-3">
          <Row label="X">
            <NumberInput value={element.x} onChange={(x) => onUpdate({ x })} />
          </Row>
          <Row label="Y">
            <NumberInput value={element.y} onChange={(y) => onUpdate({ y })} />
          </Row>
          <Row label="Width">
            <NumberInput value={element.width} onChange={(width) => onUpdate({ width })} />
          </Row>
          <Row label="Height">
            <NumberInput value={element.height} onChange={(height) => onUpdate({ height })} />
          </Row>
        </div>
        <Row label="Opacity">
          <div className="flex items-center gap-2">
            <Slider
              value={[element.opacity * 100]}
              min={10}
              max={100}
              step={1}
              onValueChange={(values) => onUpdate({ opacity: (values[0] ?? 100) / 100 })}
            />
            <span className="w-10 text-right text-[12px] tabular-nums text-muted-foreground">
              {Math.round(element.opacity * 100)}%
            </span>
          </div>
        </Row>
      </div>
    </div>
  );
}
