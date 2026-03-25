import { createJobService, getFailedJobsService } from "../services/jobServices.js"
import { getJobByIdService, getJobsService, getJobStatsService } from "../services/jobServices.js"
import prisma from "../../../shared/prismaClient.js"
import jobQueue from "../queues/jobQueue.js"

export const createJob = async (req, res) => {
  try {

    console.log("📥 Job creation request received")

    const { type, payload } = req.body

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Job type is required"
      })
    }

    const job = await createJobService(type, payload)

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job
    })

  } catch (error) {

    console.error("❌ Controller error:", error)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

export const getJobById = async(req, res)=>{
  try{
    const {id} = req.params
    const job = await getJobByIdService(id)
    return res.status(200).json({
      success: true,
      data: job
    })
  }catch(error){
    console.error("❌ GetJob Controller error:", error)
    return res.status(404).json({
      success: false,
      message: error.message
    })
  }
}

export const replayJob = async(req, res)=>{
  const {jobId} = req.params

  try{
    //1. Fetch job from DB
    const job = await prisma.job.findUnique({
      where: {id: jobId}
    })
    if(!job){
      return res.status(404).json({error: "Job not found"})
    }

    //2. Only allow replaying failed jobs
    if(job.status !== "FAILED"){
      return res.status(400).json({error: "Only failed jobs can be replayed"})
    }

    //3. Reset job in DB
    await prisma.job.update({
      where: {id: jobId},
      data:{
        status: "WAITING",
        attempts: 0,
        result: null,
      }
    })

    //4. Add job back to queue
    await jobQueue.add(job.type, {
      jobId: job.id,
      payload: job.payload,
      type: job.type
    })

    return res.json({
      message: "Job replayed successfully"
    })
  }catch(error){
    console.error("Replay error:", error)
    return res.status(500).json({
      error: "Internal Server Error"
    })
  }
}

export const getJobs = async(req, res)=>{
  try{
    const result = await getJobsService(req.query)
    return res.status(200).json({
      success: true,
      data: result.jobs,
      meta: result.meta
    })
  }catch(error){
    console.error("GetJobs Controller error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

export const getJobStats = async(req, res)=>{
  try{
    const stats = await getJobStatsService()
    return res.status(200).json({
      success: true,
      data: stats
    })
  }catch(error){
    console.error("GetJobStats Controller error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

export const getFailedJobs = async(req, res)=>{
  try{
    const result = await getFailedJobsService(req.query)
    return res.status(200).json({
      success: true,
      data: result.jobs,
      meta: result.meta
    })
  }catch(error){
    console.error("GetFailedJobs Controller error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}