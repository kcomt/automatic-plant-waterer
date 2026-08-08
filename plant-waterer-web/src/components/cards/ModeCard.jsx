import { useState, useEffect, useRef } from "react";
import { PLANT_CONFIG_PRESETS } from "../../config/plantConfigPresets";

export default function ModeCard({ selectedConfig, onConfigChange }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const cfg = selectedConfig;

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-2 h-56 relative">
      <div className="flex justify-between items-start">
        <p className="text-[12px] font-semibold tracking-widest text-[#505f76] uppercase">
          Plant Configuration
        </p>
        <span className="material-symbols-outlined text-[#85b098] bg-[#c0edd3]/30 p-2 rounded-lg text-[24px]">
          settings
        </span>
      </div>

      {/* Dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between bg-[#f3f4f0] hover:bg-[#eeeeeb] px-3 py-1.5 rounded-lg text-[13px] font-semibold text-[#002d1c] transition-colors"
        >
          <span>{cfg.name}</span>
          <span className="material-symbols-outlined text-[18px] text-[#505f76]">
            {open ? "expand_less" : "expand_more"}
          </span>
        </button>
        {open && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#e2e3df] rounded-lg shadow-lg z-20 overflow-hidden">
            {PLANT_CONFIG_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onConfigChange(preset);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-[13px] transition-colors ${
                  cfg.id === preset.id
                    ? "bg-[#c0edd3]/40 font-semibold text-[#002d1c]"
                    : "text-[#505f76] hover:bg-[#f3f4f0]"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Config attributes */}
      <div className="flex flex-col gap-1">
        {/* Dry + Wet on same line */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center justify-between flex-1 gap-1">
            <span className="text-[12px] text-[#505f76]">Dry</span>
            <span className="text-[12px] font-semibold text-[#002d1c] bg-[#f3f4f0] px-2 py-0.5 rounded">
              {cfg.dryThreshold}
            </span>
          </div>
          <div className="w-px h-3 bg-[#e2e3df]" />
          <div className="flex items-center justify-between flex-1 gap-1">
            <span className="text-[12px] text-[#505f76]">Wet</span>
            <span className="text-[12px] font-semibold text-[#002d1c] bg-[#f3f4f0] px-2 py-0.5 rounded">
              {cfg.wetThreshold}
            </span>
          </div>
        </div>
        {[
          {
            label: "Watering duration",
            value: `${cfg.wateringDuration / 1000}s`,
          },
          {
            label: "Publish interval",
            value: `${cfg.publishInterval / 1000}s`,
          },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-[12px] text-[#505f76]">{label}</span>
            <span className="text-[12px] font-semibold text-[#002d1c] bg-[#f3f4f0] px-2 py-0.5 rounded">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
