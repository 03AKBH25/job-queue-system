import prisma from "./shared/prismaClient.js";

async function check() {
    console.log("Reading last created job...");
    const jobs = await prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
        take: 1
    });

    if (jobs.length > 0) {
        console.log("Last Job:", JSON.stringify(jobs[0], null, 2));
    } else {
        console.log("No jobs found");
    }
    process.exit();
}

check();
