import { useEffect, useState, useCallback } from "react";
import { fetchJobs, fetchJobById } from "./jobApi";

export const useJobs = (filters = {}, searchId = "") => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getJobs = useCallback(async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            setError(null);

            if (searchId) {
                // If searching by ID, fetch only that job
                const res = await fetchJobById(searchId);
                // Return array of one item so JobList can map over it
                setJobs([res.data]); 
            } else {
                // Otherwise fetch with generic filters
                const res = await fetchJobs(filters);
                setJobs(res.data || []);
            }
        } catch (err) {
            setError(err.message);
            setJobs([]); // Clear jobs on error (e.g. not found)
        } finally {
            if (!isBackground) setLoading(false);
        }
    }, [filters, searchId]); // Recreate callback when dependencies change

    useEffect(() => {
        getJobs();
        const interval = setInterval(() => getJobs(true), 5000); // Polling
        return () => clearInterval(interval);
    }, [getJobs]);

    return { jobs, loading, error, refreshJobs: () => getJobs() };
}