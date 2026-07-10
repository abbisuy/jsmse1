"use client";

import { useCallback, useMemo, useState } from "react";

import { slugify } from "@/lib/slugify";
import type { Project, ProjectDialogState } from "@/types/project";

type OpenDialog = "create" | "rename" | "delete" | null;

export interface UseProjectsDialogsResult {
  dialog: ProjectDialogState["open"];
  activeProject: Project | null;
  isSubmitting: boolean;

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

  const [name, setNameState] = useState("");
  const [slug, setSlugState] = useState("");

  const close = useCallback(() => {
    setDialog(null);
    setActiveProject(null);
    setNameState("");
    setSlugState("");
    setIsSubmitting(false);
  }, []);

  const openCreate = useCallback(() => {
    setDialog("create");
    setActiveProject(null);
    setNameState("");
    setSlugState("");
    setIsSubmitting(false);
  }, []);

  const openRename = useCallback((project: Project) => {
    setDialog("rename");
    setActiveProject(project);
    setNameState(project.name);
    setSlugState(project.slug);
    setIsSubmitting(false);
  }, []);

  const openDelete = useCallback((project: Project) => {
    setDialog("delete");
    setActiveProject(project);
    setNameState("");
    setSlugState("");
    setIsSubmitting(false);
  }, []);

  const setName = useCallback((value: string) => {
    setNameState(value);
    setSlugState(slugify(value));
  }, []);

  const setSlug = useCallback((value: string) => {
    setSlugState(slugify(value));
  }, []);

  const submitCreate = useCallback(() => {
    if (!name.trim() || !slug.trim()) return;
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      close();
    }, 600);
  }, [name, slug, close]);

  const submitRename = useCallback(() => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      close();
    }, 600);
  }, [name, close]);

  const submitDelete = useCallback(() => {
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      close();
    }, 600);
  }, [close]);

  return useMemo(
    () => ({
      dialog,
      activeProject,
      isSubmitting,
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
