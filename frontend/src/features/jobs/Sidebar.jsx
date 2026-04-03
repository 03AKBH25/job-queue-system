import { Activity, Clock, CheckCircle2, AlertCircle, LayoutGrid, Search, Mail, Database, Code2 } from 'lucide-react';

const Sidebar = ({ activeFilters, onFilterChange, searchId, onSearchChange }) => {
  const handleStatusFilter = (status) => {
    onFilterChange({ ...activeFilters, status });
  };

  const handleTypeFilter = (type) => {
    onFilterChange({ ...activeFilters, type });
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearchChange(e.target.value);
    }
  };

  const isStatusActive = (status) => activeFilters.status === status;
  const isTypeActive = (type) => activeFilters.type === type;

  return (
    <aside className="w-64 glass border-r border-white/5 h-[calc(100vh-4rem)] sticky top-16 flex flex-col hidden md:flex">
      <div className="p-4 border-b border-white/5">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-secondary group-focus-within:text-accent transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-white/5 text-primary placeholder-secondary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm transition-all"
            placeholder="Search Job ID... (Enter)"
            defaultValue={searchId}
            onKeyDown={handleSearchKeyPress}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="px-3 space-y-1">
          {/* Main Views */}
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Views</p>
            <button
              onClick={() => handleStatusFilter(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                !activeFilters.status ? 'bg-accent/10 text-accent' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              All Jobs
            </button>
            <button
              onClick={() => handleStatusFilter('ACTIVE')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                isStatusActive('ACTIVE') ? 'bg-blue-500/10 text-blue-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              Active
            </button>
            <button
              onClick={() => handleStatusFilter('WAITING')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                isStatusActive('WAITING') ? 'bg-slate-500/10 text-slate-300' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              Waiting
            </button>
            <button
              onClick={() => handleStatusFilter('COMPLETED')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                isStatusActive('COMPLETED') ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </button>
            <button
              onClick={() => handleStatusFilter('FAILED')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                isStatusActive('FAILED') ? 'bg-red-500/10 text-red-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              Failed
            </button>
          </div>

          {/* Type Filters */}
          <div>
            <p className="px-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Filter by Type</p>
            <button
              onClick={() => handleTypeFilter(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                !activeFilters.type ? 'bg-accent/10 text-accent' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              All Types
            </button>
            <button
              onClick={() => handleTypeFilter('email')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                isTypeActive('email') ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => handleTypeFilter('data')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                isTypeActive('data') ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              Data Processing
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
