At this point, the Project Sidebar displays a list of static mockProjects.  

The goal of this step is to implement functionality of fetching the list of stored projects from the back-end prisma database.

### Functionality in detail for the fetching projects.

After the user authenticates successfuly and the Editor home page is to be displayed,   
- call `GET /api/projects` and map the list of projects to owned and shared.  Keep the mockProjects.ts file itself for seed data for future.
- display the Project Sidebar based on the project data 


### Design Considerartions

- We want to populate the initial project data on the server.
- do not implement any other functionality, but ask if something must be implemented to make progress withis request.

### Check When Done

- `pnpm run build` passes