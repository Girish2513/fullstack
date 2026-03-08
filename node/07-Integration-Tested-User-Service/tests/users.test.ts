import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";
import request from "supertest";
import app from "../src/app";
import {
  startContainer,
  runMigrations,
  stopContainer,
} from "./setup/postgresContainer";
import { seed } from "./setup/seed";

beforeAll(async () => {
  await startContainer();
  await runMigrations();
}, 60000);

beforeEach(async () => {
  await seed();
});

afterAll(async () => {
  await stopContainer();
});

describe("POST /users", () => {
  test("creates a user", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email: "new@test.com", name: "New User" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("new@test.com");
    expect(res.body.name).toBe("New User");
    expect(res.body.id).toBeDefined();
  });

  test("400 when email missing", async () => {
    const res = await request(app).post("/users").send({ name: "No Email" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/email/);
  });

  test("400 when name missing", async () => {
    const res = await request(app).post("/users").send({ email: "x@test.com" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/name/);
  });

  test("409 on duplicate email", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email: "alice@test.com", name: "Duplicate" });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already exists/);
  });
});

describe("GET /users/:id", () => {
  test("returns a user", async () => {
    const res = await request(app).get("/users/1");

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("alice@test.com");
    expect(res.body.name).toBe("Alice");
  });

  test("404 for non-existent user", async () => {
    const res = await request(app).get("/users/999");

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/);
  });
});
