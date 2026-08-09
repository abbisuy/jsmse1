The goal of the current feature is to implement Setting up the realtime collaboration infrastructure using Liveblocks.

### Important House keeping
Before actually implementing this feature (not in Plan mode), update the /context/progress-tracker.md.  Update it again after implementing it.

## Configuration

Configure the `liveblocks.config.ts` at the project root.

Define:

### Presence

- cursor position
- `isThinking` boolean

### UserMeta

- user ID
- display name
- avatar URL
- cursor color

## Liveblocks Client

Create a cached Liveblocks node client in `lib`.

Add a helper that deterministically maps a user ID to a consistent color from a fixed palette.

## Auth Route

Create `POST /api/liveblocks-auth`.

Use the project ID as the Liveblocks room ID.

This route must:

1. require Clerk authentication
2. verify project access using the existing access helper
3. ensure the Liveblocks room exists (create only if needed)
4. return a session token with:
   - user name
   - avatar
   - generated cursor color

Return `403` for unauthorized project access.

## Dependencies

All required Liveblocks packages are already installed.

## Check When Done

- `liveblocks.config.ts` defines Presence and UserMeta
- Liveblocks client is cached
- auth route verifies project access
- user metadata is attached to sessions
- `pnpm run build` passes