import { createJobService, replayJobService , getFailedJobsService, deleteJobService } from "../services/jobServices.js"
import { cancelJobService, getJobByIdService, getJobsService, getJobStatsService } from "../services/jobServices.js"
import prisma from "../../../shared/prismaClient.js"
import jobQueue from "../queues/jobQueue.js"

// Controller for creating a new job

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

// Controller for getting a job by id

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

// Controller for replaying a job by id

export const replayJob = async (req, res) => {
  try {

    const { jobId } = req.params;

    await replayJobService(jobId);

    return res.status(200).json({
      success: true,
      message: "Job replayed successfully"
    });

  } catch (error) {
    console.error("❌ replayJob controller error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Controller for Getting all the jobs with pagination, filtering and sorting

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

// Controller for getting job stats like total jobs, completed jobs, failed jobs etc.

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

// Controller for getting failed jobs with pagination and filtering

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

// Controller for deleting a job by id

export const deleteJob = async (req, res) => {
  try {

    const { jobId } = req.params;

    await deleteJobService(jobId);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    console.error("❌ deleteJob controller error:", error);

    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Controller for canceling a job by id

export const cancelJob = async (req, res) => {
  try {

    const { jobId } = req.params;

    await cancelJobService(jobId);

    return res.status(200).json({
      success: true,
      message: "Job cancelled successfully"
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};