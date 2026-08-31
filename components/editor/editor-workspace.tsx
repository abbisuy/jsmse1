"use client";

import { useState } from "react";

import { EditorWorkspaceNavbar } from "@/components/editor/editor-workspace-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { ShareDialog } from "@/components/editor/dialogs/share-dialog";
import { CanvasRoom } from "@/components/editor/canvas/canvas-room";
import { AiSidebar } from "@/components/editor/ai-sidebar";
import { useProjectsDialogs } from "@/hooks/use-projects-dialogs";
import type { Project } from "@/types/project";

interface EditorWorkspaceProps {
  projects: Project[];
  currentProject: { id: string; name: string };
  isOwner: boolean;
}

export function EditorWorkspace({
  projects,
  currentProject,
  isOwner,
}: EditorWorkspaceProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const dialogs = useProjectsDialogs();

  return (
    <div className="flex h-screen flex-col bg-base">
      <EditorWorkspaceNavbar
        projectName={currentProject.name}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((v) => !v)}
        isOwner={isOwner}
        onShareClick={() => setShowShareDialog(true)}
      />

      <div className="flex flex-1 gap-1 bg-base/80 p-1 md:overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          projects={projects}
          currentProjectId={currentProject.id}
          onNewProject={() => {
            dialogs.openCreate();
          }}
          onRename={(project) => {
            dialogs.openRename(project);
          }}
          onDelete={(project) => {
            dialogs.openDelete(project);
          }}
          className="shrink-0"
        />

        <main className="flex flex-1 items-center justify-center rounded-xl border border-surface-border bg-surface shadow-sm px-3 py-4 text-center md:px-6">
          <CanvasRoom roomId={currentProject.id} />
        </main>

        <AiSidebar
          isOpen={isAiSidebarOpen}
          onClose={() => setIsAiSidebarOpen(false)}
        />
      </div>

      <CreateProjectDialog
        open={dialogs.dialog === "create"}
        onOpenChange={(open) => {
          if (!open) dialogs.close();
        }}
        name={dialogs.name}
        slug={dialogs.slug}
        isSubmitting={dialogs.isSubmitting}
        onNameChange={dialogs.setName}
        onCreate={dialogs.submitCreate}
      />

      <RenameProjectDialog
        open={dialogs.dialog === "rename"}
        onOpenChange={(open) => {
          if (!open) dialogs.close();
        }}
        currentName={dialogs.activeProject?.name ?? ""}
        name={dialogs.name}
        isSubmitting={dialogs.isSubmitting}
        error={dialogs.error}
        onNameChange={(value) => dialogs.setName(value)}
        onRename={dialogs.submitRename}
      />

      <DeleteProjectDialog
        open={dialogs.dialog === "delete"}
        onOpenChange={(open) => {
          if (!open) dialogs.close();
        }}
        projectName={dialogs.activeProject?.name ?? ""}
        isSubmitting={dialogs.isSubmitting}
        error={dialogs.error}
        onDelete={dialogs.submitDelete}
      />

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        projectId={currentProject.id}
        isOwner={isOwner}
      />
    </div>
  );
}
