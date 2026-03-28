import redisConnection from "./shared/redisConnection.js";

async function test() {
  await redisConnection.set("test-key", "hello-job-queue");
  const value = await redisConnection.get("test-key");

  console.log("Redis value:", value);

  process.exit();
}

test();