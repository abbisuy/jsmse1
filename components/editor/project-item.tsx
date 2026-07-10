"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Project } from "@/types/project";

interface ProjectItemProps {
  project: Project;
  onRename?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const day = 24 * 60 * 60 * 1000;
  if (diff < day) return "Today";
  const days = Math.floor(diff / day);
  if (days < 2) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function ProjectItem({ project, onRename, onDelete }: ProjectItemProps) {
  return (
    <div className="group/item flex items-center gap-1 rounded-lg px-2 py-2 transition-colors hover:bg-accent">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm text-copy-primary">{project.name}</span>
        <span className="truncate text-xs text-copy-faint">
          {project.slug} · {formatRelative(project.updatedAt)}
        </span>
      </div>

      {project.owner && onRename && onDelete && (
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/item:opacity-100 focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Rename ${project.name}`}
            onClick={() => onRename(project)}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${project.name}`}
            onClick={() => onDelete(project)}
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  );
}
