import { Worker } from "bullmq";
import redisConnection from "../../../shared/redisConnection.js";
import { processors } from "../processors/index.js";
import prisma from "../../../shared/prismaClient.js"
import { MAX_RETRIES, RETRY_DELAY } from "../../../api-server/src/config/jobConfig.js"
import jobQueue from "../../../api-server/src/queues/jobQueue.js";
import deadLetterQueue from "../../../api-server/src/queues/deadLetterQueue.js";

const worker = new Worker(
  "jobQueue",
  async (job) => {
    console.log("📥 Job received by worker:", job.id)

    const { jobId } = job.data;
    const type = job.name;

    try {

      // 1. Atomic Idempotency Check & Update
      // Atomic operation to prevent race conditions when two workers get the same job
      const updatedJobs = await prisma.job.updateMany({
        where: { 
          id: jobId,
          status: "WAITING" // Only process if currently WAITING
        },
        data: { status: "ACTIVE" }
      })

      // 2. If no rows were updated, job is either not found, completed, or already being processed
      if (updatedJobs.count === 0) {
        const existingJob = await prisma.job.findUnique({ where: { id: jobId } })
        
        if (!existingJob) {
          console.log("⚠️ Job not found in database. Skipping processing.", jobId)
          return { skipped: true, reason: "NOT_FOUND" }
        }

        if (existingJob.status === "COMPLETED") {
          console.log("✅ Job already completed. Skipping processing.", jobId)
          return existingJob.result || { skipped: true }
        }

        console.log(`⚠️ Job is already being processed (status: ${existingJob.status}). Skipping duplicate execution.`, jobId)
        return { skipped: true, reason: "ALREADY_PROCESSING" }
      }

      console.log("🔄 Job locked and status updated to ACTIVE")

      // 3. Process the job using the appropriate processor based on job type
      const processor = processors[type]
      if(!processor) {
        console.error(`❌ No processor found for job type: ${type}`)
        const error = new Error(`No processor for type: ${type}`)
        error.isNonRetriable = true // Mark as permanent error to skip retries
        throw error
      }

      const result = await processor(job)

      return result

    } catch (error) {
      console.error("❌ Worker processing error:", error)
      throw error
    }
  },
  {
    connection: redisConnection,
    concurrency: 5
  }
)

worker.on("completed", async (job, result) => {
  console.log(`✅ Job ${job.id} completed`)

  const { jobId } = job.data

  if (result && result.skipped && result.reason === "NOT_FOUND") {return}

  try{
    // 1. Check the current DB status first
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId }
    })
    
    // 2. If it was cancelled while processing, DO NOT overwrite to COMPLETED
    if (existingJob && existingJob.status === "CANCELLED") {
      console.log(`⚠️ Job ${jobId} was cancelled during processing. Preserving CANCELLED status.`)
      return;
    }

    // 3. Normal Completion Update
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "COMPLETED", result: result }
    })
    
  } catch(error){
    console.error("❌ Error updating job status to COMPLETED:", error)
  }
})


worker.on("failed", async (job, err) => {
  console.error(`❌ Job ${job.id} failed`)

  const { jobId, payload } = job.data
  const type = job.name

  try {

    const existingJob = await prisma.job.findUnique({
      where: { id: jobId }
    })

    const currentAttempts = existingJob.attempts + 1

    // 🔁 Check retry condition
    if (currentAttempts <= MAX_RETRIES && !err.isNonRetriable) {

      const delay = RETRY_DELAY(currentAttempts)

      console.log(`🔁 Retry #${currentAttempts} scheduled in ${delay / 1000}s`)

      // Update attempts + status
      await prisma.job.update({
        where: { id: jobId },
        data: {
          status: "WAITING",
          attempts: currentAttempts
        }
      })

      // Re-add job manually with delay
      await jobQueue.add(type, {
        jobId,
        payload,
        type
      }, {
        delay
      })

    } else {

      if (err.isNonRetriable) {
        console.log("🚫 Permanent error encountered. Sending job directly to Dead Letter Queue")
      } else {
        console.log("🚫 Max retries reached. Sending job to Dead Letter Queue")
      }

      await prisma.job.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          result: err.message,
          attempts: currentAttempts
        }
      })

      // Add to Dead Letter Queue for further analysis

      await deadLetterQueue.add("failedJob", {
        jobId,
        payload,
        type,
        error: err.message
      })
    }

  } catch (error) {
    console.error("❌ Retry handler error:", error)
  }
})

console.log("🚀 Worker started and listening for jobs...") ;

export default worker;