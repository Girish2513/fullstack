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
  metadata: Record<string, unknown>;
  created_at: Date;
}

export interface MigrationRecord {
  id: number;
  filename: string;
  applied_at: Date;
}

export interface DbMetrics {
  queryCount: number;
  totalTime: number;
  avgTime: number;
  slowQueries: number;
  errors: number;
}
