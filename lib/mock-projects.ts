import type { Project } from "@/types/project";

export const mockProjects: Project[] = [
  {
    id: "p_01",
    name: "Payments Platform",
    slug: "payments-platform",
    owner: true,
    updatedAt: "2026-07-06T14:32:00.000Z",
  },
  {
    id: "p_02",
    name: "Notifications Service",
    slug: "notifications-service",
    owner: true,
    updatedAt: "2026-07-05T09:12:00.000Z",
  },
  {
    id: "p_03",
    name: "Search Infrastructure",
    slug: "search-infrastructure",
    owner: false,
    updatedAt: "2026-07-04T18:05:00.000Z",
  },
  {
    id: "p_04",
    name: "Auth Gateway",
    slug: "auth-gateway",
    owner: false,
    updatedAt: "2026-07-03T11:48:00.000Z",
  },
];
