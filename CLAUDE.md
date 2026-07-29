# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands
- **Dev Server**: `pnpm dev` or `npm run dev`
- **Production Build**: `pnpm build` or `npm run build`
- **Linting**: `pnpm lint` or `npm run lint`
- **Testing**: `pnpm dlx vitest` (to run all tests) or `pnpm dlx vitest <path_to_file>` (for specific tests)
- **Database Management**:
  - Generate Prisma Client: `pnpm dlx prisma generate`
  - Push schema changes: `pnpm dlx prisma db push`
  - Create/Apply migration: `pnpm dlx prisma migrate dev`
  - Open Studio: `pnpm dlx prisma studio`

## Architecture and Structure
- **Framework**: Next.js 16 (App Router) using TypeScript.
- **Database**: PostgreSQL with Prisma ORM (`prisma/schema.prisma`).
- **Authentication**: Managed via Clerk (`@clerk/nextjs`).
- **Styling**: Tailwind CSS v4 using `shadcn/ui` and `@base-ui/react`.
- **Testing Framework**: Vitest with JSDOM for frontend components.

### Directory Layout
- `app/`: Contains the Next.js App Router structure, including pages and API routes (`app/api/`).
- `components/`: Reusable UI components.
- `lib/`: Shared utility functions and core service initializations (e.g., Prisma client).
- `prisma/`: Database schema definitions and migration history.
- `hooks/`: Custom React hooks for shared logic.
- `types/`: Global TypeScript type declarations.
- `context/feature-specs/`: Documentation and specifications for feature implementation.
