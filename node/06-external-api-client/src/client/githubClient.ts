import { httpRequest } from "./httpClient";
import { authHeaders } from "../auth/auth";

const BASE = "https://api.github.com";

export async function getUser(username: string, token: string) {
  return httpRequest({
    method: "GET",
    url: `${BASE}/users/${username}`,
    headers: authHeaders(token),
  });
}

export async function createRepo(token: string, name: string) {
  return httpRequest({
    method: "POST",
    url: `${BASE}/user/repos`,
    headers: {
      ...authHeaders(token),
      "Idempotency-Key": name,
    },
    data: {
      name,
    },
  });
}
