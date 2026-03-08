import { describe, test, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app";
import { startContainer, resetDb, stopContainer } from "./setup/postgresContainer";
import { processNextJob } from "../src/worker";

beforeAll(async () => {
  await startContainer();
}, 60000);

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await stopContainer();
});

describe("POST /submit-report", () => {
  test("enqueues a job and returns 202", async () => {
    const res = await request(app)
      .post("/submit-report")
      .send({ payload: { reportType: "sales", month: "January" } });

    expect(res.status).toBe(202);
    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe("pending");
    expect(res.body.type).toBe("report");
  });

  test("400 when payload is missing", async () => {
    const res = await request(app).post("/submit-report").send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/payload/);
  });

  test("idempotency: returns same job for same key", async () => {
    const body = {
      payload: { reportType: "sales" },
      idempotencyKey: "unique-key-123",
    };

    const res1 = await request(app).post("/submit-report").send(body);
    const res2 = await request(app).post("/submit-report").send(body);

    expect(res1.status).toBe(202);
    expect(res2.status).toBe(202);
    expect(res1.body.id).toBe(res2.body.id);
  });
});

describe("GET /jobs/:id", () => {
  test("returns job status", async () => {
    const submit = await request(app)
      .post("/submit-report")
      .send({ payload: { reportType: "inventory" } });

    const res = await request(app).get(`/jobs/${submit.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(submit.body.id);
    expect(res.body.status).toBe("pending");
  });

  test("404 for non-existent job", async () => {
    const res = await request(app).get("/jobs/999");

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/);
  });

  test("400 for invalid id", async () => {
    const res = await request(app).get("/jobs/abc");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid/);
  });
});

describe("Worker processing", () => {
  test("processes a job to completion", async () => {
    const submit = await request(app)
      .post("/submit-report")
      .send({ payload: { reportType: "sales" } });

    const jobId = submit.body.id;

    // Process the job via worker
    const processed = await processNextJob();
    expect(processed).toBe(true);

    // Poll and verify completion
    const res = await request(app).get(`/jobs/${jobId}`);
    expect(res.body.status).toBe("complete");
    expect(res.body.result).toBeDefined();
    expect(res.body.attempts).toBe(1);
  });

  test("returns false when no pending jobs", async () => {
    const processed = await processNextJob();
    expect(processed).toBe(false);
  });

  test("enqueue job, poll until complete, assert DB record", async () => {
    // Enqueue
    const submit = await request(app)
      .post("/submit-report")
      .send({ payload: { reportType: "full-cycle" } });

    expect(submit.status).toBe(202);
    const jobId = submit.body.id;

    // Verify pending
    let poll = await request(app).get(`/jobs/${jobId}`);
    expect(poll.body.status).toBe("pending");

    // Process
    await processNextJob();

    // Poll until complete
    poll = await request(app).get(`/jobs/${jobId}`);
    expect(poll.body.status).toBe("complete");
    expect(poll.body.result.url).toMatch(/\.pdf$/);
    expect(poll.body.result.pages).toBeGreaterThan(0);
    expect(poll.body.attempts).toBe(1);
  });
});
