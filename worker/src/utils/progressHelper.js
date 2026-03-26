import prisma from "../../../shared/prismaClient.js";

// The purpose of this helper is to provide a consistent way to update job progress in the database, and to log progress updates in a standardized format. It can be used by the job processor to report progress at various stages of the job execution.

export const updateJobProgress = async (jobId, progress)=>{
    try{
        await prisma.job.update({
            where: {id: jobId},
            data: { progress }
        })
    }catch(error){
        console.error("Error updating job progress:", error)
    }
}