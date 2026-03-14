import { Queue } from "bullmq";
import redisConnection from "../../../shared/redisConnection.js";

const jobQueue = new Queue("jobQueue", {
  connection: redisConnection
});

console.log("📌 Job Queue initialized");

export default jobQueue;