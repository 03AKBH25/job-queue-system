import jobQueue from "./api-server/src/queues/jobQueue.js";

async function testQueue() {
  console.log("🚀 Adding test job to queue...");

  const job = await jobQueue.add("generate-report", {
    userId: 1,
    reportType: "monthly"
  });

  console.log("✅ Job added with ID:", job.id);

  process.exit();
}

testQueue();