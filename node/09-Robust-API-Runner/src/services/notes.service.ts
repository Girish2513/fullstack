import * as repo from "../repo/notes.repo";

export async function createNote(userId: number, content: string) {
  return repo.createNote(userId, content);
}

export async function getNotesByUser(userId: number) {
  return repo.getNotesByUser(userId);
}

export async function getNote(id: number) {
  return repo.getNote(id);
}
