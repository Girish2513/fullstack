import { http, HttpResponse } from "msw";
import { server } from "./mswServer";
import { getUser, createRepo } from "../src/client/githubClient";
import { ApiError } from "../src/utils/errors";
import { TimeoutError } from "../src/utils/errors";

const GITHUB_API = "https://api.github.com";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("getUser", () => {
  test("success — returns user data", async () => {
    server.use(
      http.get(`${GITHUB_API}/users/octocat`, () => {
        return HttpResponse.json({
          login: "octocat",
          id: 1,
          name: "The Octocat",
        });
      }),
    );

    const user = await getUser("octocat", "token");

    expect(user.login).toBe("octocat");
    expect(user.id).toBe(1);
  });

  test("401 — throws ApiError without retrying", async () => {
    let callCount = 0;

    server.use(
      http.get(`${GITHUB_API}/users/octocat`, () => {
        callCount++;
        return HttpResponse.json(
          { message: "Bad credentials" },
          { status: 401 },
        );
      }),
    );

    await expect(getUser("octocat", "bad-token")).rejects.toThrow(ApiError);
    await expect(getUser("octocat", "bad-token")).rejects.toThrow(
      "Bad credentials",
    );

    // 401 is a client error — retry should bail immediately (1 call per request)
    expect(callCount).toBe(2);
  });

  test("500 — retries and eventually throws ApiError", async () => {
    let callCount = 0;

    server.use(
      http.get(`${GITHUB_API}/users/octocat`, () => {
        callCount++;
        return HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }),
    );

    await expect(getUser("octocat", "token")).rejects.toThrow(ApiError);

    // Should have retried 3 times (default retry count)
    expect(callCount).toBe(3);
  });

  test("500 then success — retries and succeeds", async () => {
    let callCount = 0;

    server.use(
      http.get(`${GITHUB_API}/users/octocat`, () => {
        callCount++;
        if (callCount === 1) {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }
        return HttpResponse.json({ login: "octocat" });
      }),
    );

    const user = await getUser("octocat", "token");

    expect(user.login).toBe("octocat");
    expect(callCount).toBe(2);
  });

  test("timeout — throws TimeoutError", async () => {
    server.use(
      http.get(`${GITHUB_API}/users/octocat`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return HttpResponse.json({ login: "octocat" });
      }),
    );

    await expect(getUser("octocat", "token")).rejects.toThrow(TimeoutError);
  }, 30000);

  test("invalid JSON — returns unparsed data (no login field)", async () => {
    server.use(
      http.get(`${GITHUB_API}/users/octocat`, () => {
        return new HttpResponse("not json{{{", {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      }),
    );

    const result = await getUser("octocat", "token");

    // Axios returns the raw string when content-type is not JSON
    expect(result).toBe("not json{{{");
    expect(result.login).toBeUndefined();
  });
});

describe("createRepo", () => {
  test("success — sends idempotency key", async () => {
    let capturedHeaders: Record<string, string> = {};

    server.use(
      http.post(`${GITHUB_API}/user/repos`, async ({ request }) => {
        capturedHeaders = Object.fromEntries(request.headers.entries());
        const body = (await request.json()) as any;
        return HttpResponse.json({
          id: 123,
          name: body.name,
          full_name: `user/${body.name}`,
        });
      }),
    );

    const repo = await createRepo("token", "my-repo");

    expect(repo.name).toBe("my-repo");
    expect(capturedHeaders["idempotency-key"]).toBe("my-repo");
    expect(capturedHeaders["authorization"]).toBe("Bearer token");
  });
});
