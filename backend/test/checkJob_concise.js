import prisma from "./shared/prismaClient.js";

async function check() {
    console.log("Reading last created job...");
    const jobs = await prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
        take: 1
    });

    if (jobs.length > 0) {
        const job = jobs[0];
        console.log(`Job ID: ${job.id}`);
        console.log(`Status: ${job.status}`);
        console.log(`Attempts: ${job.attempts}`);
        console.log(`Result: ${job.result}`);
    } else {
        console.log("No jobs found");
    }
    process.exit();
}

check();
