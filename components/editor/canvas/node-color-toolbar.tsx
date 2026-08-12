"use client";

import { useCallback } from "react";

import { cn } from "@/lib/utils";
import {
  NODE_COLORS,
  type NodeColorPair,
} from "@/types/canvas";

interface NodeColorToolbarProps {
  currentColor: string;
  currentColorText: string;
  onChange: (pair: NodeColorPair) => void;
}

export function NodeColorToolbar({
  currentColor,
  currentColorText,
  onChange,
}: NodeColorToolbarProps) {
  const stopPropagation = useCallback((event: React.SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-1 rounded-full",
        "border border-surface-border bg-surface p-1 shadow-lg",
      )}
      onPointerDown={stopPropagation}
      onMouseDown={stopPropagation}
      onTouchStart={stopPropagation}
      onDoubleClick={stopPropagation}
    >
      {NODE_COLORS.map((pair) => {
        const isActive =
          pair.color === currentColor && pair.textColor === currentColorText;
        return (
          <button
            key={pair.color}
            type="button"
            aria-label={`Set node color to ${pair.color}`}
            aria-pressed={isActive}
            onClick={(event) => {
              event.stopPropagation();
              onChange(pair);
            }}
            onPointerDown={stopPropagation}
            onMouseDown={stopPropagation}
            onTouchStart={stopPropagation}
            onDoubleClick={stopPropagation}
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold leading-none",
              "transition-shadow duration-150",
              isActive
                ? "ring-2 ring-ring ring-offset-1 ring-offset-surface"
                : "ring-1 ring-surface-border-subtle",
            )}
            style={{
              background: pair.color,
              color: pair.textColor,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.boxShadow = `0 0 6px ${pair.textColor}80`;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.boxShadow = "";
            }}
          >
            A
          </button>
        );
      })}
    </div>
  );
}
