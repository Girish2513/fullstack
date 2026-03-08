import express from "express";
import { createUser, getUserByEmail } from "./database.ts";
import { authMiddleware } from "./authMiddleware.ts";
import { requireRole } from "./requireRole.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./errorHandler";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests, please try again later",
  },
});
app.use(limiter);
app.use(express.json({ limit: "1mb" }));

const JWT_SECRET = process.env.JWT_SECRET as string;

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const userId = createUser(email, hash, "user");

    res.json({
      message: "User registered",
      userId,
    });
  } catch (error) {
    res.status(500).json({
      error: "Registration failed",
    });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = getUserByEmail(email);

  if (!user) {
    return res.status(401).json({
      error: { message: "Invalid credentials", status: 401 },
    });
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.json({
    message: "Login successful",
    token,
  });
});

app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      message: "Token valid",
      decoded,
    });
  } catch (err) {
    res.status(401).json({
      error: "Invalid or expired token",
    });
  }
});

app.get("/profile", authMiddleware, (req, res) => {
  const user = (req as any).user;

  res.json({
    message: "Profile accessed",
    user,
  });
});

app.get("/admin", authMiddleware, requireRole("admin"), (req, res) => {
  res.json({
    message: "Welcome admin",
  });
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
