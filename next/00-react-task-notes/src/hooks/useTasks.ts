import { useState, useEffect, useCallback } from "react";
import type { Task, CreateTaskInput } from "../types/task";

const API = "http://localhost:3001/api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function addTask(input: CreateTaskInput) {
    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create task");
    }
    const task = await res.json();
    setTasks((prev) => [task, ...prev]);
    return task;
  }

  async function toggleTask(id: number) {
    const res = await fetch(`${API}/tasks/${id}/complete`, { method: "PATCH" });
    if (!res.ok) throw new Error("Failed to update task");
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function deleteTask(id: number) {
    const res = await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete task");
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return { tasks, loading, error, fetchTasks, addTask, toggleTask, deleteTask };
}
