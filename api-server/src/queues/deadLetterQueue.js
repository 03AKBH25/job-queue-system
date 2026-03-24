import {Queue} from "bullmq";
import redisConnection from "../../../shared/redisConnection.js";

const deadLetterQueue = new Queue("deadLetterQueue", {
    connection : redisConnection
})

export default deadLetterQueue;