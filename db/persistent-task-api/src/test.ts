import { UserRepository } from "./repositories/UserRepository";

async function run() {
  const user = await UserRepository.createUser("test@example.com");

  console.log(user);
}

run();
