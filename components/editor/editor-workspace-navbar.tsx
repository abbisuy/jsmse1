"use client";

import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

interface EditorWorkspaceNavbarProps {
  projectName: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isAiSidebarOpen: boolean;
  onToggleAiSidebar: () => void;
}

export function EditorWorkspaceNavbar({
  projectName,
  isSidebarOpen,
  onToggleSidebar,
  isAiSidebarOpen,
  onToggleAiSidebar,
}: EditorWorkspaceNavbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-surface-border bg-surface px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
        <span className="truncate text-sm font-medium text-copy-primary">
          {projectName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <Share2 />
          Share
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleAiSidebar}
          aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
          aria-expanded={isAiSidebarOpen}
        >
          <Sparkles />
        </Button>
        <UserButton />
      </div>
    </header>
  );
}
