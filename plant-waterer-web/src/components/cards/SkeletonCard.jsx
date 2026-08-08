export default function SkeletonCard({ title, icon }) {
  return (
    <div className="glass-card rounded-xl p-6 flex flex-col justify-between h-56">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-[12px] font-semibold tracking-widest text-[#505f76] uppercase mb-1">
            {title}
          </p>
          <div className="h-9 w-20 bg-[#e2e3df] rounded animate-pulse" />
        </div>
        <span className="material-symbols-outlined text-[#85b098] bg-[#c0edd3]/30 p-2 rounded-lg text-[24px]">
          {icon}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#e2e3df] animate-pulse" />
          <div className="h-3 w-16 bg-[#e2e3df] rounded animate-pulse" />
        </div>
        <div className="h-1.5 w-full bg-[#e2e3df] rounded-full animate-pulse" />
      </div>
    </div>
  );
}
