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

describe("POST /users/:userId/notes", () => {
  test("creates a note", async () => {
    const res = await request(app)
      .post("/users/1/notes")
      .send({ content: "new note" });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe("new note");
    expect(res.body.user_id).toBe(1);
  });

  test("400 when content missing", async () => {
    const res = await request(app).post("/users/1/notes").send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/content/);
  });

  test("404 for non-existent user", async () => {
    const res = await request(app)
      .post("/users/999/notes")
      .send({ content: "orphan" });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/);
  });
});

describe("GET /users/:userId/notes", () => {
  test("returns notes for a user", async () => {
    const res = await request(app).get("/users/1/notes");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].content).toBe("Alice note 1");
  });

  test("returns empty array for user with no notes", async () => {
    // Create a user with no notes
    await request(app)
      .post("/users")
      .send({ email: "empty@test.com", name: "Empty" });

    const res = await request(app).get("/users/3/notes");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe("GET /notes/:id", () => {
  test("returns a note", async () => {
    const res = await request(app).get("/notes/1");

    expect(res.status).toBe(200);
    expect(res.body.content).toBe("Alice note 1");
  });

  test("404 for non-existent note", async () => {
    const res = await request(app).get("/notes/999");

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/);
  });
});
