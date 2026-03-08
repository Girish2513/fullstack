import express from "express";

const app = express();
app.use(express.json());

/* TASK COLLECTION */

// app.get("/tasks", (req, res) => {
//   res.send("Get all tasks");
// });

// app.post("/tasks", (req, res) => {
//   res.send("Create new task");
// });

/* SINGLE TASK */

// app.get("/tasks/:id", (req, res) => {
//   res.send(`Get task ${req.params.id}`);
// });

// app.put("/tasks/:id", (req, res) => {
//   res.send(`Update task ${req.params.id}`);
// });

// app.delete("/tasks/:id", (req, res) => {
//   res.send(`Delete task ${req.params.id}`);
// });

/* NESTED RESOURCE */

app.get("/users/:id/tasks", (req, res) => {
  res.send(`Tasks for user ${req.params.id}`);
});

app.listen(3000, () => {
  console.log("Server running on 3000");
});

//drill 2
type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};
let tasks: Task[] = [];
let nextId = 1;
app.get("/tasks", (req, res) => {
  res.json({
    data: tasks,
  });
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  const task: Task = {
    id: nextId++,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);

  res.status(201).json({
    data: task,
  });
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  res.json({
    data: task,
  });
});
