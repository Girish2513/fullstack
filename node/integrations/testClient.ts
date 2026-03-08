import { fetchJson } from "./fetchJson";

// async function main() {
//   try {
//     const data = await fetchJson(
//       // "https://jsonplaceholder.typicode.com/posts/1",
//       // "https://jsonplaceholder.typicode.com/invalid",
//       "https://bad-domain-test-123.com",
//     );

//     console.log("Response:", data);
//   } catch (err) {
//     console.error("Error:", err);
//   }
// }

// main();

async function main() {
  try {
    const data = await fetchJson("https://httpbin.org/delay/10");
    console.log("Result:", data);
  } catch (err) {
    console.error("Final error:", err);
  }
}

main();

//https://jsonplaceholder.typicode.com/posts/1 success
//https://httpbin.org/status/503 retry
//https://httpbin.org/status/429 rate limit
//https://httpbin.org/delay/10 delay
