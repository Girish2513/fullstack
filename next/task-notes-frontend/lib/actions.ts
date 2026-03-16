"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sql, { initDb } from "./db";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const priority = formData.get("priority") as "low" | "medium" | "high";
  const description = (formData.get("description") as string) || "";

  if (!title || title.trim().length < 3) {
    throw new Error("Title must be at least 3 characters");
  }

  await initDb();
  await sql`
    INSERT INTO tasks (title, description, completed, priority)
    VALUES (${title.trim()}, ${description.trim()}, false, ${priority})
  `;

  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function updateTask(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const priority = formData.get("priority") as "low" | "medium" | "high";
  const description = (formData.get("description") as string) || "";
  const completed = formData.get("completed") === "on";

  if (!title || title.trim().length < 3) {
    throw new Error("Title must be at least 3 characters");
  }

  await initDb();
  await sql`
    UPDATE tasks SET title = ${title.trim()}, description = ${description.trim()},
    completed = ${completed}, priority = ${priority}, updated_at = NOW()
    WHERE id = ${id}
  `;

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
  redirect(`/tasks/${id}`);
}

export async function toggleTaskCompletion(id: number, completed: boolean) {
  await initDb();
  await sql`UPDATE tasks SET completed = ${completed}, updated_at = NOW() WHERE id = ${id}`;
  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
}

export async function deleteTask(id: number) {
  await initDb();
  await sql`DELETE FROM tasks WHERE id = ${id}`;
  revalidatePath("/tasks");
  redirect("/tasks");
}
