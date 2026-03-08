import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "./database.ts";

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

async function test() {
  const password = "mypassword123";

  const hash = await hashPassword(password);

  console.log("Hashed password:", hash);

  const match1 = await comparePassword("mypassword123", hash);
  const match2 = await comparePassword("wrongpassword", hash);

  console.log("Correct password:", match1);
  console.log("Wrong password:", match2);
}

test();

async function createTestUser() {
  const password = "123456";

  const hash = await hashPassword(password);

  const userId = createUser("test1@email.com", hash, "user1");

  console.log("User created:", userId);

  const user = getUserByEmail("test1@email.com");

  console.log("User from DB:", user);

  if (user) {
    const valid = await comparePassword("123456", user.password_hash);

    console.log("Login success:", valid);
  } else {
    console.log("Login Failed");
  }
}

// createTestUser();
