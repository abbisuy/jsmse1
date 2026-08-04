At this point, when the user submits on the "Rename Project" dialog and the "delete Project" dialog, no updates are done in the database.  

The goal of this step is to implement functionality of updating of user entered project details or deleting a project in the back-end prisma database.

### Important House keeping
Before actually implementing this feature (not in Plan mode), update the /context/progress-tracker.md.  Update it again after implementing it.

### Functionality in detail for the "Rename Project" dialog

User types in new name in the Project name field. Save button enabled on valid changes.
When the user clicks the "Save" button:
- validate that the Project name is not blank.  
- call `PATCH /api/projects/[projectId]` to update the Project name in the prisma database.
- When successful, rerender the Project Sidebar with new project name in the project list and close the the dialog
- When not successful in a rare event, keep the dialog open and show the error message in red near the top of the dialog box.
When the user clicks the Cancel button:
- Simply close the dialog

### Functionality in detail for the "Delete Project" dialog

When the user clicks the "Delete" button:
- call `DELETE /api/projects/[projectId]` to upddeleteate the Project in the prisma database.
- When successful, rerender the Project Sidebar with new project name in the project list and close the the dialog
- When not successful in a rare event, keep the dialog open and show the error message in red near the top of the dialog box.
When the user clicks the Cancel button:
- Simply close the dialog

### Design Considerartions

- manage state of the update and delete dialogs as necessary
- modify the existing hooks for dialog interaction as necessary
- Use React best practices for the design of how the error messages are displayed
- do not implement any other functionality, but ask if something must be implemented to make progress withis request.

### Check When Done

- `pnpm run build` passes