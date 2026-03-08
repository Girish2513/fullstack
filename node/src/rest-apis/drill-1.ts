import express from "express";

const app = express();
app.use(express.json());

app.listen(3001, () => {
  console.log("Server running on 3001");
});

/* TASK COLLECTION */

app.get("/tasks", (req, res) => {
  res.send("Get all tasks");
});

app.post("/tasks", (req, res) => {
  res.send("Create new task");
});

/* SINGLE TASK */

app.get("/tasks/:id", (req, res) => {
  res.send(`Get task ${req.params.id}`);
});

app.put("/tasks/:id", (req, res) => {
  res.send(`Update task ${req.params.id}`);
});

app.delete("/tasks/:id", (req, res) => {
  res.send(`Delete task ${req.params.id}`);
});

/* NESTED RESOURCE */

app.get("/users/:id/tasks", (req, res) => {
  res.send(`Tasks for user ${req.params.id}`);
});

// curl http://localhost:3001/tasks
// curl -X POST http://localhost:3001/tasks
// curl http://localhost:3001/tasks/1
// curl -X PUT http://localhost:3001/tasks/1
// curl -X PUT http://localhost:3001/tasks/1
// curl http://localhost:3001/users/5/tasks
