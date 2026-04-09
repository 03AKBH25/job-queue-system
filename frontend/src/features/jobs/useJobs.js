import { useEffect, useState } from "react";
import {fetchJobs} from "./jobApi"

export const useJobs = ()=>{
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getJobs = async ()=>{
        try{
            const data = await fetchJobs();
            setJobs(data)
        }catch(err){
            setError(err.message)
        }
    }

    useEffect(()=>{
        setLoading(true)
        getJobs().finally(()=>setLoading(false));

        const interval = setInterval(()=>{
            if(document.visibilityState === 'visible'){
                getJobs()
            }
        }, 3000)
        
        return ()=>clearInterval(interval)
    }, []);

    return {jobs, loading, error, refetch: getJobs}
}