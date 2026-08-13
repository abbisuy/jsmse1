
## Current Goal
Add a floating control bar for zoom and undo/redo, then wire the same actions to keyboard shortcuts.

### Important House keeping
Before actually implementing this feature (not in Plan mode), update the /context/progress-tracker.md.  Update it again after implementing it.

## Implementation

1. Add a pill-shaped control bar at the bottom-left of the canvas.

   It should sit above the shape panel and include two groups:
   - zoom controls: zoom out, fit view, zoom in
   - history controls: undo, redo

   Separate the two groups with a thin divider.

2. Wire the zoom controls to the React Flow instance.
   - zoom in
   - zoom out
   - fit view
   - use a short animation so the movement feels smooth

3. Wire undo and redo to Liveblocks history.
   - use the existing Liveblocks undo/redo hooks
   - disable undo when there is nothing to undo
   - disable redo when there is nothing to redo
   - keep disabled buttons visually dimmed

5. Support these keyboard shortcuts:
   - `+` or `=` to zoom in
   - `-` to zoom out
   - `Cmd/Ctrl + Z` to undo
   - `Cmd/Ctrl + Shift + Z` to redo
   - `Cmd/Ctrl + Y` to redo


## design considerations
- make sure to ignore the keyboard shortcuts while typing in inputs, textareas, or editable text fields

## Scope Limits

- Focus on the canvas controls
- don’t change the shape panel
- don’t change node or edge rendering
- don’t add extra canvas controls
- don’t change the existing collaborative state setup

## OUT OF SCOPE
Will be checked manually:

- Control bar is added to the canvas.
- Zoom actions use the React Flow instance.
- Undo and redo use Liveblocks history.
- Shortcut handling skips editable fields.
- `npm run build` passes.
