"use client";

import { useEffect, useState } from "react";
import { Copy, Link, Loader2, Trash2, UserX, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Collaborator } from "@/types/project";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  isOwner: boolean;
}

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  isOwner,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteEmailError, setInviteEmailError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [removingId, setRemovingId] = useState<string | null>(null);

  const [isCopied, setIsCopied] = useState(false);

  const projectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/editor/${projectId}`
      : `/editor/${projectId}`;

  useEffect(() => {
    if (!open) return;

    async function load() {
      setIsLoadingList(true);
      setListError(null);
      try {
        const res = await fetch(
          `/api/projects/${projectId}/collaborators`
        );
        if (!res.ok) throw new Error("Failed to load collaborators");
        const data = (await res.json()) as {
          collaborators: Collaborator[];
        };
        setCollaborators(data.collaborators);
      } catch {
        setListError("Failed to load collaborators. Please try again.");
      } finally {
        setIsLoadingList(false);
      }
    }

    load();
    setInviteEmail("");
    setInviteEmailError(null);
  }, [open, projectId]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }

  async function handleInvite() {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) {
      setInviteEmailError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInviteEmailError("Invalid email address");
      return;
    }

    setInviteEmailError(null);
    setIsAdding(true);

    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (res.status === 409) {
        setInviteEmailError(
          "This collaborator already has access to this project."
        );
        return;
      }

      if (!res.ok) {
        setInviteEmailError(
          "Failed to invite collaborator. Please try again."
        );
        return;
      }

      const added = (await res.json()) as {
        id: string;
        email: string;
        createdAt: string;
      };
      setCollaborators((prev) => [
        ...prev,
        {
          id: added.id,
          email: added.email,
          displayName: null,
          avatarUrl: null,
          createdAt: added.createdAt,
        },
      ]);
      setInviteEmail("");
    } catch {
      setInviteEmailError("Network error. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  async function handleRemove(collaboratorId: string) {
    setRemovingId(collaboratorId);

    try {
      await fetch(
        `/api/projects/${projectId}/collaborators`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collaboratorId }),
        }
      );

      setCollaborators((prev) =>
        prev.filter((c) => c.id !== collaboratorId)
      );
    } catch {
      // remove failed silently — user can retry
    } finally {
      setRemovingId(null);
    }
  }

  const initials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            {isOwner
              ? "Invite collaborators or share the project link."
              : "View collaborators on this project."}
          </DialogDescription>
        </DialogHeader>

        {listError && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {listError}
          </p>
        )}

        {/* Project link section */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-copy-muted">
            Project link
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Link className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8 pr-2 text-xs"
                value={projectUrl}
                readOnly
                onClick={(e) =>
                  (e.target as HTMLInputElement).select()
                }
              />
            </div>
            <Button
              variant={isCopied ? "default" : "outline"}
              size="sm"
              onClick={handleCopy}
              className="shrink-0 gap-1"
            >
              {isCopied ? (
                <>
                  <span className="text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Collaborators section */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-copy-muted">
            Collaborators{" "}
            {collaborators.length > 0 && (
              <span className="ml-1 text-muted-foreground">
                ({collaborators.length})
              </span>
            )}
          </label>

          {isLoadingList ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : collaborators.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No collaborators yet. Share the project link or invite by email.
            </p>
          ) : (
            <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
              {collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-muted/50"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-dim text-[11px] font-medium text-copy-primary">
                    {collab.displayName
                      ? initials(collab.displayName)
                      : initials(collab.email.replace(/@.*$/, ""))}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm text-copy-primary">
                      {collab.displayName ?? collab.email}
                    </span>
                    {collab.displayName && (
                      <span className="truncate text-xs text-muted-foreground">
                        {collab.email}
                      </span>
                    )}
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      aria-label={`Remove ${collab.email}`}
                      disabled={removingId === collab.id}
                      onClick={() => handleRemove(collab.id)}
                    >
                      {removingId === collab.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <UserX className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invite section — owners only */}
        {isOwner && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-copy-muted">
              Invite by email
            </label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="colleague@example.com"
                type="email"
                autoComplete="off"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  if (inviteEmailError) setInviteEmailError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isAdding) handleInvite();
                }}
                disabled={isAdding}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleInvite}
                disabled={isAdding || !inviteEmail.trim()}
                className="shrink-0"
              >
                {isAdding ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Invite"
                )}
              </Button>
            </div>
            {inviteEmailError && (
              <p
                role="alert"
                className="text-xs text-destructive"
              >
                {inviteEmailError}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}