import dotenv from "dotenv";

dotenv.config();
process.env.API_KEY;

import { fetchJson } from "./fetchJson";

export function withAuth(token: string) {
  return async function (url: string) {
    return fetchJson(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
