export function log(message: string, meta: any = {}) {
  console.log(
    JSON.stringify({
      message,
      ...meta,
      time: new Date().toISOString(),
    }),
  );
}
