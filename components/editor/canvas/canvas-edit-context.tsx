"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { EdgeChange, NodeChange } from "@xyflow/react";

import type { CanvasEdge, CanvasNode } from "@/types/canvas";

export type CanvasNodeEditDispatch = (changes: NodeChange<CanvasNode>[]) => void;
export type CanvasEdgeEditDispatch = (changes: EdgeChange<CanvasEdge>[]) => void;

type CanvasEditContextValue = {
  dispatchNodes: CanvasNodeEditDispatch;
  dispatchEdges: CanvasEdgeEditDispatch;
};

const CanvasEditContext = createContext<CanvasEditContextValue | null>(null);

export function CanvasEditProvider({
  dispatchNodes,
  dispatchEdges,
  children,
}: {
  dispatchNodes: CanvasNodeEditDispatch;
  dispatchEdges: CanvasEdgeEditDispatch;
  children: ReactNode;
}) {
  return (
    <CanvasEditContext.Provider value={{ dispatchNodes, dispatchEdges }}>
      {children}
    </CanvasEditContext.Provider>
  );
}

function useCanvasEditContext(): CanvasEditContextValue {
  const value = useContext(CanvasEditContext);
  if (!value) {
    throw new Error(
      "useCanvasEditDispatch must be used inside <CanvasEditProvider>",
    );
  }
  return value;
}

export function useCanvasEditDispatch(): CanvasNodeEditDispatch {
  return useCanvasEditContext().dispatchNodes;
}

export function useCanvasEdgeEditDispatch(): CanvasEdgeEditDispatch {
  return useCanvasEditContext().dispatchEdges;
}
