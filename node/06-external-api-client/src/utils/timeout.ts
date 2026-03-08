import { TimeoutError } from "./errors";

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new TimeoutError("Request timeout")), ms),
  );

  return Promise.race([promise, timeout]);
}
