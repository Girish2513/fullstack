INSERT INTO users (name, email) VALUES ('Girish', 'girish@example.com');
INSERT INTO users (name, email) VALUES ('Revanth', 'revanth@example.com');
INSERT INTO users (name, email) VALUES ('Kiran', 'kiran@example.com');

INSERT INTO projects (name, owner_id, description) VALUES ('Task App', 1, 'main project');
INSERT INTO projects (name, owner_id, description) VALUES ('Blog API', 2, 'blog backend');

INSERT INTO tasks (title, user_id, project_id, completed) VALUES ('Setup database', 1, 1, true);
INSERT INTO tasks (title, user_id, project_id, completed) VALUES ('Build API', 1, 1, true);
INSERT INTO tasks (title, user_id, project_id) VALUES ('Write docs', 1, 1);
INSERT INTO tasks (title, user_id, project_id) VALUES ('Design schema', 2, 2);
INSERT INTO tasks (title, user_id, project_id) VALUES ('Add auth', 2, 2);
INSERT INTO tasks (title, user_id, project_id) VALUES ('Code review', 3, 1);
