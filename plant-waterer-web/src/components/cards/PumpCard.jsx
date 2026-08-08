export default function PumpCard({ pumpRunning, onWaterNow, loadingWatering }) {
  return (
    <div className="glass-card rounded-xl p-6 flex flex-col justify-between h-56">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[12px] font-semibold tracking-widest text-[#505f76] uppercase mb-1">
            Pump Status
          </p>
          <h3
            className={`text-[36px] font-bold leading-[44px] tracking-tight transition-colors ${
              pumpRunning ? "text-[#1bbf65]" : "text-[#505f76]"
            }`}
          >
            {pumpRunning ? "ON" : "OFF"}
          </h3>
        </div>
        <span
          className={`material-symbols-outlined p-2 rounded-lg text-[24px] transition-colors ${
            pumpRunning
              ? "text-[#1bbf65] bg-[#c0edd3]/40 animate-spin"
              : "text-[#505f76] bg-[#e8e8e5]"
          }`}
          style={pumpRunning ? { animationDuration: "2s" } : {}}
        >
          mode_fan
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onWaterNow}
          disabled={loadingWatering || pumpRunning}
          className="btn-primary w-full bg-[#002d1c] text-white text-[12px] font-semibold tracking-widest uppercase py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          {!loadingWatering ? (
            <span className="material-symbols-outlined text-[18px]">
              water_drop
            </span>
          ) : (
            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>
          )}
          {loadingWatering ? "Watering..." : "Water Now"}
        </button>
      </div>
    </div>
  );
}
