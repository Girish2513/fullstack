import { Router } from "express";
import { CommentController } from "../controllers/comment.controller.js";

const router = Router();

router.post("/tasks/:taskId/comments", CommentController.create);
router.get("/tasks/:taskId/comments", CommentController.getByTask);
router.get("/tasks/:taskId/comments/threaded", CommentController.getThreaded);
router.delete("/comments/:id", CommentController.delete);

export default router;
