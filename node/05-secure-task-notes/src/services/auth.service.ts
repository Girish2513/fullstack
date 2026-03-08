import db from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "secret";

export async function register(email: string, password: string) {
  const hash = await bcrypt.hash(password, 10);

  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users(email,password) VALUES(?,?)",
      [email, hash],
      function (err) {
        if (err) return reject(err);

        resolve({ id: this.lastID, email });
      },
    );
  });
}

export function login(email: string, password: string) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE email=?",
      [email],
      async (err, user: any) => {
        if (err || !user) return reject(new Error("Invalid credentials"));

        const match = await bcrypt.compare(password, user.password);

        if (!match) return reject(new Error("Invalid credentials"));

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {
          expiresIn: "1h",
        });

        resolve({ token });
      },
    );
  });
}
