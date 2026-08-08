export default function WaterTankCard({
  waterDistance,
  tankPercentage,
  tankEmpty,
  tankHeight,
}) {
  const label = tankEmpty
    ? "⚠️ Empty"
    : tankPercentage >= 60
      ? "🪣 Full"
      : tankPercentage >= 30
        ? "🪣 Medium"
        : "🪣 Low";
  const fillColor = tankEmpty
    ? "bg-[#ba1a1a]"
    : tankPercentage >= 60
      ? "bg-[#002d1c]"
      : tankPercentage >= 30
        ? "bg-[#505f76]"
        : "bg-[#ba1a1a]";
  const dotColor = tankEmpty
    ? "bg-[#ba1a1a]"
    : tankPercentage >= 60
      ? "bg-[#4de082]"
      : "bg-[#b7c8e1]";

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col justify-between h-56 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[12px] font-semibold tracking-widest text-[#505f76] uppercase mb-1">
            Water Tank
          </p>
          <h3 className="text-[36px] font-bold leading-[44px] tracking-tight text-[#002d1c]">
            {tankPercentage.toFixed(0)}%
          </h3>
          <div className="flex gap-3 mt-0.5">
            <p className="text-[12px] text-[#505f76]">
              Dist: {waterDistance} cm
            </p>
            {tankHeight != null && (
              <p className="text-[12px] text-[#505f76]">
                Height: {tankHeight} cm
              </p>
            )}
          </div>
        </div>
        <span className="material-symbols-outlined text-[#85b098] bg-[#c0edd3]/30 p-2 rounded-lg text-[24px]">
          water_drop
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
          <span className="text-[12px] font-semibold tracking-widest text-[#505f76]">
            {label}
          </span>
        </div>
        <div className="w-full bg-[#e8e8e5] h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className={`${fillColor} h-full rounded-full transition-all duration-700`}
            style={{ width: `${Math.min(100, Math.max(0, tankPercentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
