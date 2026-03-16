export interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

export interface UserPreferences {
  id: number;
  user_id: number;
  settings: Record<string, unknown>;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  task_count: number;
  created_at: Date;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: number | null;
  project_id: number | null;
  metadata: Record<string, unknown>;
  created_at: Date;
}

export interface Comment {
  id: number;
  body: string;
  task_id: number;
  author_id: number;
  parent_id: number | null;
  created_at: Date;
}

export interface Tag {
  id: number;
  name: string;
}
