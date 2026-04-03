export const Badge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "FAILED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "ACTIVE":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "WAITING":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "RETRYING":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "CANCELLED":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyles()} flex items-center justify-center w-fit`}>
      {status}
    </span>
  );
};
