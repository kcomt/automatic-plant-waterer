export default function SensorDetails({
  soilMoistureRaw,
  waterDistance,
  soilDry,
  tankEmpty,
  brokerUrl,
}) {
  return (
    <div className="glass-card rounded-xl p-8 bg-gradient-to-br from-white to-[#f3f4f0]">
      <h3 className="text-[20px] font-semibold leading-7 text-[#002d1c] mb-6">
        Sensor Details
      </h3>
      <div className="space-y-5">
        {/* Raw moisture */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-semibold tracking-widest text-[#505f76] uppercase">
            Raw ADC Value
          </span>
          <span className="text-[36px] font-bold leading-[44px] tracking-tight text-[#002d1c]">
            {soilMoistureRaw}
          </span>
        </div>

        <div className="w-full h-px bg-[#c1c8c2]" />

        {/* Water distance */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-semibold tracking-widest text-[#505f76] uppercase">
            Water Distance
          </span>
          <span className="text-[36px] font-bold leading-[44px] tracking-tight text-[#002d1c]">
            {waterDistance.toFixed(1)}
            <span className="text-[16px] font-normal text-[#505f76] ml-1">
              cm
            </span>
          </span>
        </div>

        <div className="w-full h-px bg-[#c1c8c2]" />

        {/* Alerts */}
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold tracking-widest text-[#505f76] uppercase">
            Alerts
          </span>
          {!soilDry && !tankEmpty ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4de082]" />
              <span className="text-[14px] text-[#1bbf65] font-semibold">
                All systems normal
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {soilDry && (
                <div className="flex items-center gap-2 bg-[#ffdad6] rounded-lg px-3 py-2">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
                    warning
                  </span>
                  <span className="text-[13px] font-semibold text-[#93000a]">
                    Soil is dry
                  </span>
                </div>
              )}
              {tankEmpty && (
                <div className="flex items-center gap-2 bg-[#ffdad6] rounded-lg px-3 py-2">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
                    water_drop
                  </span>
                  <span className="text-[13px] font-semibold text-[#93000a]">
                    Tank is empty
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MQTT broker */}
        <div className="w-full h-px bg-[#c1c8c2]" />
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-semibold tracking-widest text-[#505f76] uppercase">
            Broker
          </span>
          <span className="text-[12px] text-[#717973] break-all">
            {brokerUrl}
          </span>
        </div>
      </div>
    </div>
  );
}
