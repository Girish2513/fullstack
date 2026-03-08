import jwt from "jsonwebtoken";

const SECRET = "secret";

export function authenticate(req: any, res: any, next: any) {
  const auth = req.headers.authorization;

  if (!auth) return res.status(401).json({ error: "Authentication required" });

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
