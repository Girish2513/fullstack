import { Router } from "express";
import { submitReport, getJobStatus } from "../controllers/jobs.controller";

const router = Router();

router.post("/submit-report", submitReport);
router.get("/jobs/:id", getJobStatus);

export default router;
