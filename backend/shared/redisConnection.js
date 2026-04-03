import IORedis from "ioredis"

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    console.warn("⚠️ REDIS_URL is not defined. Falling back to localhost (development mode).");
}

const redisConnection = new IORedis(redisUrl || "redis://localhost:6739", {
    maxRetriesPerRequest: null,
    keepAlive: 1000
})

redisConnection.on("connect", () => {
    console.log(`📌 Redis connected to: ${redisUrl ? 'Cloud (Upstash)' : 'Localhost'}`);
})

redisConnection.on("error",(err)=>{
    console.error("Redis connection error: ",err);
})

export default redisConnection;