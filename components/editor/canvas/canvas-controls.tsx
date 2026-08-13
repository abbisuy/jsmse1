"use client";

import { useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import {
  useCanRedo,
  useCanUndo,
  useRedo,
  useUndo,
} from "@liveblocks/react";
import { Maximize, Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ANIMATION_MS = 300;

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  if (target.closest("[data-rich-text-editor]")) return true;
  return false;
}

export function CanvasControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;

      const mod = event.metaKey || event.ctrlKey;

      if (mod && !event.shiftKey && (event.key === "z" || event.key === "Z")) {
        if (!canUndo) return;
        event.preventDefault();
        undo();
        return;
      }

      if (
        mod &&
        event.shiftKey &&
        (event.key === "z" || event.key === "Z" || event.key === "y" || event.key === "Y")
      ) {
        if (!canRedo) return;
        event.preventDefault();
        redo();
        return;
      }

      if (mod) return;

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomIn({ duration: ANIMATION_MS });
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        zoomOut({ duration: ANIMATION_MS });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomIn, zoomOut, undo, redo, canUndo, canRedo]);

  return (
    <div className="pointer-events-none absolute bottom-4 right-4">
      <div
        className={cn(
          "pointer-events-auto flex items-center gap-1 rounded-full border border-surface-border bg-surface p-1 shadow-lg",
        )}
      >
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => zoomOut({ duration: ANIMATION_MS })}
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOut />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => fitView({ duration: ANIMATION_MS })}
          aria-label="Fit view"
          title="Fit view"
        >
          <Maximize />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => zoomIn({ duration: ANIMATION_MS })}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomIn />
        </Button>

        <div className="mx-1 h-5 w-px bg-surface-border" />

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => undo()}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo"
        >
          <Undo2 />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => redo()}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo"
        >
          <Redo2 />
        </Button>
      </div>
    </div>
  );
}
