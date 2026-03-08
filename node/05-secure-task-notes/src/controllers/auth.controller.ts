import * as service from "../services/auth.service";

export async function register(req: any, res: any, next: any) {
  try {
    const result = await service.register(req.body.email, req.body.password);

    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function login(req: any, res: any, next: any) {
  try {
    const result = await service.login(req.body.email, req.body.password);

    res.json(result);
  } catch (e) {
    next(e);
  }
}
