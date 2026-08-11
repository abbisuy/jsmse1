"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";

import { cn } from "@/lib/utils";
import type { CanvasNode } from "@/types/canvas";

export const CanvasNodeRenderer = memo(function CanvasNodeRenderer({
  data,
  width,
  height,
  selected,
}: NodeProps<CanvasNode>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md border bg-surface px-3 py-2 text-center text-sm text-copy-primary",
        selected ? "border-ring" : "border-surface-border",
      )}
      style={{
        width: width ?? "min-content",
        height: height ?? "auto",
        minHeight: 40,
      }}
    >
      <span className="truncate">{data.label}</span>
    </div>
  );
});
