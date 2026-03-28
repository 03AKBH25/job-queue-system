import express from "express"
import { cancelJob, createJob, getJobById, replayJob, getJobs, getJobStats,getFailedJobs, deleteJob } from "../controllers/jobController.js"

const router = express.Router()

router.post("/", createJob)
router.get("/stats", getJobStats)
router.get("/failed", getFailedJobs)
router.post("/cancel/:jobId", cancelJob);
router.delete("/:jobId", deleteJob)
router.get("/:id", getJobById)
router.post("/replay/:jobId", replayJob)
router.get("/", getJobs)


export default router;