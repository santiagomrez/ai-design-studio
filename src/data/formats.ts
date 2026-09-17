import type { CanvasFormat, FormatId } from "@/types/design";

export const CANVAS_FORMATS: CanvasFormat[] = [
  {
    id: "ig-portrait",
    label: "Instagram Portrait",
    platform: "Instagram",
    width: 1080,
    height: 1350,
    ratioLabel: "4:5",
  },
  {
    id: "ig-square",
    label: "Instagram Square",
    platform: "Instagram",
    width: 1080,
    height: 1080,
    ratioLabel: "1:1",
  },
  {
    id: "ig-story",
    label: "Instagram Story",
    platform: "Instagram",
    width: 1080,
    height: 1920,
    ratioLabel: "9:16",
  },
  {
    id: "li-portrait",
    label: "LinkedIn Portrait",
    platform: "LinkedIn",
    width: 1080,
    height: 1350,
    ratioLabel: "4:5",
  },
  {
    id: "fb-post",
    label: "Facebook Post",
    platform: "Facebook",
    width: 1200,
    height: 1500,
    ratioLabel: "4:5",
  },
];

export function getFormat(id: FormatId): CanvasFormat {
  return CANVAS_FORMATS.find((f) => f.id === id) ?? CANVAS_FORMATS[0];
}

/** Rough guide used to warn when copy is too long for the chosen canvas. */
export const HEADLINE_LIMITS: Record<FormatId, number> = {
  "ig-portrait": 48,
  "ig-square": 40,
  "ig-story": 52,
  "li-portrait": 56,
  "fb-post": 48,
};
