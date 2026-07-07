# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation: Editor Chrome
- Auth & Projects (Clerk, Prisma, route protection)

## Current Goal

- Implement Clerk authentication following 03-auth.md specification.

## Completed

- Next.js boilerplate cleanup (globals.css stripped, public SVGs removed, minimal page).
- 01A-design-system: shadcn/ui setup + dark theme tokens + UI primitive components.
- 02-editor: editor navbar + floating project sidebar shell + dialog pattern readiness.

## In Progress

- Implementing Clerk authentication (Provider, sign-in/sign-up pages, route protection).

## Next Up

- Collaborative canvas (Liveblocks + React Flow).
- Prisma integration for projects.

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
