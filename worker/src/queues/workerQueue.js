import { Worker } from "bullmq";
import redisConnection from "../../../shared/redisConnection.js";
import jobProcessor from "../processors/jobProcessor.js";
import prisma from "../../../shared/prismaClient.js"
import { MAX_RETRIES, RETRY_DELAY } from "../../../api-server/src/config/jobConfig.js"
import jobQueue from "../../../api-server/src/queues/jobQueue.js";
import deadLetterQueue from "../../../api-server/src/queues/deadLetterQueue.js";

const worker = new Worker(
  "jobQueue",
  async (job) => {
    console.log("📥 Job received by worker:", job.id)

    const { jobId } = job.data

    try {

      // 1. Idempotency check - ensure job is still in WAITING status before processing
      const existingJob = await prisma.job.findUnique({
        where: {id: jobId }
      })

      // 2. If job is not found or already being processed/completed, skip it
      if (!existingJob) {
        console.log("⚠️ Job not found in database. Skipping processing.", jobId)
        return { skipped: true, reason: "NOT_FOUND" }
      }

      if (existingJob.status === "COMPLETED") {
        console.log("✅ Job already completed. Skipping processing.", jobId)
        // Return existing result so the completed event doesn't overwrite the actual report!
        return existingJob.result || { skipped: true }
      }

      console.log("🔄 Updating job status to ACTIVE")

      await prisma.job.update({
        where: { id: jobId },
        data: { status: "ACTIVE" }
      })

      const result = await jobProcessor(job)

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

  // Prevent updating DB if the job was already deleted and thus skipped
  if (result && result.skipped && result.reason === "NOT_FOUND") return;

  try {
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        result
      }
    })
  } catch (error) {
    console.error("❌ Error updating completed status:", error)
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
    if (currentAttempts <= MAX_RETRIES) {

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

      console.log("🚫 Max retries reached. Sending job to Dead Letter Queue")

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