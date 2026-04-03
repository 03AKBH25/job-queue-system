import { createProgressTracker } from "../utils/progressTracker.js";

export const reportProcessor = async (job) => {
  const { jobId } = job.data;

  console.log("� Processing REPORT job");

  // 🔹 Define steps
  const totalSteps = 4;
  const stepDone = createProgressTracker(jobId, totalSteps);

  // Step 1: Validate report data
  await new Promise(res => setTimeout(res, 500));
  if (job.data.payload?.simulateFailure) {
    throw new Error("Simulated failure triggered during report data validation.");
  }
  await stepDone();

  // Step 2: Prepare content
  await new Promise(res => setTimeout(res, 500));
  await stepDone();

  // Step 3: Send report
  await new Promise(res => setTimeout(res, 500));
  await stepDone();

  // Step 4: Log success
  await new Promise(res => setTimeout(res, 500));
  await stepDone();

  return { success: true, message: "Report generated successfully" };
};