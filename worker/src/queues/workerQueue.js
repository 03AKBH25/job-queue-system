import { Worker } from "bullmq";
import redisConnection from "../../../shared/redisConnection.js";
import { jobProcessor } from "../processors/jobProcessor.js";

const worker = new Worker(
    "jobQueue",
    async (job) => {
        console.log("Job received by worker: ", job.id);
        return jobProcessor(job);
    },
    {
        connection: redisConnection,
        concurrency: 5
    }
);

worker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed successfully.`);
});

worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job.id} failed:`, err);
});

console.log("🚀 Worker started and listening for jobs...") ;

export default worker;