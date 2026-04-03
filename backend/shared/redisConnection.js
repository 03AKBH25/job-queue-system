import IORedis from "ioredis"

const redisUrl = process.env.REDIS_URL || "redis://localhost:6739";

const redisConnection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null
})

redisConnection.on("connect",() => {
    console.log("Redis connected");
})

redisConnection.on("error",(err)=>{
    console.error("Redis connection error: ",err);
})

export default redisConnection;