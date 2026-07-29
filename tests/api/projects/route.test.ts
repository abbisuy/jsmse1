import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../../../app/api/projects/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Mock Clerk auth
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
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
      const mockProjects = [
        { id: "p1", name: "Project One", ownerId: mockUserId },
        { id: "p2", name: "Project Two", ownerId: mockUserId },
      ];

      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.project.findMany as any).mockResolvedValue(mockProjects);

      const response = await GET(new Request("http://localhost/api/projects"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockProjects);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: { ownerId: mockUserId },
        orderBy: { createdAt: "desc" },
      });
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
      const mockCreatedProject = { id: "p3", name: projectName, ownerId: mockUserId };

      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.project.create as any).mockResolvedValue(mockCreatedProject);

      const req = new Request("http://localhost/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: projectName }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockCreatedProject);
      expect(prisma.project.create).toHaveBeenCalledWith({
        data: { ownerId: mockUserId, name: projectName },
      });
    });

    it("should use 'Untitled Project' as fallback for empty or missing names", async () => {
      const mockUserId = "user_123";
      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.project.create as any).mockImplementation(({ data }) =>
        Promise.resolve({ id: "p4", ...data })
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
