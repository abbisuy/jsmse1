"use client";

import {
  Circle,
  Cylinder,
  Diamond,
  Hexagon,
  Pill,
  Square,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CANVAS_SHAPE_MIME,
  SHAPE_DEFAULT_SIZE,
  type CanvasNodeShape,
  type ShapeDragPayload,
} from "@/types/canvas";

interface ShapeButtonConfig {
  shape: CanvasNodeShape;
  label: string;
  Icon: LucideIcon;
}

const SHAPES: ShapeButtonConfig[] = [
  { shape: "rect", label: "Rectangle", Icon: Square },
  { shape: "diamond", label: "Diamond", Icon: Diamond },
  { shape: "circle", label: "Circle", Icon: Circle },
  { shape: "pill", label: "Pill", Icon: Pill },
  { shape: "cylinder", label: "Cylinder", Icon: Cylinder },
  { shape: "hexagon", label: "Hexagon", Icon: Hexagon },
];

export function ShapePanel() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
      <div
        className={cn(
          "pointer-events-auto flex items-center gap-1 rounded-full border border-surface-border bg-surface p-1 shadow-lg",
        )}
      >
        {SHAPES.map(({ shape, label, Icon }) => {
          const payload: ShapeDragPayload = {
            shape,
            ...SHAPE_DEFAULT_SIZE[shape],
          };
          return (
            <Button
              key={shape}
              variant="ghost"
              size="icon-sm"
              draggable
              onDragStart={(event) => {
                const data = JSON.stringify(payload);
                event.dataTransfer.setData(CANVAS_SHAPE_MIME, data);
                event.dataTransfer.setData("text/plain", data);
              }}
              aria-label={label}
              title={label}
            >
              <Icon />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
