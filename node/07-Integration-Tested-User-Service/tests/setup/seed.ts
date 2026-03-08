import { resetDb } from "./postgresContainer";

export async function seed() {
  resetDb();
}
