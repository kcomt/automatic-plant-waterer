function HealthRow({ icon, label, statusText, ok, warning }) {
  const dotColor = ok
    ? "bg-[#4de082]"
    : warning
      ? "bg-[#f59e0b]"
      : "bg-[#ba1a1a]";
  const textColor = ok
    ? "text-[#1bbf65]"
    : warning
      ? "text-[#b45309]"
      : "text-[#ba1a1a]";

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[20px] text-[#85b098]">
          {icon}
        </span>
        <span className="text-[15px] text-[#414944]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
        <span className={`text-[13px] font-semibold ${textColor}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}

export default function PlantHealth({
  tankEmpty,
  tankPercentage,
  soilDry,
  soilMoisturePercent,
  pumpRunning,
}) {
  const waterOk = !tankEmpty;
  const moistureOk = !soilDry;
  const pumpWarning = pumpRunning;

  const allHealthy = waterOk && moistureOk;
  const overallLabel = allHealthy ? "Healthy" : "Needs Attention";
  const overallColor = allHealthy ? "text-[#1bbf65]" : "text-[#ba1a1a]";
  const overallBg = allHealthy ? "bg-[#c0edd3]/30" : "bg-[#ffdad6]/50";
  const overallDot = allHealthy ? "bg-[#4de082]" : "bg-[#ba1a1a]";

  return (
    <div className="lg:col-span-2 glass-card rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[20px] font-semibold leading-7 text-[#002d1c]">
          Plant Health
        </h3>
        <span className="material-symbols-outlined text-[#85b098] bg-[#c0edd3]/30 p-2 rounded-lg text-[24px]">
          potted_plant
        </span>
      </div>

      <div className="divide-y divide-[#e2e3df]">
        <HealthRow
          icon="water_drop"
          label="Water Level"
          statusText={
            waterOk
              ? `OK — ${tankPercentage.toFixed(0)}%`
              : "Empty — Refill needed"
          }
          ok={waterOk}
        />
        <HealthRow
          icon="humidity_low"
          label="Soil Moisture"
          statusText={
            moistureOk
              ? `OK — ${soilMoisturePercent}%`
              : `Dry — ${soilMoisturePercent}%`
          }
          ok={moistureOk}
        />
        <HealthRow
          icon="mode_fan"
          label="Pump"
          statusText={pumpWarning ? "Running" : "Ready"}
          ok={!pumpWarning}
          warning={pumpWarning}
        />
      </div>

      <div
        className={`mt-6 flex items-center justify-between rounded-xl px-5 py-4 ${overallBg}`}
      >
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-[#505f76] uppercase mb-0.5">
            Overall
          </p>
          <p className={`text-[22px] font-bold ${overallColor}`}>
            {overallLabel}
          </p>
        </div>
        <span className={`w-3 h-3 rounded-full ${overallDot}`} />
      </div>
    </div>
  );
}
