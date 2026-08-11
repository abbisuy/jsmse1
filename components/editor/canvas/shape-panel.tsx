"use client";

import { useRef } from "react";
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
import { ShapeBody } from "@/components/editor/canvas/shape-body";
import { cn } from "@/lib/utils";
import {
  CANVAS_SHAPE_MIME,
  DEFAULT_NODE_COLOR,
  DEFAULT_NODE_TEXT_COLOR,
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
  const ghostsRef = useRef<Record<CanvasNodeShape, HTMLDivElement | null>>({
    rect: null,
    circle: null,
    diamond: null,
    pill: null,
    cylinder: null,
    hexagon: null,
  });

  return (
    <>
      {/* Off-screen drag-preview ghosts. Rendered once; selected by setDragImage during drag start. */}
      <div
        aria-hidden
        className="pointer-events-none fixed -left-[9999px] -top-[9999px]"
      >
        {SHAPES.map(({ shape }) => {
          const { width, height } = SHAPE_DEFAULT_SIZE[shape];
          return (
            <div
              key={shape}
              ref={(el) => {
                ghostsRef.current[shape] = el;
              }}
            >
              <ShapeBody
                shape={shape}
                width={width}
                height={height}
                color={DEFAULT_NODE_COLOR}
                textColor={DEFAULT_NODE_TEXT_COLOR}
                label=""
                variant="drag-preview"
              />
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <div
          className={cn(
            "pointer-events-auto flex items-center gap-1 rounded-full border border-surface-border bg-surface p-1 shadow-lg",
          )}
        >
          {SHAPES.map(({ shape, label, Icon }) => {
            const { width, height } = SHAPE_DEFAULT_SIZE[shape];
            const payload: ShapeDragPayload = { shape, width, height };
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
                  event.dataTransfer.effectAllowed = "copy";

                  const ghost = ghostsRef.current[shape];
                  if (ghost) {
                    event.dataTransfer.setDragImage(
                      ghost,
                      Math.round(width / 2),
                      Math.round(height / 2),
                    );
                  }
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
    </>
  );
}
