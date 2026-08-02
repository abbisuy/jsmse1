At this point, after a "Create Project" dialog is displayed and the user enters a project name and clicks the "Create" button, the entered data does not get stored in the database.  

The goal of this step is to implement functionality of storing of user entered project in the back-end prisma database.

### Functionality in detail for the "Create Project" dialog

As the user types in the project name in the 'Project name' field: 
- show the sluggified form of the name in the Slug field.
When the user clicks the "Create" button:
- validate that the Project name or the slug field are not blank.  
- call `POST /api/projects` and receive the project-id of the created project 
- navigate to the project workspace at the "/editor/project-id" URL.  Just implement the navigation, DO NOT implement code for workspace itself.
When the user clicks the Cancel button:
- Simply close the dialog


### Design Considerartions

- manage state of the create dialog as necessary
- modify the existing hooks for dialog interaction as necessary
- do not implement any other functionality, but ask if something must be implemented to make progress withis request.

### Check When Done

- create button navigates to workspace 
- `pnpm run build` passes