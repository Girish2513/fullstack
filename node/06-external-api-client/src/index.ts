import { getUser } from "./client/githubClient";

async function main() {
  const user = await getUser("octocat", "YOUR_TOKEN");

  console.log(user);
}

main();
