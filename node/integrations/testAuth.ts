import dotenv from "dotenv";
import { withAuth } from "./withAuth";

dotenv.config();

async function main() {
  const client = withAuth(process.env.API_KEY!);

  const data = await client("https://jsonplaceholder.typicode.com/posts/1");

  console.log(data);
}

main();
