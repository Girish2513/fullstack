import * as repo from "../repo/users.repo";

export async function createUser(email: string, name: string) {
  return repo.createUser(email, name);
}

export async function getUser(id: number) {
  return repo.getUser(id);
}
