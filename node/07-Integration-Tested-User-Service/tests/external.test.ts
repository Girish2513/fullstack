import { describe, test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import request from "supertest";
import app from "../src/app";
import { mswServer } from "./setup/mswServer";

const GITHUB_API = "https://api.github.com";

beforeAll(() => {
  mswServer.listen({ onUnhandledRequest: "bypass" });
});

afterEach(() => {
  mswServer.resetHandlers();
});

afterAll(() => {
  mswServer.close();
});

describe("GET /github/:username", () => {
  test("200 — returns github profile", async () => {
    mswServer.use(
      http.get(`${GITHUB_API}/users/octocat`, () => {
        return HttpResponse.json({
          login: "octocat",
          id: 1,
          name: "The Octocat",
        });
      }),
    );

    const res = await request(app).get("/github/octocat");

    expect(res.status).toBe(200);
    expect(res.body.login).toBe("octocat");
    expect(res.body.name).toBe("The Octocat");
  });

  test("401 — unauthorized", async () => {
    mswServer.use(
      http.get(`${GITHUB_API}/users/octocat`, () => {
        return HttpResponse.json(
          { message: "Bad credentials" },
          { status: 401 },
        );
      }),
    );

    const res = await request(app).get("/github/octocat");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Bad credentials");
  });

  test("500 — server error from github", async () => {
    mswServer.use(
      http.get(`${GITHUB_API}/users/octocat`, () => {
        return HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }),
    );

    const res = await request(app).get("/github/octocat");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Internal Server Error");
  });

  test("timeout — returns 500", async () => {
    mswServer.use(
      http.get(`${GITHUB_API}/users/octocat`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return HttpResponse.json({ login: "octocat" });
      }),
    );

    const res = await request(app).get("/github/octocat");

    expect(res.status).toBe(500);
  }, 15000);
});
