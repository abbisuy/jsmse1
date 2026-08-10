The current goal is Replacing the canvas placeholder with a Liveblocks-backed React Flow canvas.

### Important House keeping
Before actually implementing this feature (not in Plan mode), update the /context/progress-tracker.md.  Update it again after implementing it.

## Implementation

1. Keep the workspace page server-side.

2. Create a client-side editor/canvas wrapper that sets up the Liveblocks room.

   It should include:
   - Make use of `/api/liveblocks-auth`
   - `RoomProvider` using the current room ID
   - initial presence with `cursor: null`
   - an error fallback for Liveblocks connection issues

3. Wire React Flow to Liveblocks state.
 

4. Add shared canvas types in `types/canvas.ts`.

   Node data should support:
   - label
   - color
   - shape
   - text color

   Also define the custom node and edge types:
   - `canvasNode`
   - `canvasEdge`

5. Render the basic canvas using the most common patterns according to the liveblocks skills.  Include a dot-pattern background.

## Scope Limits

- don’t add controls yet
- don’t add custom node or edge rendering yet
- don’t add persistence logic
- don’t add AI behavior
- keep this focused on the collaborative canvas foundation

## Check When Done

- Client canvas wrapper sets up the Liveblocks room.
- React Flow uses Liveblocks-synced nodes and edges.
- Shared canvas types exist in `types/canvas.ts`.
- `npm run build` passes.
