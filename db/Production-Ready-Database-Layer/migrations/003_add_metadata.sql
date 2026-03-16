ALTER TABLE tasks ADD COLUMN metadata JSONB DEFAULT '{}';
CREATE INDEX idx_tasks_metadata ON tasks USING gin(metadata);
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
