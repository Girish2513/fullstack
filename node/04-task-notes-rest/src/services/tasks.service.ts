import { v4 as uuid } from "uuid";

let tasks: any[] = [];

export const createTask = (data: any) => {
  const task = { id: uuid(), ...data, completed: false };
  tasks.push(task);
  return task;
};

export const getTasks = (query: any) => {
  let result = [...tasks];

  // filtering
  if (query.completed !== undefined) {
    const completed = query.completed === "true";
    result = result.filter((t) => t.completed === completed);
  }

  // sorting
  if (query.sortBy) {
    const field = query.sortBy;
    const order = query.order === "desc" ? -1 : 1;

    result.sort((a, b) => {
      if (a[field] < b[field]) return -1 * order;
      if (a[field] > b[field]) return 1 * order;
      return 0;
    });
  }

  return result;
};

export const getTaskById = (id: string) => tasks.find((t) => t.id === id);

export const updateTask = (id: string, data: any) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;

  Object.assign(task, data);
  return task;
};

export const deleteTask = (id: string) => {
  tasks = tasks.filter((t) => t.id !== id);
};
