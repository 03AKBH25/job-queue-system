import { Worker } from "bullmq";
import redisConnection from "../../../shared/redisConnection.js";
import prisma from "../../../shared/prismaClient.js"
import jobQueue from "../../../api-server/src/queues/jobQueue.js";  

const dlqWorker = new Worker(
    "deadLetterQueue",
    async (job) => {
        console.log("DLQ job received:", job.id)

        const {jobId, payload, type} = job.data

        try{

            // 1. Reset job status in DB to WAITING
            await prisma.job.update({
                where: {id: jobId},
                data: {
                    status: "WAITING",
                    attempts: 0,
                    result: null
                }
            })
            console.log("job reset in DB")


            // 2. Re-add job to main queue
            await jobQueue.add(type, {
                jobId, 
                payload, 
                type
            })
            console.log("job re-added to main queue")

            return {success: true}
        }catch(error){
            console.error("DLQ processing error:", error)
            throw error
        }
    },
    {
        connection: redisConnection,
    }
)

console.log("☠️ DLQ Worker is running...");
export default dlqWorker;