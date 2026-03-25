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