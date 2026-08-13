"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Handle,
  NodeResizer,
  Position,
  useReactFlow,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react";

import { useCanvasEditDispatch } from "@/components/editor/canvas/canvas-edit-context";
import { NodeColorToolbar } from "@/components/editor/canvas/node-color-toolbar";
import { ShapeBody } from "@/components/editor/canvas/shape-body";
import { cn } from "@/lib/utils";
import {
  SHAPE_DEFAULT_SIZE,
  SHAPE_LABEL_PLACEHOLDER,
  getShapeMinSize,
  type CanvasNode,
  type CanvasNodeShape,
  type NodeColorPair,
} from "@/types/canvas";

const SVG_SHAPES: ReadonlySet<CanvasNodeShape> = new Set([
  "diamond",
  "hexagon",
  "cylinder",
]);

export const CanvasNodeRenderer = memo(function CanvasNodeRenderer({
  id,
  data,
  width,
  height,
  selected,
}: NodeProps<CanvasNode>) {
  const fallback = SHAPE_DEFAULT_SIZE[data.shape];
  const resolvedWidth = width ?? fallback.width;
  const resolvedHeight = height ?? fallback.height;
  const minSize = getShapeMinSize(data.shape);
  const isSvgShape = SVG_SHAPES.has(data.shape);

  const dispatch = useCanvasEditDispatch();
  const { getNode } = useReactFlow();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.label);
  const [hovered, setHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editing) return;
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.focus();
    textarea.select();
  }, [editing]);

  const commit = useCallback(() => {
    setEditing(false);
    if (draft === data.label) return;
    const current = getNode(id) as CanvasNode | undefined;
    if (!current) return;
    const item: CanvasNode = {
      ...current,
      data: { ...current.data, label: draft },
    };
    const change: NodeChange<CanvasNode> = {
      type: "replace",
      id,
      item,
    };
    dispatch([change]);
  }, [data.label, draft, dispatch, getNode, id]);

  const startEditing = useCallback(() => {
    setDraft(data.label);
    setEditing(true);
  }, [data.label]);

  const handleColorChange = useCallback(
    (pair: NodeColorPair) => {
      if (pair.color === data.color && pair.textColor === data.textColor) {
        return;
      }
      const current = getNode(id) as CanvasNode | undefined;
      if (!current) return;
      const item: CanvasNode = {
        ...current,
        data: {
          ...current.data,
          color: pair.color,
          textColor: pair.textColor,
        },
      };
      const change: NodeChange<CanvasNode> = { type: "replace", id, item };
      dispatch([change]);
    },
    [data.color, data.textColor, dispatch, getNode, id],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        commit();
        return;
      }
      if (event.key === "Enter" && !event.shiftKey) {
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

  return (
    <div
      className="relative"
      style={{ width: resolvedWidth, height: resolvedHeight }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className={cn(
          "h-2 w-2 rounded-full bg-surface border border-surface-border",
          "transition-opacity duration-150",
          hovered ? "opacity-100" : "opacity-0",
        )}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={cn(
          "h-2 w-2 rounded-full bg-surface border border-surface-border",
          "transition-opacity duration-150",
          hovered ? "opacity-100" : "opacity-0",
        )}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={cn(
          "h-2 w-2 rounded-full bg-surface border border-surface-border",
          "transition-opacity duration-150",
          hovered ? "opacity-100" : "opacity-0",
        )}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className={cn(
          "h-2 w-2 rounded-full bg-surface border border-surface-border",
          "transition-opacity duration-150",
          hovered ? "opacity-100" : "opacity-0",
        )}
      />
      {selected && !editing ? (
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: `calc(100% + 12px)` }}
        >
          <NodeColorToolbar
            currentColor={data.color}
            currentColorText={data.textColor}
            onChange={handleColorChange}
          />
        </div>
      ) : null}

      {selected ? (
        <NodeResizer
          nodeId={id}
          isVisible
          minWidth={minSize.width}
          minHeight={minSize.height}
          color="var(--color-ring)"
          handleClassName="h-2 w-2 rounded-sm border border-surface-border bg-surface shadow-sm"
          lineClassName="!border-surface-border"
        />
      ) : null}

      <div className="absolute inset-0" onDoubleClick={handleDoubleClick}>
        <ShapeBody
          shape={data.shape}
          width={resolvedWidth}
          height={resolvedHeight}
          color={data.color}
          textColor={data.textColor}
          label={editing ? draft : data.label}
          selected={selected}
          variant="node"
          placeholder={editing ? undefined : SHAPE_LABEL_PLACEHOLDER}
        />
      </div>

      {editing ? (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          onPointerDown={stopPropagation}
          onMouseDown={stopPropagation}
          onTouchStart={stopPropagation}
          onDoubleClick={stopPropagation}
          placeholder={isSvgShape ? SHAPE_LABEL_PLACEHOLDER : undefined}
          className={cn(
            "absolute inset-0 flex items-center justify-center text-sm",
            "field-sizing-content cursor-text",
          )}
          style={{
            color: data.textColor,
            background: "transparent",
            textAlign: "center",
            outline: "none",
            resize: "none",
            width: "100%",
            height: "100%",
            padding: "0.25rem 0.75rem",
            borderRadius: shapeRadius(data.shape),
          }}
          rows={1}
        />
      ) : null}
    </div>
  );
});

function shapeRadius(shape: CanvasNodeShape): string {
  switch (shape) {
    case "pill":
      return "9999px";
    case "circle":
      return "50%";
    default:
      return "0";
  }
}
