import { useEffect, useState } from "react";
import {fetchJobs} from "./jobApi";

export const useJobs = () =>{
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getJobs = async () =>{
        try{
            setLoading(true);
            const data = await fetchJobs();
            setJobs(data);
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        getJobs();
        const interval = setInterval(getJobs, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    },[])

    return {jobs, loading, error};
}