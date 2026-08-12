import type { Edge, Node } from "@xyflow/react";

export type CanvasNodeShape =
  | "rect"
  | "circle"
  | "diamond"
  | "pill"
  | "cylinder"
  | "hexagon";

export interface CanvasNodeData {
  label: string;
  color: string;
  shape: CanvasNodeShape;
  textColor: string;
  [key: string]: unknown;
}

export interface CanvasNode extends Node {
  type?: "canvasNode";
  data: CanvasNodeData;
}

export interface CanvasEdgeData {
  [key: string]: unknown;
}

export interface CanvasEdge extends Edge {
  type?: "canvasEdge";
  data?: CanvasEdgeData;
}

export const DEFAULT_NODE_COLOR = "#8b97af";
export const DEFAULT_NODE_TEXT_COLOR = "#e5e7eb";

export const SHAPE_DEFAULT_SIZE: Record<
  CanvasNodeShape,
  { width: number; height: number }
> = {
  rect: { width: 160, height: 80 },
  circle: { width: 80, height: 80 },
  diamond: { width: 200, height: 120 },
  pill: { width: 120, height: 60 },
  cylinder: { width: 120, height: 100 },
  hexagon: { width: 140, height: 80 },
};

export const SHAPE_MIN_SIZE: Record<
  CanvasNodeShape,
  { width: number; height: number }
> = {
  rect: { width: 80, height: 40 },
  circle: { width: 48, height: 48 },
  diamond: { width: 100, height: 60 },
  pill: { width: 72, height: 36 },
  cylinder: { width: 72, height: 60 },
  hexagon: { width: 80, height: 48 },
};

export function getShapeMinSize(shape: CanvasNodeShape) {
  return SHAPE_MIN_SIZE[shape];
}

export const SHAPE_LABEL_PLACEHOLDER = "Double-click to edit";

export interface ShapeDragPayload {
  shape: CanvasNodeShape;
  width: number;
  height: number;
}

export const CANVAS_SHAPE_MIME = "application/x-canvas-shape";
