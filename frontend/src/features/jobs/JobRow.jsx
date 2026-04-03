import { cancelJob, retryJob } from './jobApi';
import { Badge } from './Badge';
import { RotateCcw, XCircle, RefreshCw, Code2, Database, Mail } from 'lucide-react';
import { useState } from 'react';

const JobRow = ({ job, onRefresh, index }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancel = async () => {
    try {
      setIsProcessing(true);
      await cancelJob(job.id);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = async () => {
    try {
      setIsProcessing(true);
      await retryJob(job.id);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const getJobIcon = () => {
    const type = job.type.toLowerCase();
    if (type.includes('email')) return <Mail className="w-5 h-5 text-indigo-400" />;
    if (type.includes('data')) return <Database className="w-5 h-5 text-emerald-400" />;
    return <Code2 className="w-5 h-5 text-accent" />;
  };

  // Add subtle staggered animation based on index
  const animationDelay = `${index * 50}ms`;

  return (
    <div 
      className="p-4 hover:bg-white/[0.04] transition-colors duration-200 group flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up"
      style={{ animationDelay, animationFillMode: 'both' }}
    >
      <div className="flex items-start gap-4 w-full md:w-1/3">
        <div className="mt-1 p-2 rounded-lg bg-surface border border-white/10 shadow-sm group-hover:scale-110 transition-transform duration-300">
          {getJobIcon()}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-primary">{job.type}</span>
            <span className="text-xs text-secondary font-mono bg-black/20 px-2 py-0.5 rounded-full border border-white/5">
              #{job.id.substring(0, 8)}
            </span>
          </div>
          <div className="text-xs text-secondary font-medium uppercase tracking-wider">
            Created: {new Date(job.createdAt).toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-1/3">
        <div className="flex items-center gap-3">
          <Badge status={job.status} />
          {job.status === "ACTIVE" && (
            <span className="text-xs font-medium text-blue-400 flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 animate-spin" />
              {job.progress}%
            </span>
          )}
        </div>
        
        {job.status === "ACTIVE" && (
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
             <div 
               className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out progress-animated"
               style={{ width: `${job.progress}%` }}
             />
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 w-full md:w-1/4">
        {job.status === "FAILED" && (
          <button 
            onClick={handleRetry}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 hover:bg-orange-500/20 text-orange-400 border border-white/5 hover:border-orange-500/30 transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            Retry
          </button>
        )}

        {job.status === "WAITING" && (
          <button 
            onClick={handleCancel}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 hover:bg-red-500/20 text-red-400 border border-white/5 hover:border-red-500/30 transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            <XCircle className={`w-4 h-4 ${isProcessing ? 'opacity-50' : ''}`} />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default JobRow;