# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Goal

None currently.

## In Progress

- None currently.

## Completed

- 15-node-color-toolbar.md — Added `NODE_COLORS` 8-pair palette + `NodeColorPair` to `types/canvas.ts`; new `NodeColorToolbar` floating swatch row with active `ring-2 ring-ring`, tight `6px` hover glow using the swatch's own text color, and `stopPropagation` on pointer/mouse/touch/double-click so it doesn't drag nodes or pan the canvas; wired into `CanvasNodeRenderer` above selected non-editing nodes via a `replace` change into the existing Liveblocks storage; `ShapeBody` already reflects `data.color` / `data.textColor` so no further changes were needed. Build passes.
- 14A-node-label-autosize.md — `ShapeBody` now computes the biggest axis-aligned rectangle inscribed in each shape (rect inset; pill straight side band; circle inscribed square; diamond centered half; hexagon flat middle band; cylinder rect body minus ellipse caps), pads it 3px, wraps label text inside it (CSS `-webkit-line-clamp` set to `floor(innerH / 18px)`), and truncates overflow with "…" via `overflow: hidden` + `text-overflow: ellipsis`. Resize reflows automatically because `width`/`height` are props. Build passes.
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
- 12-shape-panel.md
- 13-node-shape.md — replaced placeholder node renderer with per-shape CSS + SVG shape bodies (rect/pill/circle via CSS, diamond/hexagon/cylinder via SVG), selected-state brighter stroke, and ghost drag preview attached to cursor from the shape panel.
- 14-node-editing.md

## Open Questions

- None currently.

## Architecture Decisions

- Dark-only theme: no light mode. shadcn/ui standard tokens are aliased to the `ui-context.md` dark palette so generated `components/ui/*` render dark without modification.
- Color tokens are defined as CSS custom properties in `globals.css` and mapped to Tailwind utilities via `@theme inline` (no raw `zinc-*` / hardcoded hex in components).
- Fonts: Geist Sans + Geist Mono (CSS variables on `<html>`), mapped to Tailwind `font-sans` / `font-mono`.

## Session Notes

(Truncated for brevity)
