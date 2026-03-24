import prisma from "../../../shared/prismaClient.js"
import jobQueue from "../queues/jobQueue.js"

export const createJobService = async (type, payload) => {
  try {

    console.log("💾 Saving job in database")

    const jobRecord = await prisma.job.create({
      data: {
        type,
        payload,
      }
    })

    console.log("📦 Adding job to Redis queue")

    const queueJob = await jobQueue.add(type, {
      jobId: jobRecord.id,
      payload
    })

    console.log("✅ Job added to queue:", queueJob.id)

    return jobRecord

  } catch (error) {

    console.error("❌ JobService error:", error)

    throw error
  }
}

export const getJobByIdService = async (jobId) =>{
  try{
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    })
    if(!job){
      throw new Error("Job not found")
    }
    return job 
  }catch(error){
    console.error("❌ GetJobService error:", error)
    throw error
  }
}