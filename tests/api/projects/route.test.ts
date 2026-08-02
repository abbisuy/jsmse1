import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../../../app/api/projects/route";
import { auth } from "@clerk/nextjs/server";
import { createProject, getProjectsForUser } from "@/db/projects";

// Mock Clerk auth
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

// Mock db/projects data-access layer
vi.mock("@/db/projects", () => ({
  getProjectsForUser: vi.fn(),
  createProject: vi.fn(),
}));

describe("Projects API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/projects", () => {
    it("should return 401 if user is not authenticated", async () => {
      (auth as any).mockResolvedValue({ userId: null });

      const response = await GET(new Request("http://localhost/api/projects"));
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: "Unauthorized" });
    });

    it("should return a list of projects for the authenticated user", async () => {
      const mockUserId = "user_123";
      const mappedProjects = [
        { id: "p1", name: "Project One", slug: "project-one", owner: true, updatedAt: "2026-08-01T00:00:00.000Z" },
        { id: "p2", name: "Project Two", slug: "project-two", owner: true, updatedAt: "2026-08-01T00:00:00.000Z" },
      ];

      (auth as any).mockResolvedValue({ userId: mockUserId });
      (getProjectsForUser as any).mockResolvedValue(mappedProjects);

      const response = await GET(new Request("http://localhost/api/projects"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mappedProjects);
      expect(getProjectsForUser).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe("POST /api/projects", () => {
    it("should return 401 if user is not authenticated", async () => {
      (auth as any).mockResolvedValue({ userId: null });

      const req = new Request("http://localhost/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: "New Project" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: "Unauthorized" });
    });

    it("should create a project with the provided name", async () => {
      const mockUserId = "user_123";
      const projectName = "My Awesome Project";
      const mockCreatedProject = { id: "p3", name: projectName };

      (auth as any).mockResolvedValue({ userId: mockUserId });
      (createProject as any).mockResolvedValue(mockCreatedProject);

      const req = new Request("http://localhost/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: projectName }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockCreatedProject);
      expect(createProject).toHaveBeenCalledWith(mockUserId, projectName);
    });

it("should use 'Untitled Project' as fallback for empty or missing names", async () => {
      const mockUserId = "user_123";
      (auth as any).mockResolvedValue({ userId: mockUserId });
      (createProject as any).mockImplementation(() =>
        Promise.resolve({ id: "p4", name: "Untitled Project" })
      );

      const testCases = [
        { name: "" },
        { name: "   " },
        {}, // missing name
      ];

      for (const body of testCases) {
        const req = new Request("http://localhost/api/projects", {
          method: "POST",
          body: JSON.stringify(body),
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.name).toBe("Untitled Project");
      }
    });
  });
});
