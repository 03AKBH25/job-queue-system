import { updateJobProgress } from "../utils/progressHelper.js";

async function jobProcessor(job) {
    console.log("Processing job:", job.name)
    console.log("Processing job with data:", job.data);

    const { jobId } = job.data

    try {

        // 🔹 Step 1
        await updateJobProgress(jobId, 10);
        await new Promise(res => setTimeout(res, 500));

        // 🔹 Step 2
        await updateJobProgress(jobId, 30);
        await new Promise(res => setTimeout(res, 500));

        // 🔹 Step 3
        await updateJobProgress(jobId, 60);
        await new Promise(res => setTimeout(res, 500));

        // 🔹 Step 4
        await updateJobProgress(jobId, 90);
        await new Promise(res => setTimeout(res, 500));

        // 🔹 Final
        await updateJobProgress(jobId, 100);

        console.log("Job processing completed for job:", job.id);

        return {
        success: true,
        message: "Report generated successfully"
        };

    } catch (error) {
        console.error("Error processing job:", error);
        throw error;
    }

}

export default jobProcessor;