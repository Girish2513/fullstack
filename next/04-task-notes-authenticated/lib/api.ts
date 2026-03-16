const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ApiTask {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export interface ApiError extends Error {
  status?: number;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(`API Error: ${response.statusText}`) as ApiError;
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

export const api = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string): Promise<AuthResponse> =>
    apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getTasks: (): Promise<ApiTask[]> => apiRequest<ApiTask[]>("/api/tasks"),

  getTask: (id: number): Promise<ApiTask> =>
    apiRequest<ApiTask>(`/api/tasks/${id}`),

  createTask: (
    task: Omit<ApiTask, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiTask> =>
    apiRequest<ApiTask>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),

  updateTask: (id: number, updates: Partial<ApiTask>): Promise<ApiTask> =>
    apiRequest<ApiTask>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  deleteTask: (id: number): Promise<void> =>
    apiRequest<void>(`/api/tasks/${id}`, { method: "DELETE" }),
};
