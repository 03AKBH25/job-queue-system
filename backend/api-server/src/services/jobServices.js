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
      payload,
      type
    })

    await prisma.job.update({
      where: { id: jobRecord.id },
      data:{
        queueJobId: queueJob.id.toString()
      }
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

export const getJobsService = async(query)=>{
  try{
    // 1. Extract & sanitize query params
    let {page =1, limit=10, type, status, sortBy = "createdAt", order = "desc"} = query

    //Convert to numbers
    page = parseInt(page)
    limit = parseInt(limit)

    // Auto correct invalid values:

    if(isNaN(page) || page < 1) page = 1
    if(isNaN(limit) || limit < 10) limit = 10
    if(limit >50) limit = 50

    //  2. Build Filters
    const where = {}
    if(status){
      where.status = status
    }
    if(type){
      where.type = type
    }

    // 3. Pagination & Sorting

    const skip = (page - 1) * limit

    const orderBy = {
      [sortBy]: order === "asc" ? "asc" : "desc"
    }

    //  4. Fetch from DB

    const jobs = await prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy
    })

    const total = await prisma.job.count({ where })

    // 4. Return Structured Response
    return{
      jobs, 
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error("❌ GetJobsService error:", error)
    throw error

  }
}

// For dashboard stats

export const getJobStatsService = async()=>{
  try{
    // * Group by status
    const stats = await prisma.job.groupBy({
      by: ["status"],
      _count: {
        status: true
      }
    })

    // * Convert to clean structure
    const formattedStats = {
      total: 0,
      COMPLETED: 0,
      FAILED: 0,
      WAITING: 0,
      ACTIVE: 0
    }

    stats.forEach(item=>{
      const status = item.status
      const count = item._count.status
      formattedStats[status] = count
      formattedStats.total += count
    })

    return formattedStats
  }catch(error){
    console.error("❌ GetJobStatsService error:", error)
    throw error}
}

// 

export const getFailedJobsService = async(query)=>{
  try{
    let {page =1, limit=10} = query

    //Convert to numbers
    page = parseInt(page)
    limit = parseInt(limit)

    // Auto correct invalid values:

    if(isNaN(page) || page < 1) page = 1
    if(isNaN(limit) || limit < 10) limit = 10
    if(limit >50) limit = 50

    const skip = (page - 1) * limit
    const where = { status: "FAILED" }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.job.count({ where })
    ])

    return {
      jobs, 
      meta:{
        page, 
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }catch(error){
    console.error("❌ GetFailedJobsService error:", error)
    throw error
  }
}

export const deleteJobService = async (jobId) => {
  try {

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      throw new Error("Job not found");
    }

    // Delete job
    await prisma.job.delete({
      where: { id: jobId }
    });

    return true;

  } catch (error) {
    console.error("❌ deleteJobService error:", error);
    throw error;
  }
};

export const replayJobService = async (jobId) => {
  try{
    //1. Fetch job from DB
    const job = await prisma.job.findUnique({
      where: {id: jobId}
    })

    if(!job){
      throw new Error("Job not found")
    }

    // 2. Validate Status
    if(job.status !== "FAILED"){
      throw new Error("Only FAILED jobs can be replayed")
    }

    // 3. Reset Job
    await prisma.job.update({
      where: {id: jobId},
      data:{
        status: "WAITING",
        attempts: 0,
        result: null,
        updatedAt: new Date()
      }
    })

    // 4. Push back to Queue
    await jobQueue.add(job.type, {
      jobId: job.id,
      payload: job.payload,
      type: job.type
     })

     return true
    }catch(error){
      console.error("❌ replayJobService error:", error)
      throw error
  }
}

export const cancelJobService = async (jobId) => {
  try {

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      throw new Error("Job not found");
    }

    // ❌ Already completed
    if (job.status === "COMPLETED") {
      throw new Error("Cannot cancel completed job");
    }

    // 🟡 WAITING → remove from queue
    if (job.status === "WAITING") {

      if (job.queueJobId) {
        const bullJob = await jobQueue.getJob(job.queueJobId);

        if (bullJob) {
          await bullJob.remove();
        }
      }

      await prisma.job.update({
        where: { id: jobId },
        data: { status: "CANCELLED" }
      });

      return;
    }

    // 🟠 ACTIVE → soft cancel
    if (job.status === "ACTIVE") {

      await prisma.job.update({
        where: { id: jobId },
        data: { status: "CANCELLED" }
      });

      return;
    }

    // Optional: FAILED
    if (job.status === "FAILED") {
      throw new Error("Cannot cancel failed job");
    }

  } catch (error) {
    console.error("❌ cancelJobService error:", error);
    throw error;
  }
};