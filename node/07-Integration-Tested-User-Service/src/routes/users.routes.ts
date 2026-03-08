import express from "express";
import * as controller from "../controllers/users.controller";

const router = express.Router();

router.post("/", controller.createUser);
router.get("/:id", controller.getUser);

export default router;
