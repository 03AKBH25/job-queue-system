const API_URL = "http://localhost:3000"

export const fetchJobs = async ()=>{
    const res = await fetch(`${API_URL}/jobs`)

    if(!res.ok){
        throw new Error("Failed to fetch jobs")
    }
    return res.json()
}

export const cancelJob = async(id) =>{
    const res = await fetch(`${API_URL}/jobs/${id}/cancel`,{
        method: "POST",
    })
    if(!res.ok){
        throw new Error("Failed to cancel job")
    }
    return res.json()

}

export const retryJob = async(id) =>{
    const res = await fetch(`${API_URL}/jobs/${id}`, {
        method: "POST",
    })
    if(!res.ok){
        throw new Error("Failed to retry job")
    }
    return res.json()
}