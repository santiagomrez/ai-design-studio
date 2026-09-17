import { cn } from "@/lib/utils";
import type {
  ButtonElement,
  Design,
  DesignElement,
  ImageElement,
  LogoElement,
  ShapeElement,
  TextElement,
} from "@/types/design";

interface DesignRendererProps {
  design: Design;
  /** 1 = actual pixels. */
  scale: number;
  selectedId?: string | null | undefined;
  onSelectElement?: ((id: string | null) => void) | undefined;
  interactive?: boolean | undefined;
  className?: string | undefined;
}

function ElementBody({ element }: { element: DesignElement }) {
  switch (element.type) {
    case "text": {
      const el = element as TextElement;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            fontFamily: el.fontFamily,
            fontSize: el.fontSize,
            fontWeight: el.fontWeight,
            lineHeight: el.lineHeight,
            letterSpacing: el.letterSpacing,
            color: el.color,
            textAlign: el.align,
            textTransform: el.textTransform,
            whiteSpace: "pre-wrap",
            overflow: "visible",
          }}
        >
          {el.content}
        </div>
      );
    }
    case "image": {
      const el = element as ImageElement;
      return (
        <img
          src={el.src}
          alt={el.name}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: el.objectFit,
            borderRadius: el.borderRadius,
            transform: `scale(${el.scale})`,
          }}
        />
      );
    }
    case "shape": {
      const el = element as ShapeElement;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: el.fill,
            borderRadius: el.borderRadius,
            border:
              el.borderWidth > 0 ? `${el.borderWidth}px solid ${el.borderColor}` : undefined,
          }}
        />
      );
    }
    case "button": {
      const el = element as ButtonElement;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: el.background,
            color: el.color,
            borderRadius: el.borderRadius,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: el.fontFamily,
            fontSize: el.fontSize,
            fontWeight: el.fontWeight,
            letterSpacing: el.letterSpacing,
            whiteSpace: "nowrap",
          }}
        >
          {el.text}
        </div>
      );
    }
    case "logo": {
      const el = element as LogoElement;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            color: el.color,
            fontFamily: el.fontFamily,
            fontSize: el.fontSize,
            fontWeight: el.fontWeight,
            letterSpacing: el.letterSpacing,
          }}
        >
          {el.text}
        </div>
      );
    }
  }
}

/**
 * Renders the structured design. Nothing here is a flat generated image:
 * every layer stays an independent DOM node driven by the design JSON.
 */
export function DesignRenderer({
  design,
  scale,
  selectedId,
  onSelectElement,
  interactive = false,
  className,
}: DesignRendererProps) {
  const ordered = [...design.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        width: design.width * scale,
        height: design.height * scale,
      }}
      onClick={interactive ? () => onSelectElement?.(null) : undefined}
    >
      <div
        style={{
          width: design.width,
          height: design.height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          background: design.background.color,
          position: "relative",
        }}
      >
        {design.background.type === "image" && design.background.src ? (
          <img
            src={design.background.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        {ordered.map((element) =>
          element.visible ? (
            <div
              key={element.id}
              onClick={
                interactive
                  ? (event) => {
                      event.stopPropagation();
                      if (!element.locked) onSelectElement?.(element.id);
                    }
                  : undefined
              }
              style={{
                position: "absolute",
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                opacity: element.opacity,
                transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                zIndex: element.zIndex,
                cursor: interactive && !element.locked ? "pointer" : undefined,
                outline:
                  selectedId === element.id
                    ? `${Math.max(2, 2 / scale)}px solid oklch(0.55 0.16 250)`
                    : undefined,
                outlineOffset: 2 / scale,
              }}
            >
              <ElementBody element={element} />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

/** Convenience wrapper that fits a design into a fixed box width. */
export function DesignThumbnail({
  design,
  boxWidth,
  className,
}: {
  design: Design;
  boxWidth: number;
  className?: string | undefined;
}) {
  return (
    <DesignRenderer design={design} scale={boxWidth / design.width} className={className} />
  );
}
