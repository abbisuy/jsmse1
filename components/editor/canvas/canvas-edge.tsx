"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeChange,
  type EdgeProps,
} from "@xyflow/react";

import { useCanvasEdgeEditDispatch } from "@/components/editor/canvas/canvas-edit-context";
import { cn } from "@/lib/utils";
import { EDGE_LABEL_PLACEHOLDER, type CanvasEdge } from "@/types/canvas";

const REST_STROKE = "var(--color-surface-border)";
const ACTIVE_STROKE = "var(--color-ring)";
const HIT_STROKE_WIDTH = 20;

export const CanvasEdgeRenderer = memo(function CanvasEdgeRenderer({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}: EdgeProps<CanvasEdge>) {
  const { getEdge } = useReactFlow();
  const dispatch = useCanvasEdgeEditDispatch();

  const label = typeof data?.label === "string" ? data.label : "";
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) return;
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    input.select();
  }, [editing]);

  const commit = useCallback(() => {
    setEditing(false);
    if (draft === label) return;
    const current = getEdge(id) as CanvasEdge | undefined;
    if (!current) return;
    const item: CanvasEdge = {
      ...current,
      data: { ...current.data, label: draft },
    };
    const change: EdgeChange<CanvasEdge> = { type: "replace", id, item };
    dispatch([change]);
  }, [draft, label, dispatch, getEdge, id]);

  const startEditing = useCallback(() => {
    setDraft(label);
    setEditing(true);
  }, [label]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        commit();
      }
    },
    [commit],
  );

  const stopPropagation = useCallback((event: React.SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      startEditing();
    },
    [startEditing],
  );

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const active = selected || hovered;
  const stroke = active ? ACTIVE_STROKE : REST_STROKE;
  const strokeWidth = active ? 2 : 1.5;

  const showPill = editing || Boolean(label);
  const showHint = !editing && !label && active;

  return (
    <>
      <g
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <BaseEdge
          path={edgePath}
          style={{
            stroke,
            strokeWidth,
            transition: "stroke 120ms ease, stroke-width 120ms ease",
          }}
        />
        <path
          d={edgePath}
          fill="none"
          stroke="transparent"
          strokeWidth={HIT_STROKE_WIDTH}
          style={{ cursor: "pointer" }}
          onDoubleClick={handleDoubleClick}
        />
      </g>
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: editing ? "auto" : "none",
          }}
        >
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={commit}
              onPointerDown={stopPropagation}
              onMouseDown={stopPropagation}
              onTouchStart={stopPropagation}
              onDoubleClick={stopPropagation}
              placeholder={EDGE_LABEL_PLACEHOLDER}
              className={cn(
                "field-sizing-content rounded-full bg-surface px-2 py-0.5",
                "text-xs text-foreground shadow ring-1 ring-surface-border",
                "outline-none focus:ring-2 focus:ring-ring",
              )}
              style={{ minWidth: 80, maxWidth: 240 }}
            />
          ) : showPill ? (
            <div
              onPointerDown={stopPropagation}
              onMouseDown={stopPropagation}
              onTouchStart={stopPropagation}
              onDoubleClick={handleDoubleClick}
              className={cn(
                "cursor-text rounded-full bg-surface px-2 py-0.5",
                "text-xs text-foreground shadow ring-1",
                active ? "ring-ring" : "ring-surface-border",
              )}
            >
              {label}
            </div>
          ) : showHint ? (
            <div
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                "text-surface-border/60 ring-1 ring-surface-border/60",
              )}
            >
              {EDGE_LABEL_PLACEHOLDER}
            </div>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
});
