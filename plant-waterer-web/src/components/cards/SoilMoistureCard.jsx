export default function SoilMoistureCard({
  soilMoistureRaw,
  soilMoisturePercent,
}) {
  const label =
    soilMoisturePercent < 30
      ? "🌵 Dry"
      : soilMoisturePercent >= 70
        ? "🌿 Wet"
        : "💧 Moist";
  const labelColor =
    soilMoisturePercent < 30
      ? "text-[#ba1a1a]"
      : soilMoisturePercent >= 70
        ? "text-[#1bbf65]"
        : "text-[#505f76]";
  const dotColor =
    soilMoisturePercent < 30
      ? "bg-[#ba1a1a]"
      : soilMoisturePercent >= 70
        ? "bg-[#4de082]"
        : "bg-[#b7c8e1]";

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col justify-between h-56 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[12px] font-semibold tracking-widest text-[#505f76] uppercase mb-1">
            Soil Moisture
          </p>
          <h3 className="text-[36px] font-bold leading-[44px] tracking-tight text-[#002d1c]">
            {soilMoisturePercent}%
          </h3>
          <p className="text-[12px] text-[#505f76] mt-0.5">
            Raw: {soilMoistureRaw}
          </p>
        </div>
        <span className="material-symbols-outlined text-[#85b098] bg-[#c0edd3]/30 p-2 rounded-lg text-[24px]">
          humidity_low
        </span>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
        <span
          className={`text-[12px] font-semibold tracking-widest ${labelColor}`}
        >
          {label}
        </span>
      </div>

      {/* Sparkline decorative */}
      <div className="absolute bottom-0 left-0 w-full h-8 opacity-20 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
        >
          <path
            d="M0,15 Q10,5 20,12 T40,8 T60,15 T80,5 T100,10"
            fill="none"
            stroke="#3e6752"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
