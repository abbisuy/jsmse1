"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";

import { ShapeBody } from "@/components/editor/canvas/shape-body";
import { SHAPE_DEFAULT_SIZE, type CanvasNode } from "@/types/canvas";

export const CanvasNodeRenderer = memo(function CanvasNodeRenderer({
  data,
  width,
  height,
  selected,
}: NodeProps<CanvasNode>) {
  const fallback = SHAPE_DEFAULT_SIZE[data.shape];
  const resolvedWidth = width ?? fallback.width;
  const resolvedHeight = height ?? fallback.height;

  return (
    <ShapeBody
      shape={data.shape}
      width={resolvedWidth}
      height={resolvedHeight}
      color={data.color}
      textColor={data.textColor}
      label={data.label}
      selected={selected}
      variant="node"
    />
  );
});
