import * as service from "../services/tasks.service";

export async function createTask(req: any, res: any, next: any) {
  try {
    const task = await service.createTask(
      req.body.title,
      req.body.description,
      req.user.id,
    );

    res.json(task);
  } catch (e) {
    next(e);
  }
}

export async function getTasks(req: any, res: any, next: any) {
  try {
    const tasks = await service.getTasks(req.user);

    res.json(tasks);
  } catch (e) {
    next(e);
  }
}
