import { Task } from "./types";

export const tasks: Task[] = [
  {
    id: 1,
    title: "Setup database",
    description: "Configure PostgreSQL and create initial schema",
    completed: true,
    priority: "high",
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    title: "Build API",
    description: "Create REST endpoints with Express and repositories",
    completed: true,
    priority: "high",
    createdAt: "2025-01-20",
  },
  {
    id: 3,
    title: "Create frontend",
    description: "Build the Next.js frontend with routing and layouts",
    completed: false,
    priority: "medium",
    createdAt: "2025-02-01",
  },
  {
    id: 4,
    title: "Write tests",
    description: "Add integration and unit tests for all endpoints",
    completed: false,
    priority: "low",
    createdAt: "2025-02-10",
  },
  {
    id: 5,
    title: "Deploy app",
    description: "Deploy to production with proper environment config",
    completed: false,
    priority: "medium",
    createdAt: "2025-02-15",
  },
];
