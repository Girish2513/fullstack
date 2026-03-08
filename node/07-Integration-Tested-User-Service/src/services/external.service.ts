import axios, { AxiosError } from "axios";

const GITHUB_API = "https://api.github.com";

export class ExternalApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function getGithubUser(username: string) {
  try {
    const response = await axios.get(`${GITHUB_API}/users/${username}`, {
      timeout: 5000,
    });
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      throw new ExternalApiError(
        err.response.data?.message || err.message,
        err.response.status,
      );
    }
    throw err;
  }
}
