export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  NODE_ENV: process.env.NODE_ENV,
};
if (!env.API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is required");
}
