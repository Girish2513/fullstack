ALTER TABLE tasks ADD COLUMN metadata JSONB DEFAULT '{}';
CREATE INDEX idx_tasks_metadata ON tasks USING gin(metadata);
