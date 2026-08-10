"use client";

import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CanvasFallbackProps {
  className?: string;
}

export function CanvasLoadingFallback({ className }: CanvasFallbackProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 text-center",
        "bg-surface",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-copy-primary/50" />
      <p className="text-sm text-copy-secondary">Connecting to canvas...</p>
    </div>
  );
}

export function CanvasErrorFallback({ className }: CanvasFallbackProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 text-center p-6",
        "bg-surface",
        className
      )}
    >
      <AlertCircle className="h-8 w-8 text-destructive/70" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-copy-primary">Connection error</p>
        <p className="text-xs text-copy-secondary">Unable to connect to the collaborative session. Please try refreshing.</p>
      </div>
    </div>
  );
}
