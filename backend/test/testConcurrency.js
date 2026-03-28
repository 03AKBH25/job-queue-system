import jobQueue from "./api-server/src/queues/jobQueue.js";
import prisma from "./shared/prismaClient.js";

async function testConcurrency() {
  console.log("🚀 Creating 10 jobs to test concurrency...");

  const promises = [];

  for (let i = 1; i <= 10; i++) {
    // 1. Create a job record in the database
    const jobRecord = await prisma.job.create({
      data: {
        type: "generate-report",
        payload: {
          userId: i,
          reportType: `test-concurrency-${i}`,
          shouldFail: false
        }
      }
    });

    // 2. Add the job to the queue
    promises.push(
      jobQueue.add("generate-report", {
        jobId: jobRecord.id,
        payload: {
          userId: i,
          reportType: `test-concurrency-${i}`,
          shouldFail: false
        }
      }).then(() => {
        console.log(`📦 Job ${i} added to queue (DB ID: ${jobRecord.id})`);
      })
    );
  }

  // Wait for all 10 jobs to be added to the queue
  await Promise.all(promises);

  console.log("✅ All 10 jobs added to the queue!");
  console.log("👀 Now watch your worker terminal. It should process 5 jobs simultaneously, wait ~1 second, and then process the next 5.");
  
  process.exit(0);
}

testConcurrency().catch(err => {
  console.error("❌ Error running test:", err);
  process.exit(1);
});
