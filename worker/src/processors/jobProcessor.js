async function jobProcessor(job) {
    console.log("Processing job:", job.name)
    console.log("Processing job with data:", job.data);

    try{
        if(job.data.payload?.shouldFail){
            console.log("Forced failure triggered")
            throw new Error("Intentional failure for testing")
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log("Job processing completed for job:", job.id)

        return {success: true, message: "Report generated successfully"}
    }catch(error){
        console.error("Error processing job:", error)
        throw error
    }

}

export default jobProcessor;