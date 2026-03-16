export interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id: number | null;
  project_id: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CreateTaskInput {
  title: string;
  user_id: number;
}
