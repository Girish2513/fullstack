import axios, { AxiosError } from "axios";
import { retry } from "../utils/retry";
import { withTimeout } from "../utils/timeout";
import { ApiError } from "../utils/errors";
import { log } from "../observability/logger";
import { measureLatency } from "../observability/metrics";
import { v4 as uuid } from "uuid";

async function executeRequest(config: any) {
  try {
    return await withTimeout(axios(config), 5000);
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      throw new ApiError(
        err.response.data?.message || err.message,
        err.response.status,
      );
    }
    throw err;
  }
}

export async function httpRequest(config: any) {
  const requestId = uuid();
  const start = Date.now();

  log("external_request_start", { requestId, url: config.url });

  try {
    const response = await retry(() => executeRequest(config));

    measureLatency(start);
    log("external_request_success", { requestId });

    return response.data;
  } catch (err: any) {
    measureLatency(start);
    log("external_request_failed", {
      requestId,
      error: err.message,
      ...(err instanceof ApiError ? { status: err.status } : {}),
    });

    throw err;
  }
}
