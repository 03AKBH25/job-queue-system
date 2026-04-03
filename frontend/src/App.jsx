import JobList from "./features/jobs/JobList";
import Sidebar from "./features/jobs/Sidebar";
import { Activity, Mail, FileText, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { createJob } from "./features/jobs/jobs-api";

function App() {
  const [activeFilters, setActiveFilters] = useState({ status: null, type: null });
  const [searchId, setSearchId] = useState("");

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    setSearchId(""); // Clear search when interacting with filters
  };

  const handleSearchChange = (id) => {
    setSearchId(id);
    if (id) {
      setActiveFilters({ status: null, type: null }); // Clear filters when searching
    }
  };

  const handleCreateDummyJob = async (type, simulateFailure = false) => {
    const payload = simulateFailure 
        ? { message: `Simulated failure test payload`, simulateFailure: true }
        : { message: `Dummy ${type} payload test` };
    
    // Fire the promise to the toaster directly
    const createPromise = createJob({
        type,
        payload,
        priority: simulateFailure ? 1 : 5
    });

    toast.promise(createPromise, {
        loading: 'Enqueuing job...',
        success: `Successfully enqueued ${type} job!`,
        error: (err) => `Failed: ${err.message}`
    });
  };

  return(
    <div className="min-h-screen bg-background text-primary selection:bg-accent/30 flex flex-col">
      <Toaster position="top-right" toastOptions={{
          style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)'
          }
      }} />
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 overflow-hidden group">
              <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <Activity className="w-5 h-5 text-accent relative z-10 animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold tracking-tight text-gradient">SystemCore</h1>
              <p className="text-xs text-secondary font-medium -mt-1 leading-none uppercase tracking-wider">Queue Interface</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             {/* Dev Testing Tools */}
             <div className="flex items-center gap-2 border-r border-white/10 pr-6 hidden md:flex">
                <span className="text-xs text-secondary font-mono mr-2">Dev Tools:</span>
                <button 
                  onClick={() => handleCreateDummyJob('email')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
                >
                  <Mail className="w-3 h-3" /> + Email
                </button>
                <button 
                  onClick={() => handleCreateDummyJob('report')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                >
                  <FileText className="w-3 h-3" /> + Report
                </button>
                <button 
                  onClick={() => handleCreateDummyJob('email', true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                >
                  <AlertTriangle className="w-3 h-3" /> + Fail Job
                </button>
             </div>

             <div className="flex items-center gap-2 text-sm text-secondary">
               <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                </span>
                Connected
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex">
        <Sidebar 
          activeFilters={activeFilters} 
          onFilterChange={handleFilterChange}
          searchId={searchId}
          onSearchChange={handleSearchChange}
        />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative min-w-0">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
          
          <JobList 
            activeFilters={activeFilters}
            searchId={searchId}
          />
        </main>
      </div>
    </div>
  )
}

export default App;