# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Goal

Implement 12-something... (wait I don't know what is next yet)
Actually, let me see "Next Up" in the tracker. It says "Collaborative canvas ... Prisma integration".
So I will update it to: "Prisma integration for projects (replace mock-projects with real data)."

## In Progress

(Empty - all previous tasks are done)


## Completed

- Next.js boilerplate cleanup (globals.css stripped, public SVGs removed, minimal page).
- 01A-design-system: shadcn/api setup + dark theme tokens + UI primitive components.
- 02-editor: editor navbar + floating project sidebar shell + dialog pattern readiness.
- 03-auth: Clerk authentication (Provider, sign-in/sign-up pages, route protection)
- 04-editor-dialogs: editor home screen + Create/Rename/Delete project dialogs + sidebar actions (mock data).
- 04B-fix-styles: enlarged left-side typography and swapped bullet dots for Lucide `Check` icons in `bg-brand-dim` circles on `/sign-in` and `/sign-up`.
- 05-prisma.md: Prisma data models, Prisma client singleton, and first migration.
- 07C-update-delete-project-in-DB - Wire Rename/Delete project dialog submit handlers to PATCH/DELETE /api/projects/[projectId], refresh sidebar via router.refresh() on success, and surface server errors in red near the top of each dialog on failure.
- 08-editor-workspace-shell.md
- 09-share-dialog.md — Share dialog with invite/collaborator list/link copy; Clerk enrichment; owner enforcement server-side
- 10-liveblocks-setup.md — Liveblocks realtime foundation: `liveblocks.config.ts` Presence/UserMeta types, cached `Liveblocks` server client + `getUserColor` palette helper in `lib/liveblocks.ts`, Clerk-gated `POST /api/liveblocks-auth` that uses `checkProjectAccess` for 403, calls `getOrCreateRoom(projectId)` with `defaultAccesses: ["room:write"]`, and issues ID tokens via `identifyUser` with name/avatar/color userInfo.
- 11-base-canvas.md — Implementation of collaborative canvas using React Flow and Liveblocks, featuring synchronized nodes/edges, shared cursors, and robust error/loading boundaries.

## Next Up

- Prisma integration for projects (replace mock-projects with real data).
- Collaborative canvas is now complete!

## Open Questions

- None currently.

## Architecture Decisions

- Dark-only theme: no light mode. shadcn/ui standard tokens are aliased to the `ui-context.md` dark palette so generated `components/ui/*` render dark without modification.
- Color tokens are defined as CSS custom properties in `globals.css` and mapped to Tailwind utilities via `@theme inline` (no raw `zinc-*` / hardcoded hex in components).
- Fonts: Geist Sans + Geist Mono (CSS variables on `<html>`), mapped to Tailwind `font-sans` / `font-mono`.

## Session Notes

(Truncated for brevity)
