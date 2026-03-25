import express from "express"
import { createJob, getJobById, replayJob } from "../controllers/jobController.js"

const router = express.Router()

router.post("/jobs", createJob)
router.get("/jobs/:id", getJobById)
router.post("/jobs/replay/:jobId", replayJob)

export default router;