export interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  created_at: Date;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id: number | null;
  project_id: number | null;
  category_id: number | null;
  metadata: Record<string, unknown>;
  created_at: Date;
}

export interface Category {
  id: number;
  name: string;
  color: string | null;
}

export interface MigrationRecord {
  id: number;
  filename: string;
  applied_at: Date;
}
