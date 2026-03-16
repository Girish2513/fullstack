"use server";

import { redirect } from "next/navigation";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;

  if (!title || title.trim().length === 0) {
    return { error: "Title is required" };
  }

  console.log("Creating task:", { title, description, priority });

  redirect("/tasks");
}
