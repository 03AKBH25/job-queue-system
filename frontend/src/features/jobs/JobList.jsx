import { useJobs } from './useJobs';
import JobRow from './JobRow';
import StatCard from './StatCard';
import { Activity, CheckCircle2, Clock, AlertCircle, Filter, Search } from 'lucide-react';

const JobList = ({ activeFilters, searchId }) => {
    const { jobs, loading, error, refreshJobs } = useJobs(activeFilters, searchId);

    // Global counts are accurate only if we are not filtering/searching locally
    // For a real production app, the backend `/stats` endpoint would give us full stats 
    // regardless of the current page query. For now we calculate it from `jobs`.
    const activeCount = jobs.filter(j => j.status === 'ACTIVE').length;
    const waitingCount = jobs.filter(j => j.status === 'WAITING').length;
    const completedCount = jobs.filter(j => j.status === 'COMPLETED').length;
    const failedCount = jobs.filter(j => j.status === 'FAILED').length;

    const isFilteringOrSearching = activeFilters.status || activeFilters.type || searchId;

    if (loading && jobs.length === 0) {
      return (
        <div className="w-full h-64 flex items-center justify-center">
           <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
              <p className="text-secondary font-medium tracking-wide">
                {searchId ? 'Searching for Job...' : 'Initializing Queue Analytics...'}
              </p>
           </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="glass-card border-red-500/20 p-6 rounded-2xl flex items-center gap-4">
           <div className="bg-red-500/10 p-3 rounded-full">
             <AlertCircle className="w-6 h-6 text-red-500" />
           </div>
           <div>
             <h3 className="text-red-500 font-semibold text-lg">System Error</h3>
             <p className="text-red-400/80">{error}</p>
           </div>
        </div>
      );
    }
    
    return (
        <div className="space-y-8 animate-slide-up">
            {/* Stats Overview - Hide during specific search or filter */}
            {!isFilteringOrSearching && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <StatCard 
                   title="Active Processes" 
                   value={activeCount} 
                   icon={Activity} 
                   colorClass={{ bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' }}
                   gradientClass="bg-blue-500"
                 />
                 <StatCard 
                   title="Waiting Actions" 
                   value={waitingCount} 
                   icon={Clock} 
                   colorClass={{ bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' }}
                   gradientClass="bg-slate-500"
                 />
                 <StatCard 
                   title="Completed" 
                   value={completedCount} 
                   icon={CheckCircle2} 
                   colorClass={{ bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' }}
                   gradientClass="bg-emerald-500"
                 />
                 <StatCard 
                   title="Failed" 
                   value={failedCount} 
                   icon={AlertCircle} 
                   colorClass={{ bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' }}
                   gradientClass="bg-red-500"
                 />
              </div>
            )}

            {/* List Section */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between bg-white/[0.02] gap-4">
                   <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                     {searchId ? 'Search Results' : 'Job Execution Stream'}
                     {!searchId && (
                       <span className="flex h-2 w-2 relative ml-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                        </span>
                     )}
                   </h2>
                   
                   {/* Contextual Badges */}
                   {isFilteringOrSearching && (
                      <div className="flex gap-2 text-sm">
                        {searchId && (
                          <span className="bg-accent/10 border border-accent/20 text-accent px-3 py-1 rounded-full flex items-center gap-2">
                            <Search className="w-3 h-3" /> ID: {searchId}
                          </span>
                        )}
                        {activeFilters.status && (
                          <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full flex items-center gap-2">
                            <Filter className="w-3 h-3" /> Status: {activeFilters.status}
                          </span>
                        )}
                        {activeFilters.type && (
                          <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full flex items-center gap-2">
                            <Filter className="w-3 h-3" /> Type: {activeFilters.type}
                          </span>
                        )}
                      </div>
                   )}
                </div>
                
                <div className="p-0">
                    {jobs.length === 0 ? (
                        <div className="p-12 text-center text-secondary border-t border-white/5 bg-white/[0.01]">
                           {searchId ? <Search className="w-10 h-10 mx-auto mb-3 opacity-20" /> : <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />}
                           <p className="font-medium text-lg text-primary mb-1">
                             {searchId ? 'Job Not Found' : 'No jobs found'}
                           </p>
                           <p className="text-sm">
                             {searchId ? `Could not find a job with ID ${searchId}.` : 'There are no jobs matching the current criteria.'}
                           </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5 flex flex-col">
                            {jobs.map((job, index) => (
                                <JobRow key={job.id} job={job} onRefresh={refreshJobs} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default JobList;