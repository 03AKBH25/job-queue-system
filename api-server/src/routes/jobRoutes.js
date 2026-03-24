import express from "express"
import { createJob, getJobById } from "../controllers/jobController.js"

const router = express.Router()

router.post("/jobs", createJob)
router.get("/jobs/:id", getJobById)

export default router;