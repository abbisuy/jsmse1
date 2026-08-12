"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { NodeChange } from "@xyflow/react";

import type { CanvasNode } from "@/types/canvas";

export type CanvasEditDispatch = (changes: NodeChange<CanvasNode>[]) => void;

const CanvasEditContext = createContext<CanvasEditDispatch | null>(null);

export function CanvasEditProvider({
  dispatch,
  children,
}: {
  dispatch: CanvasEditDispatch;
  children: ReactNode;
}) {
  return (
    <CanvasEditContext.Provider value={dispatch}>
      {children}
    </CanvasEditContext.Provider>
  );
}

export function useCanvasEditDispatch(): CanvasEditDispatch {
  const dispatch = useContext(CanvasEditContext);
  if (!dispatch) {
    throw new Error(
      "useCanvasEditDispatch must be used inside <CanvasEditProvider>",
    );
  }
  return dispatch;
}
