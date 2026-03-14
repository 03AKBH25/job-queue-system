import IORedis from "ioredis"

const redisConnection = new IORedis({
    host: "localhost",
    port: 6739
})

redisConnection.on("connect",() => {
    console.log("Redis connected");
})

redisConnection.on("error",(err)=>{
    console.error("Redis connection error: ",err);
})

export default redisConnection;