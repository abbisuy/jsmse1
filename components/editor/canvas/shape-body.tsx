"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";
import type { CanvasNodeShape } from "@/types/canvas";

export type ShapeBodyVariant = "node" | "drag-preview";

interface ShapeBodyProps {
  shape: CanvasNodeShape;
  width: number;
  height: number;
  color: string;
  textColor: string;
  label: string;
  selected?: boolean;
  variant?: ShapeBodyVariant;
  placeholder?: string;
}

const CSS_SHAPES: CanvasNodeShape[] = ["rect", "pill", "circle"];
const SVG_SHAPES: CanvasNodeShape[] = ["diamond", "hexagon", "cylinder"];

const LABEL_PADDING = 3;
const LABEL_LINE_HEIGHT = 18;
const LABEL_FONT_SIZE = 13;

function isCssShape(shape: CanvasNodeShape): shape is "rect" | "pill" | "circle" {
  return CSS_SHAPES.includes(shape);
}

function isSvgShape(
  shape: CanvasNodeShape,
): shape is Extract<CanvasNodeShape, "diamond" | "hexagon" | "cylinder"> {
  return SVG_SHAPES.includes(shape);
}

function cssRadius(shape: CanvasNodeShape): string {
  switch (shape) {
    case "pill":
      return "9999px";
    case "circle":
      return "50%";
    default:
      return "0";
  }
}

interface LabelBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getInscribedLabelArea(
  shape: CanvasNodeShape,
  width: number,
  height: number,
): LabelBox {
  const padding = LABEL_PADDING;
  let box: LabelBox;

  switch (shape) {
    case "rect": {
      box = { x: 0, y: 0, width, height };
      break;
    }
    case "pill": {
      // Pill = rounded rect with radius = height/2. The biggest rectangle
      // that fits inside is bounded by the straight side segments.
      const r = height / 2;
      box = { x: r, y: 0, width: width - 2 * r, height };
      break;
    }
    case "circle": {
      // Biggest rectangle inscribed in a circle is a square with side = r*sqrt(2).
      const r = Math.min(width, height) / 2;
      const side = r * Math.SQRT2;
      const cx = width / 2;
      const cy = height / 2;
      box = {
        x: cx - side / 2,
        y: cy - side / 2,
        width: side,
        height: side,
      };
      break;
    }
    case "diamond": {
      // Diamond connects (w/2,0),(w,h/2),(w/2,h),(0,h/2).
      // The biggest rectangle that fits inside has width = w/2, height = h/2,
      // centered. (Inscribed axis-aligned rect with max area.)
      box = {
        x: width / 4,
        y: height / 4,
        width: width / 2,
        height: height / 2,
      };
      break;
    }
    case "hexagon": {
      // Pointy-side hexagon defined in HexagonPolygon: inset = min(w,h) * 0.25.
      // The flat top/bottom span from x=inset to x=w-inset; the slanted sides
      // meet the vertical sides at y=h/2. The biggest inscribed axis-aligned
      // rectangle that fits inside has height = h and width = w - 2*inset,
      // sitting in the middle band where the hexagon is rectangular — but
      // that band is only the middle (the slanted parts eat into the top/bottom).
      // To be safe and still give the largest practical text box, treat the
      // flat rectangle as width = w - 2*inset, height = h/2, centered.
      const inset = Math.min(width, height) * 0.25;
      const innerW = Math.max(0, width - 2 * inset);
      const innerH = height / 2;
      box = {
        x: (width - innerW) / 2,
        y: (height - innerH) / 2,
        width: innerW,
        height: innerH,
      };
      break;
    }
    case "cylinder": {
      // Cylinder = rect body with ellipses top & bottom.
      // ellipseRY = min(width*0.18, height*0.18). The visible "flat" middle
      // band where the body is rectangular spans from y=ellipseRY to y=h-ellipseRY.
      // The biggest rectangle that fits inside the body is that middle band,
      // plus we can extend slightly into the ellipses but the rect width
      // shrinks there — keep it simple: the rect band width = w.
      const ellipseRY = Math.min(width * 0.18, height * 0.18);
      box = {
        x: 0,
        y: ellipseRY,
        width,
        height: Math.max(0, height - 2 * ellipseRY),
      };
      break;
    }
    default: {
      box = { x: 0, y: 0, width, height };
    }
  }

  // Apply 3px padding inside the inscribed area.
  const paddedX = box.x + padding;
  const paddedY = box.y + padding;
  const paddedW = Math.max(0, box.width - 2 * padding);
  const paddedH = Math.max(0, box.height - 2 * padding);
  return {
    x: paddedX,
    y: paddedY,
    width: paddedW,
    height: paddedH,
  };
}

function useLabelLines(box: LabelBox): number {
  return useMemo(() => {
    if (box.height <= 0 || box.width <= 0) return 0;
    return Math.max(1, Math.floor(box.height / LABEL_LINE_HEIGHT));
  }, [box.height, box.width]);
}

function LabelText({
  box,
  textColor,
  label,
  placeholder,
}: {
  box: LabelBox;
  textColor: string;
  label: string;
  placeholder?: string;
}) {
  const lines = useLabelLines(box);
  const hasLabel = label.length > 0;
  const showPlaceholder = !hasLabel && Boolean(placeholder);

  if (!hasLabel && !showPlaceholder) return null;

  const text = hasLabel ? label : placeholder ?? "";
  const italic = !hasLabel && showPlaceholder;
  const color = hasLabel ? textColor : "var(--color-copy-secondary)";

  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        color,
        fontSize: LABEL_FONT_SIZE,
        lineHeight: `${LABEL_LINE_HEIGHT}px`,
        textAlign: "center",
        overflow: "hidden",
        WebkitBoxOrient: "vertical",
        display: "-webkit-box",
        WebkitLineClamp: lines,
        wordBreak: "break-word",
        overflowWrap: "break-word",
        fontStyle: italic ? "italic" : "normal",
        opacity: italic ? 0.5 : 1,
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
}

export function ShapeBody({
  shape,
  width,
  height,
  color,
  textColor,
  label,
  selected = false,
  variant = "node",
  placeholder,
}: ShapeBodyProps) {
  const strokeColor = selected
    ? "var(--color-ring)"
    : "var(--color-surface-border)";
  const strokeWidth = selected ? 2 : 1.5;
  const showLabel = variant === "node" && label.length > 0;
  const showPlaceholder =
    variant === "node" && !showLabel && Boolean(placeholder);
  const containerOpacity = variant === "drag-preview" ? 0.65 : 1;
  const useCss = isCssShape(shape);
  const useSvg = isSvgShape(shape);
  const showText = showLabel || showPlaceholder;

  const labelBox = useMemo(
    () => getInscribedLabelArea(shape, width, height),
    [shape, width, height],
  );

  const labelNode = showText ? (
    <LabelText
      box={labelBox}
      textColor={textColor}
      label={label}
      placeholder={showPlaceholder ? placeholder : undefined}
    />
  ) : null;

  return (
    <div
      className="relative"
      style={{ width, height, opacity: containerOpacity }}
    >
      {useCss ? (
        <div
          className={cn(
            "h-full w-full",
            selected ? "border-ring" : "border-surface-border",
          )}
          style={{
            background: color,
            border: `${strokeWidth}px solid`,
            borderRadius: cssRadius(shape),
          }}
        />
      ) : useSvg && (() => {
        const narrowed = shape as Extract<
          CanvasNodeShape,
          "diamond" | "hexagon" | "cylinder"
        >;
        return (
          <SvgShape
            shape={narrowed}
            width={width}
            height={height}
            color={color}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      })()}

      {labelNode}
    </div>
  );
}

interface SvgShapeProps {
  shape: Extract<CanvasNodeShape, "diamond" | "hexagon" | "cylinder">;
  width: number;
  height: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
}

function SvgShape({
  shape,
  width,
  height,
  color,
  strokeColor,
  strokeWidth,
}: SvgShapeProps) {
  const fill = color;
  const stroke = strokeColor;
  const commonProps = {
    fill,
    stroke,
    strokeWidth,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block"
    >
      {shape === "diamond" && (
        <polygon
          points={`${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`}
          {...commonProps}
        />
      )}

      {shape === "hexagon" && (
        <HexagonPolygon width={width} height={height} {...commonProps} />
      )}

      {shape === "cylinder" && (
        <CylinderShape width={width} height={height} {...commonProps} />
      )}
    </svg>
  );
}

function HexagonPolygon({
  width,
  height,
  ...rest
}: {
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeLinejoin: "round";
}) {
  const inset = Math.min(width, height) * 0.25;
  const points = [
    [inset, 0],
    [width - inset, 0],
    [width, height / 2],
    [width - inset, height],
    [inset, height],
    [0, height / 2],
  ];
  return <polygon points={points.map((p) => p.join(",")).join(" ")} {...rest} />;
}

function CylinderShape({
  width,
  height,
  strokeWidth,
  ...rest
}: {
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeLinejoin: "round";
}) {
  const ellipseRY = Math.min(width * 0.18, height * 0.18);
  const rx = width / 2;
  const cx = width / 2;

  return (
    <g>
      <rect
        x={strokeWidth / 2}
        y={ellipseRY}
        width={width - strokeWidth}
        height={height - ellipseRY * 2}
        fill={rest.fill}
        stroke={rest.stroke}
        strokeWidth={strokeWidth}
      />
      <ellipse
        cx={cx}
        cy={height - ellipseRY}
        rx={rx - strokeWidth / 2}
        ry={ellipseRY}
        fill={rest.fill}
        stroke={rest.stroke}
        strokeWidth={strokeWidth}
      />
      <ellipse
        cx={cx}
        cy={ellipseRY}
        rx={rx - strokeWidth / 2}
        ry={ellipseRY}
        fill={rest.fill}
        stroke={rest.stroke}
        strokeWidth={strokeWidth}
      />
    </g>
  );
}
