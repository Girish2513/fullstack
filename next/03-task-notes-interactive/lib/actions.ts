"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "./api";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const priority = formData.get("priority") as "low" | "medium" | "high";
  const description = (formData.get("description") as string) || "";

  if (!title || title.trim().length < 3) {
    throw new Error("Title must be at least 3 characters");
  }

  await api.createTask({ title: title.trim(), description: description.trim(), priority, completed: false });

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

  await api.updateTask(id, { title: title.trim(), description: description.trim(), priority, completed });

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
  redirect(`/tasks/${id}`);
}

export async function toggleTaskCompletion(id: number, completed: boolean) {
  await api.updateTask(id, { completed });
  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
}

export async function deleteTask(id: number) {
  await api.deleteTask(id);
  revalidatePath("/tasks");
  redirect("/tasks");
}
