import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH, DELETE } from "@/app/api/projects/[projectId]/route";
import { auth } from "@clerk/nextjs/server";
import { updateProject, deleteProject } from "@/db/projects";

// Mock Clerk auth
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

// Mock db/projects data-access layer
vi.mock("@/db/projects", () => ({
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}));

describe("Projects [projectId] API Route", () => {
  const projectId = "project_123";
  const userId = "user_456";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PATCH /api/projects/[projectId]", () => {
    it("should return 401 if user is not authenticated", async () => {
      (auth as any).mockResolvedValue({ userId: null });

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: "New Name" }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: "Unauthorized" });
    });

    it("should return 400 if project name is empty", async () => {
      (auth as any).mockResolvedValue({ userId });

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: "   " }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Project name cannot be empty" });
      expect(updateProject).not.toHaveBeenCalled();
    });

    it("should return 404 if project is not found or user is not owner", async () => {
      (auth as any).mockResolvedValue({ userId });
      const error = { code: "P2025", message: "Record not found" };
      (updateProject as any).mockRejectedValue(error);

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: "New Name" }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Project not found" });
    });

    it("should update the project successfully", async () => {
      const newName = "Updated Project Name";
      (auth as any).mockResolvedValue({ userId });
      (updateProject as any).mockResolvedValue({ id: projectId, name: newName });

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: newName }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe(newName);
      expect(updateProject).toHaveBeenCalledWith(projectId, userId, newName);
    });

    it("should return 500 if an unexpected error occurs", async () => {
      (auth as any).mockResolvedValue({ userId });
      (updateProject as any).mockRejectedValue(new Error("Unexpected error"));

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: "New Name" }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Internal Server Error" });
    });
  });

  describe("DELETE /api/projects/[projectId]", () => {
    it("should return 401 if user is not authenticated", async () => {
      (auth as any).mockResolvedValue({ userId: null });

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: "Unauthorized" });
    });

    it("should return 404 if no project was deleted (not found or not owner)", async () => {
      (auth as any).mockResolvedValue({ userId });
      (deleteProject as any).mockResolvedValue(false);

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Project not found" });
    });

    it("should return 204 on successful deletion", async () => {
      (auth as any).mockResolvedValue({ userId });
      (deleteProject as any).mockResolvedValue(true);

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: Promise.resolve({ projectId }) });

      expect(response.status).toBe(204);
    });

    it("should return 404 if a P2025 error occurs during deletion", async () => {
      (auth as any).mockResolvedValue({ userId });
      const error = { code: "P2025", message: "Record not found" };
      (deleteProject as any).mockRejectedValue(error);

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Project not found" });
    });

    it("should return 500 if an unexpected error occurs during deletion", async () => {
      (auth as any).mockResolvedValue({ userId });
      (deleteProject as any).mockRejectedValue(new Error("Unexpected error"));

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Internal Server Error" });
    });
  });
});