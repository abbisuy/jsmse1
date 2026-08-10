import type { Edge, Node } from "@xyflow/react";

export type CanvasNodeShape = "rect" | "circle" | "diamond";

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
