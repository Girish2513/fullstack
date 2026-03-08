import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";

const app = express();

app.use(express.json());

//drill-2

type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

let tasks: Task[] = [];
let nextId = 1;

// Drill 3 — Zod Schemas
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  completed: z.boolean().optional(),
});

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  completed: z.enum(["true", "false"]).optional(),
  sort: z.enum(["id", "title", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

// Drill 3 — Type Inference

type TaskInput = z.infer<typeof taskSchema>;

// Drill 3 — Reusable validate middleware

function validate(schema: any, source: "body" | "query" = "body") {
  return (req: any, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.errors,
      });
    }

    if (source === "body") {
      req.body = result.data;
    } else {
      req.validatedQuery = result.data;
    }

    next();
  };
}

// Drill 4 — GET /tasks
// Pagination + Filtering + Sorting

app.get("/tasks", validate(querySchema, "query"), (req: any, res: Response) => {
  let result = [...tasks];

  const {
    page = "1",
    limit = "10",
    completed,
    sort,
    order = "asc",
  } = req.validatedQuery || req.query;

  /* Filtering */

  if (completed) {
    result = result.filter((t) => t.completed === (completed === "true"));
  }

  /* Sorting */

  if (sort) {
    result.sort((a: any, b: any) => {
      if (order === "desc") {
        return a[sort] < b[sort] ? 1 : -1;
      }
      return a[sort] > b[sort] ? 1 : -1;
    });
  }

  /* Pagination */

  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);

  const paginated = result.slice(start, end);

  res.json({
    data: paginated,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total: result.length,
    },
  });
});

// Drill 2 — POST /tasks

app.post("/tasks", validate(taskSchema), (req: any, res: Response) => {
  const input: TaskInput = req.body;

  const task: Task = {
    id: nextId++,
    title: input.title,
    completed: input.completed ?? false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);

  res.status(201).json(task);
});

// Drill 2 — GET /tasks/:id

app.get("/tasks/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  res.json(task);
});

// Drill 2 — PUT /tasks/:id

app.put("/tasks/:id", validate(taskSchema), (req: any, res: Response) => {
  const id = Number(req.params.id);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  task.title = req.body.title;
  task.completed = req.body.completed ?? false;

  res.json(task);
});

// Drill 2 — DELETE /tasks/:id

app.delete("/tasks/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  tasks.splice(index, 1);

  res.status(204).send();
});

// Server

app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});

// curl -X POST http://localhost:3002/tasks -H "Content-Type: application/json" -d '{"title":"Learn Node"}'
//curl -X POST http://localhost:3002/tasks -H "Content-Type: application/json" -d '{"title":"Learn Express"}'
// curl http://localhost:3002/tasks
// curl "http://localhost:3002/tasks?page=1&limit=1"
// curl "http://localhost:3002/tasks?completed=false"
// curl "http://localhost:3002/tasks?sort=createdAt&order=desc"
