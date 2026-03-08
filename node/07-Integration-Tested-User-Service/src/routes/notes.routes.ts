import express from "express";
import * as controller from "../controllers/notes.controller";

const router = express.Router();

router.post("/users/:userId/notes", controller.createNote);
router.get("/users/:userId/notes", controller.getNotesByUser);
router.get("/notes/:id", controller.getNote);

export default router;
