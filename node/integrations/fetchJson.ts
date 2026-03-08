export async function fetchJson(
  url: string,
  options: RequestInit = {},
  retries = 3,
) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);

    throw {
      type: "NETWORK_ERROR",
      message: "Failed to reach server",
      url,
    };
  }

  clearTimeout(timeout);

  console.log("HTTP request:", {
    url,
    status: response.status,
  });

  if (!response.ok) {
    if (shouldRetry(response.status) && retries > 0) {
      const delay = getBackoffDelay(retries, response);

      console.log("Retrying request:", {
        url,
        retriesLeft: retries,
        delay,
      });

      await sleep(delay);

      return fetchJson(url, retries - 1);
    }

    throw {
      type: "HTTP_ERROR",
      status: response.status,
      url,
    };
  }

  try {
    return await response.json();
  } catch {
    throw {
      type: "PARSE_ERROR",
      message: "Invalid JSON response",
      url,
    };
  }
}

function shouldRetry(status: number) {
  return status === 502 || status === 503 || status === 504 || status === 429;
}

function getBackoffDelay(retries: number, response: Response) {
  const retryAfter = response.headers.get("retry-after");

  if (retryAfter) {
    return parseInt(retryAfter) * 1000;
  }

  const base = Math.pow(2, 3 - retries) * 100;

  const jitter = Math.random() * 100;

  return base + jitter;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
