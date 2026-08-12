## Current Goal
Wrap the Node label text within an imaginary biggest rectangle that can fit within the shape of the node.

## Current state
The node label text flows in one line and cuts off when the shape ends.

## Implementation

1. Wrap and fit label text
   - Calculate the biggest rectangular shape that can fit within the shape.  This shape will not actually show.
   - Wrap the text inside that rectangular shape, while leaving a paading of 3 px around the text so that the text is not going onto the edges.
   - If there is text that overflows that shape, show "..." at the end of the text

2. Resizing of the node
- when the node is resized, the size of the area for the label display will change and the label will be displayed to for the new area.

## Design Considerations
- check if text truncation is done by Reactflow or should be done in our code.

## Scope 
- keep this focused on sizing and wrapping of the label text.

## OUT OF SCOPE
Manual Verification steps:
- `npm run build` passes without type errors.
- Long Labels display correctly on node display
- Short Labels display correctly on node display
- Long Labels display correctly on node resize
- Short Labels display correctly on node resize

### Important House keeping
Before actually implementing this feature (not in Plan mode), update the /context/progress-tracker.md.  Update it again after implementing it.