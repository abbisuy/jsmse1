"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { slugify } from "@/lib/slugify";
import type { Project, ProjectDialogState } from "@/types/project";

type OpenDialog = "create" | "rename" | "delete" | null;

export interface UseProjectsDialogsResult {
  dialog: ProjectDialogState["open"];
  activeProject: Project | null;
  isSubmitting: boolean;
  error: string | null;

  name: string;
  slug: string;

  openCreate: () => void;
  openRename: (project: Project) => void;
  openDelete: (project: Project) => void;
  close: () => void;

  setName: (name: string) => void;
  setSlug: (slug: string) => void;

  submitCreate: () => void;
  submitRename: () => void;
  submitDelete: () => void;
}

export function useProjectsDialogs(): UseProjectsDialogsResult {
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setNameState] = useState("");
  const [slug, setSlugState] = useState("");

  const router = useRouter();

  const close = useCallback(() => {
    setDialog(null);
    setActiveProject(null);
    setNameState("");
    setSlugState("");
    setIsSubmitting(false);
    setError(null);
  }, []);

  const openCreate = useCallback(() => {
    setDialog("create");
    setActiveProject(null);
    setNameState("");
    setSlugState("");
    setIsSubmitting(false);
    setError(null);
  }, []);

  const openRename = useCallback((project: Project) => {
    setDialog("rename");
    setActiveProject(project);
    setNameState(project.name);
    setSlugState(project.slug);
    setIsSubmitting(false);
    setError(null);
  }, []);

  const openDelete = useCallback((project: Project) => {
    setDialog("delete");
    setActiveProject(project);
    setNameState("");
    setSlugState("");
    setIsSubmitting(false);
    setError(null);
  }, []);

  const setName = useCallback((value: string) => {
    setNameState(value);
    setSlugState(slugify(value));
  }, []);

  const setSlug = useCallback((value: string) => {
    setSlugState(slugify(value));
  }, []);

  const submitCreate = useCallback(async () => {
    if (!name.trim() || !slug.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() }),
      });
      if (!response.ok) {
        throw new Error(`Create project failed: ${response.status}`);
      }
      const created = (await response.json()) as { id: string };
      close();
      //router.refresh();
      router.push(`/editor/${created.id}`);
    } catch {
      setIsSubmitting(false);
    }
  }, [name, slug, close, router]);

  const submitRename = useCallback(async () => {
    if (!activeProject || !name.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? `Rename failed (${response.status})`);
      }
      close();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rename failed");
      setIsSubmitting(false);
    }
  }, [activeProject, name, close, router]);

  const submitDelete = useCallback(async () => {
    if (!activeProject) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "DELETE",
      });
      if (!response.ok && response.status !== 204) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? `Delete failed (${response.status})`);
      }
      close();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setIsSubmitting(false);
    }
  }, [activeProject, close, router]);

  return useMemo(
    () => ({
      dialog,
      activeProject,
      isSubmitting,
      error,
      name,
      slug,
      openCreate,
      openRename,
      openDelete,
      close,
      setName,
      setSlug,
      submitCreate,
      submitRename,
      submitDelete,
    }),
    [
      dialog,
      activeProject,
      isSubmitting,
      error,
      name,
      slug,
      openCreate,
      openRename,
      openDelete,
      close,
      setName,
      setSlug,
      submitCreate,
      submitRename,
      submitDelete,
    ]
  );
}
