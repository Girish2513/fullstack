import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

async function authRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
    ...options,
  });

  if (response.status === 401) {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("user");
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const apiClient = {
  getTasks: () => authRequest<{ id: number; title: string; description: string; completed: boolean; priority: "low" | "medium" | "high"; createdAt: string; updatedAt: string }[]>("/api/tasks"),

  getTask: (id: number) => authRequest<{ id: number; title: string; description: string; completed: boolean; priority: "low" | "medium" | "high"; createdAt: string; updatedAt: string }>(`/api/tasks/${id}`),

  createTask: (task: { title: string; description: string; completed: boolean; priority: "low" | "medium" | "high" }) =>
    authRequest("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),

  updateTask: (id: number, updates: Record<string, unknown>) =>
    authRequest(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  deleteTask: (id: number) =>
    authRequest<void>(`/api/tasks/${id}`, { method: "DELETE" }),
};
