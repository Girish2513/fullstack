import bcrypt from "bcrypt";
import { createUser } from "./database.ts";

async function createAdmin() {
  const password = "admin123";

  const hash = await bcrypt.hash(password, 10);

  const id = createUser("admin@email.com", hash, "admin");

  console.log("Admin user created with ID:", id);
}

createAdmin();
