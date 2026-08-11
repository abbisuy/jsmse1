"use client";

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
}

const CSS_SHAPES: CanvasNodeShape[] = ["rect", "pill", "circle"];
const SVG_SHAPES: CanvasNodeShape[] = ["diamond", "hexagon", "cylinder"];

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

export function ShapeBody({
  shape,
  width,
  height,
  color,
  textColor,
  label,
  selected = false,
  variant = "node",
}: ShapeBodyProps) {
  const strokeColor = selected
    ? "var(--color-ring)"
    : "var(--color-surface-border)";
  const strokeWidth = selected ? 2 : 1.5;
  const showLabel = variant === "node" && label.length > 0;
  const containerOpacity = variant === "drag-preview" ? 0.65 : 1;
  const useCss = isCssShape(shape);
  const useSvg = isSvgShape(shape);

  return (
    <div
      className="relative"
      style={{ width, height, opacity: containerOpacity }}
    >
      {useCss ? (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center px-3 py-2",
            selected ? "border-ring" : "border-surface-border",
          )}
          style={{
            background: color,
            border: `${strokeWidth}px solid`,
            borderRadius: cssRadius(shape),
          }}
        >
          {showLabel ? (
            <span
              className="truncate text-center text-sm"
              style={{ color: textColor }}
            >
              {label}
            </span>
          ) : null}
        </div>
      ) : useSvg && (() => {
        const narrowed = shape as Extract<CanvasNodeShape, "diamond" | "hexagon" | "cylinder">;
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

      {showLabel && useSvg ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 py-2">
          <span
            className="truncate text-center text-sm"
            style={{ color: textColor }}
          >
            {label}
          </span>
        </div>
      ) : null}
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
