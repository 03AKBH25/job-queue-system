const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchJobs = async (filters = {}) => {
    // Generate query string
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    
    // We fetch a high limit since we don't have visual pagination yet
    params.append('limit', '50');

    const queryString = params.toString();
    const url = `${BASE_URL}/jobs${queryString ? `?${queryString}` : ''}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
}

export const fetchJobById = async (id) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch job or job not found');
    return res.json();
}

export const createJob = async (jobData) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create job');
    }
    return res.json();
}

export const retryJob = async (jobId) => {
    const res = await fetch(`${BASE_URL}/jobs/replay/${jobId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to retry job');
    return res.json();
}

export const cancelJob = async (jobId) => {
    const res = await fetch(`${BASE_URL}/jobs/cancel/${jobId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to cancel job');
    return res.json();
}
