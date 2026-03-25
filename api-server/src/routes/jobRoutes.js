import express from "express"
import { createJob, getJobById, replayJob, getJobs } from "../controllers/jobController.js"

const router = express.Router()

router.post("/", createJob)
router.get("/:id", getJobById)
router.post("/replay/:jobId", replayJob)
router.get("/", getJobs)

export default router;