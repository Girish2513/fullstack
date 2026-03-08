import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Task Notes API",
    version: "1.0.0",
    description: "REST API for managing tasks with pagination, filtering, and sorting",
  },
  paths: {
    "/api/tasks": {
      get: {
        summary: "Get all tasks",
        tags: ["Tasks"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Items per page" },
          { name: "completed", in: "query", schema: { type: "string", enum: ["true", "false"] }, description: "Filter by completion status" },
          { name: "sortBy", in: "query", schema: { type: "string", enum: ["title", "completed"] }, description: "Sort field" },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "asc" }, description: "Sort order" },
        ],
        responses: {
          "200": {
            description: "Paginated list of tasks",
            content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedTasks" } } },
          },
        },
      },
      post: {
        summary: "Create a task",
        tags: ["Tasks"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTask" } } },
        },
        responses: {
          "201": {
            description: "Task created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } },
          },
          "400": {
            description: "Validation error",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ProblemDetail" } } },
          },
        },
      },
    },
    "/api/tasks/{id}": {
      get: {
        summary: "Get task by ID",
        tags: ["Tasks"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": {
            description: "Task found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } },
          },
          "404": { description: "Task not found" },
        },
      },
      patch: {
        summary: "Update a task",
        tags: ["Tasks"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateTask" } } },
        },
        responses: {
          "200": {
            description: "Task updated",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } },
          },
          "400": {
            description: "Validation error",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ProblemDetail" } } },
          },
          "404": { description: "Task not found" },
        },
      },
      delete: {
        summary: "Delete a task",
        tags: ["Tasks"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "204": { description: "Task deleted" },
        },
      },
    },
    "/metrics": {
      get: {
        summary: "Get API metrics",
        tags: ["Metrics"],
        responses: {
          "200": {
            description: "API metrics",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Metrics" } } },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Task: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: "string" },
          completed: { type: "boolean" },
        },
      },
      CreateTask: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string" },
          completed: { type: "boolean" },
        },
      },
      UpdateTask: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string" },
          completed: { type: "boolean" },
        },
      },
      PaginatedTasks: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Task" } },
          page: { type: "integer" },
          limit: { type: "integer" },
          total: { type: "integer" },
          totalPages: { type: "integer" },
        },
      },
      ProblemDetail: {
        type: "object",
        description: "RFC 7807 Problem Detail",
        properties: {
          type: { type: "string" },
          title: { type: "string" },
          status: { type: "integer" },
          detail: { type: "string" },
          instance: { type: "string" },
        },
      },
      Metrics: {
        type: "object",
        properties: {
          requestCount: { type: "integer" },
          avgLatencyMs: { type: "integer" },
          statusCodes: { type: "object", additionalProperties: { type: "integer" } },
          routes: { type: "object" },
        },
      },
    },
  },
};

export const swaggerDocs = swaggerUi.setup(swaggerDocument);
export const swaggerServe = swaggerUi.serve;
