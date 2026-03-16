INSERT INTO users (name, email) VALUES ('Girish', 'girish@example.com');
INSERT INTO users (name, email) VALUES ('Revanth', 'revanth@example.com');
INSERT INTO users (name, email) VALUES ('Kiran', 'kiran@example.com');
INSERT INTO users (name, email) VALUES ('Priya', 'priya@example.com');
INSERT INTO users (name, email) VALUES ('Arun', 'arun@example.com');

INSERT INTO tasks (title, user_id, completed) VALUES ('Setup database', 1, true);
INSERT INTO tasks (title, user_id, completed) VALUES ('Build API', 1, true);
INSERT INTO tasks (title, user_id) VALUES ('Write docs', 1);
INSERT INTO tasks (title, user_id, completed) VALUES ('Design schema', 2, true);
INSERT INTO tasks (title, user_id) VALUES ('Add auth', 2);
INSERT INTO tasks (title, user_id) VALUES ('Deploy app', 2);
INSERT INTO tasks (title, user_id) VALUES ('Code review', 3);
INSERT INTO tasks (title, user_id, completed) VALUES ('Fix bugs', 3, true);
INSERT INTO tasks (title, user_id) VALUES ('Refactor code', 4);
INSERT INTO tasks (title, user_id) VALUES ('Setup CI/CD', 5);
