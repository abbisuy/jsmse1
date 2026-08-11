"use client";

import { useCallback } from "react";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeAddChange,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";

// Essential styles for Liveblocks and React Flow integration
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

import { CanvasNodeRenderer } from "@/components/editor/canvas/canvas-node";
import { ShapePanel } from "@/components/editor/canvas/shape-panel";
import {
  CANVAS_SHAPE_MIME,
  DEFAULT_NODE_COLOR,
  DEFAULT_NODE_TEXT_COLOR,
  SHAPE_DEFAULT_SIZE,
  type CanvasEdge,
  type CanvasNode,
  type CanvasNodeShape,
  type ShapeDragPayload,
} from "@/types/canvas";

let nodeCounter = 0;

const SHAPE_KEYS: CanvasNodeShape[] = [
  "rect",
  "circle",
  "diamond",
  "pill",
  "cylinder",
  "hexagon",
];

function isCanvasNodeShape(value: unknown): value is CanvasNodeShape {
  return typeof value === "string" && SHAPE_KEYS.includes(value as CanvasNodeShape);
}

export function Canvas() {
  const flow = useLiveblocksFlow<CanvasNode, CanvasEdge>({
    suspense: true,
    nodes: { initial: [] },
    edges: { initial: [] },
  });

  return (
    <ReactFlowProvider>
      <CanvasInner flow={flow} />
    </ReactFlowProvider>
  );
}

function CanvasInner({
  flow,
}: {
  flow: ReturnType<typeof useLiveblocksFlow<CanvasNode, CanvasEdge>>;
}) {
  const { screenToFlowPosition } = useReactFlow();

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const raw =
        event.dataTransfer.getData(CANVAS_SHAPE_MIME) ||
        event.dataTransfer.getData("text/plain");
      if (!raw) return;

      let payload: ShapeDragPayload;
      try {
        payload = JSON.parse(raw) as ShapeDragPayload;
      } catch {
        return;
      }
      if (!isCanvasNodeShape(payload.shape)) return;

      const defaults = SHAPE_DEFAULT_SIZE[payload.shape];
      const width = payload.width ?? defaults.width;
      const height = payload.height ?? defaults.height;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: CanvasNode = {
        id: `${payload.shape}-${Date.now()}-${nodeCounter++}`,
        type: "canvasNode",
        position: { x: position.x - width / 2, y: position.y - height / 2 },
        width,
        height,
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR,
          textColor: DEFAULT_NODE_TEXT_COLOR,
          shape: payload.shape,
        },
      };

      flow.onNodesChange([
        { type: "add", item: newNode } as NodeAddChange<CanvasNode>,
      ]);
    },
    [screenToFlowPosition, flow],
  );

  return (
    <div
      className="relative h-full w-full bg-surface"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={flow.nodes}
        edges={flow.edges}
        nodeTypes={{ canvasNode: CanvasNodeRenderer }}
        onNodesChange={flow.onNodesChange}
        onEdgesChange={flow.onEdgesChange}
        onConnect={flow.onConnect}
        onDelete={flow.onDelete}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Cursors />
      </ReactFlow>
      <ShapePanel />
    </div>
  );
}
