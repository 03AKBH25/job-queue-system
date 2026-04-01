import {useJobs} from './useJobs';
import JobRow from './JobRow';

const JobList = () =>{
    const {jobs, loading, error} = useJobs();

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>
    
    return(
        <div>
            <h2>Jobs:</h2>
            {jobs.map(job => (
                <JobRow key={job.id} job={job} />
            ))}
        </div>
    )
}

export default JobList;