const StatCard = ({ title, value, icon, colorClass, gradientClass }) => {
  const IconProps = icon;
  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      {/* Decorative gradient blob */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 ${gradientClass} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-secondary text-sm font-medium tracking-wide uppercase mb-1">{title}</p>
          <h3 className="text-3xl font-display font-bold text-primary">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass.bg} ${colorClass.border} border shadow-lg`}>
          <IconProps className={`w-5 h-5 ${colorClass.text}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
