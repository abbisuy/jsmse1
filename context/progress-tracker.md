# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation: Editor Chrome
- Auth & Projects (Clerk, Prisma, route protection)

## Current Goal

- Implement editor home screen and dialogs following 04-editor-dialogs specification.

## Completed

- Next.js boilerplate cleanup (globals.css stripped, public SVGs removed, minimal page).
- 01A-design-system: shadcn/ui setup + dark theme tokens + UI primitive components.
- 02-editor: editor navbar + floating project sidebar shell + dialog pattern readiness.
- 03-auth: Clerk authentication (Provider, sign-in/sign-up pages, route protection)
- 04-editor-dialogs: editor home screen + Create/Rename/Delete project dialogs + sidebar actions (mock data).

## In Progress


## Next Up

- Collaborative canvas (Liveblocks + React Flow).
- Prisma integration for projects (replace mock-projects with real data).

## Open Questions

- None currently.

## Architecture Decisions

- Dark-only theme: no light mode. shadcn/ui standard tokens are aliased to the `ui-context.md` dark palette so generated `components/ui/*` render dark without modification.
- Color tokens are defined as CSS custom properties in `globals.css` and mapped to Tailwind utilities via `@theme inline` (no raw `zinc-*` / hardcoded hex in components).
- Fonts: Geist Sans + Geist Mono via `next/font/google` (CSS variables on `<html>`), mapped to Tailwind `font-sans` / `font-mono`.

## Session Notes

- `components/editor/editor-navbar.tsx`: fixed-height (h-14) top navbar with left/center/right sections. Left section holds the sidebar toggle button using `PanelLeftClose` / `PanelLeftOpen` icons driven by `isSidebarOpen`. Dark `bg-surface` with `border-surface-border` bottom border. Accepts `isSidebarOpen` and `onToggleSidebar` props. Right + center sections left empty for future chapters.
- `components/editor/project-sidebar.tsx`: floating overlay sidebar (`fixed`, `z-40`) that does not push page content. Slides in from the left via `translate-x` transition driven by `isOpen`. Accepts `isOpen` and `onClose` props. Header has "Projects" title + close button. shadcn `Tabs` with "My Projects" / "Shared" tabs, each showing an empty placeholder state. Full-width "New Project" button (with `Plus` icon) pinned to the bottom. A subtle click-away backdrop closes the sidebar.
- Dialog pattern: the existing `components/ui/dialog.tsx` (base-nova, `@base-ui/react/dialog`) already supports title (`DialogTitle`), description (`DialogDescription`), and footer actions (`DialogFooter`) using `globals.css` tokens — ready for future use. No actual dialogs built yet, per spec.
- Next.js 16.2.10 + Tailwind v4 + React 19. shadcn components are generated via CLI and must not be edited after generation (per `ai-workflow-rules.md`).
- Installed UI primitives in `components/ui/`: button, card, dialog, input, tabs, textarea, scroll-area. Verified via `pnpm lint` and `pnpm build` (all import without errors).
- `globals.css` defines the `ui-context.md` semantic palette as CSS custom properties in `:root` (dark-only, no `.dark` split) and aliases shadcn standard tokens (`--background`, `--primary`, `--border`, etc.) to them via `@theme inline`. App semantic Tailwind utilities (`bg-base`, `bg-surface`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-accent-dim`, etc.) are also exposed.
- `dark` class added to `<html>` so generated `dark:` variants in `components/ui/*` resolve against the dark `:root` tokens without modifying the components.
- Fonts: `--font-geist-sans` / `--font-geist-mono` (set on `<html>` by `next/font`) mapped to Tailwind `font-sans` / `font-mono` via `@theme inline`.
- 04-editor-dialogs (mock data only, no API/persistence):
  - `app/editor/page.tsx`: server component, `auth()` guard redirects to `/sign-in` if unauthenticated, renders `<EditorHome />`.
  - `components/editor/editor-home.tsx`: client component owning `isSidebarOpen` state and the `useProjectsDialogs` hook. Composes `EditorNavbar` (top), floating `ProjectSidebar`, and a minimal centered home message (`Create a project or open an existing one` + description + `New Project` button with `Plus`). No card wrappers. Renders all three dialogs and wires open/close/submit.
  - `hooks/use-projects-dialogs.ts`: dedicated hook managing dialog state (`create`/`rename`/`delete`/null), `activeProject`, `isSubmitting` loading state, and `name`/`slug` form state. `setName` derives `slug` live via `slugify`. Submit handlers simulate latency with `setTimeout` (600ms) then close — placeholder for future API wiring.
  - `lib/slugify.ts`: lowercase, strip non-alphanumeric, collapse whitespace/dashes to single hyphens, trim edges.
  - `lib/mock-projects.ts`: 4 `Project` records (2 owned, 2 shared) — source for the sidebar lists until Prisma lands.
  - `types/project.ts`: `Project` interface (`id`, `name`, `slug`, `owner`, `updatedAt`), `ProjectDialogState`.
  - `components/editor/project-item.tsx`: sidebar project row with name, slug, relative timestamp, and hover-reveal `Pencil`/`Trash2` action buttons. Actions render only when `project.owner && onRename && onDelete` — shared/collaborator projects show no actions.
  - `components/editor/project-sidebar.tsx` (updated): now accepts `projects`, `onNewProject`, `onRename`, `onDelete`; splits owned/shared; renders scrollable `ProjectItem` lists under the existing "My Projects"/"Shared" tabs. Mobile (`md:hidden`) backdrop scrim with tap-to-close; desktop relies on the navbar toggle.
  - `components/editor/dialogs/create-project-dialog.tsx`: name input (auto-focused) + live slug preview box; `Enter` submits form; footer Cancel/Create buttons; Create disabled until name+slug non-empty.
  - `components/editor/dialogs/rename-project-dialog.tsx`: prefilled name input (auto-focused), description shows current project name, `Enter` submits; Save disabled when name empty or unchanged.
  - `components/editor/dialogs/delete-project-dialog.tsx`: destructive confirmation only (no input), confirm button uses `variant="destructive"`.
  - Verified with `pnpm lint` and `pnpm build` (no TS/lint errors). `/editor` builds as a dynamic (`ƒ`) server-rendered route.
