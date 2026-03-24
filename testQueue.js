import jobQueue from "./api-server/src/queues/jobQueue.js";
import prisma from "./shared/prismaClient.js";

async function testQueue() {

  console.log("🚀 Creating job in database...");

  const jobRecord = await prisma.job.create({
    data: {
      type: "generate-report",
      payload: {
        userId: 1,
        reportType: "monthly",
        shouldFail: "true"
      }
    }
  });

  console.log("📦 Job stored in DB:", jobRecord.id);

  console.log("📤 Adding job to queue...");

  const job = await jobQueue.add("generate-report", {
    jobId: jobRecord.id,
    payload: {
      userId: 1,
      reportType: "monthly",
      shouldFail: "true"
    }
  });

  console.log("✅ Queue job created:", job.id);

  process.exit();
}

testQueue();