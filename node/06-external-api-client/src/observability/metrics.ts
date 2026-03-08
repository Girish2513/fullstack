export function measureLatency(start: number) {
  const latency = Date.now() - start;

  console.log("latency_ms:", latency);
}
