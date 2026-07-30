import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH, DELETE } from "@/app/api/projects/[projectId]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@/prisma/app/generated/prisma/client";

// Mock Clerk auth
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findUnique: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

// Mock Prisma error class if needed for testing
vi.mock("@/prisma/app/generated/prisma/client", () => ({
  Prisma: {
    PrismaClientKnownRequestError: class extends Error {
      code: string;
      constructor(args: { code: string }) {
        super();
        this.code = args.code;
      }
    },
  },
}));

describe("Projects [projectId] API Route", () => {
  const projectId = "project_123";
  const userId = "user_456";
  const otherUserId = "user_789";

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

    it("should return 404 if project is not found", async () => {
      (auth as any).mockResolvedValue({ userId });
      (prisma.project.findUnique as any).mockResolvedValue(null);

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: "New Name" }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Project not found" });
    });

    it("should return 404 if user is not the owner (to prevent enumeration)", async () => {
      (auth as any).mockResolvedValue({ userId: otherUserId });
      (prisma.project.findUnique as any).mockResolvedValue({ id: projectId, ownerId: userId, name: "Old Name" });

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: "New Name" }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Project not found" });
    });

    it("should return 400 if project name is empty", async () => {
      (auth as any).mockResolvedValue({ userId });
      (prisma.project.findUnique as any).mockResolvedValue({ id: projectId, ownerId: userId, name: "Old Name" });

      const req = new Request(`http://locahost/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: "   " }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Project name cannot be empty" });
    });

    it("should update the project successfully", async () => {
      const newName = "Updated Project Name";
      (auth as any).mockResolvedValue({ userId });
      (prisma.project.findUnique as any).mockResolvedValue({ id: projectId, ownerId: userId, name: "Old Name" });
      (prisma.project.update as any).mockResolvedValue({ id: projectId, after: userId, name: newName }); // Correcting the mock return to match structure if needed, but let's keep it simple

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: newName }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe(newName);
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: projectId, ownerId: userId },
        data: { name: newName }
      });
    });
    /*
    it("should return 404 if a Prisma error occurs (P2025)", async () => {
      (auth as any).mockResolvedValue({ userId });
      (prisma.project.findUnique as any).mockResolvedValue({ id: projectId, ownerId: userId, name: "Old Name" });
      
      // Mocking Prisma error
      const error = new Error("Record not found");
      (error as any).name = "PrismaClientKnownRequestError";
      (error as any).code = 'P2025';
      (prisma.project.update as any).mockRejectedValue(error);

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: "New Name" }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Project not found" });
    });
    */

    it("should return 500 if an unexpected error occurs", async () => {
      (auth as any).mockResolvedValue({ userId });
      (prisma.project.findUnique as any).mockRejectedValue(new Error("Unexpected error"));

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
      (prisma.project.deleteMany as any).mockResolvedValue({ count: 0 });

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
      (prisma.project.deleteMany as any).mockResolvedValue({ count: 1 });

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: Promise.resolve({ projectId }) });

      expect(response.status).toBe(204);
    });

    /*
    it("should return 404 if Prisma error P2025 occurs during deletion", async () => {
      (auth as any).mockResolvedValue({ userId });
      
      const error = new Error("Record not found");
      (error as any).name = "PrismaClientKnownRequestError";
      (error as any).code = 'P2025';
      (prisma.project.deleteMany as any).mockRejectedValue(error);

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: Promise.resolve({ projectId }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Project not found" });
    });
    */

    it("should return 500 if an unexpected error occurs during deletion", async () => {
      (auth as any).mockResolvedValue({ userId });
      (prisma.project.deleteMany as any).mockRejectedValue(new Error("Unexpected error"));

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