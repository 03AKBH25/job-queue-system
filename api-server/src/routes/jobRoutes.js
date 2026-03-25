import express from "express"
import { createJob, getJobById, replayJob, getJobs, getJobStats } from "../controllers/jobController.js"

const router = express.Router()

router.post("/", createJob)
router.get("/stats", getJobStats)
router.get("/:id", getJobById)
router.post("/replay/:jobId", replayJob)
router.get("/", getJobs)


export default router;