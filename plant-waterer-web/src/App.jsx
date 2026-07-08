import { useState, useEffect } from "react";
import { useMqtt } from "./hooks/useMqtt";
import SettingsModal from "./components/SettingsModal";
import "./App.css";

const DEFAULT_BROKER = "ws://localhost:9001";

function formatLastUpdate(date) {
  if (!date) return "No data yet";
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin !== 1 ? "s" : ""} ago`;
  return date.toLocaleTimeString();
}

function SoilMoistureCard({ soilMoisturePercent, soilDry }) {
  const label = soilDry
    ? "🌵 Dry"
    : soilMoisturePercent >= 70
      ? "🌿 Wet"
      : "💧 Moist";
  const labelColor = soilDry
    ? "text-[#ba1a1a]"
    : soilMoisturePercent >= 70
      ? "text-[#1bbf65]"
      : "text-[#505f76]";
  const dotColor = soilDry
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

function WaterTankCard({ tankPercentage, tankEmpty }) {
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

function PumpCard({ pumpRunning, onWaterNow }) {
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
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-[#414944]">Power</span>
          {/* Read-only indicator — pump is controlled by the IoT device */}
          <span
            className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              pumpRunning ? "bg-[#4de082]" : "bg-[#c1c8c2]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                pumpRunning ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </span>
        </div>
        <button
          onClick={onWaterNow}
          className="w-full bg-[#002d1c] text-white text-[12px] font-semibold tracking-widest uppercase py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">
            water_drop
          </span>
          Water Now
        </button>
      </div>
    </div>
  );
}

function ModeCard({ isAutomatic, onToggle }) {
  return (
    <div className="glass-card rounded-xl p-6 flex flex-col justify-between h-56">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[12px] font-semibold tracking-widest text-[#505f76] uppercase mb-1">
            Operating Mode
          </p>
          <h3 className="text-[20px] font-semibold leading-7 text-[#002d1c] mt-2">
            {isAutomatic ? "Automatic" : "Manual"}
          </h3>
        </div>
        <span className="material-symbols-outlined text-[#85b098] bg-[#c0edd3]/30 p-2 rounded-lg text-[24px]">
          settings_suggest
        </span>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-[14px] text-[#414944]">Manual Switch</span>
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            !isAutomatic ? "bg-[#002d1c]" : "bg-[#c1c8c2]"
          }`}
          aria-pressed={!isAutomatic}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              !isAutomatic ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

const ACTIVITY_ICONS = {
  pump_off: {
    icon: "power_settings_new",
    border: "border-[#002d1c]",
    iconColor: "text-[#002d1c]",
  },
  pump_on: {
    icon: "mode_fan",
    border: "border-[#4de082]",
    iconColor: "text-[#4de082]",
  },
  watered: {
    icon: "opacity",
    border: "border-[#4de082]",
    iconColor: "text-[#4de082]",
  },
  moisture_low: {
    icon: "trending_down",
    border: "border-[#c1c8c2]",
    iconColor: "text-[#717973]",
  },
  moisture_ok: {
    icon: "trending_up",
    border: "border-[#4de082]",
    iconColor: "text-[#4de082]",
  },
  tank_low: {
    icon: "water_drop",
    border: "border-[#ba1a1a]",
    iconColor: "text-[#ba1a1a]",
  },
  manual: {
    icon: "touch_app",
    border: "border-[#505f76]",
    iconColor: "text-[#505f76]",
  },
};

function ActivityFeed({ activities }) {
  if (!activities.length) {
    return (
      <p className="text-[14px] text-[#717973] text-center py-8">
        No recent activity.
      </p>
    );
  }

  return (
    <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-[#c1c8c2]">
      {activities.map((item) => {
        const style = ACTIVITY_ICONS[item.type] ?? ACTIVITY_ICONS.moisture_low;
        return (
          <div key={item.id} className="flex gap-6 relative">
            <div
              className={`z-10 w-6 h-6 rounded-full bg-white border-2 ${style.border} flex items-center justify-center shrink-0`}
            >
              <span
                className={`material-symbols-outlined text-[14px] ${style.iconColor}`}
              >
                {style.icon}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-[16px] text-[#1a1c1a]">{item.message}</p>
              <p className="text-[14px] text-[#505f76]">
                {formatLastUpdate(item.time)}
                {item.detail ? ` • ${item.detail}` : ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [brokerUrl, setBrokerUrl] = useState(() => {
    return localStorage.getItem("mqttBroker") || DEFAULT_BROKER;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isAutomatic, setIsAutomatic] = useState(true);
  const [activities, setActivities] = useState([]);
  const [tick, setTick] = useState(0);

  const { plantState, connected, lastUpdate, publish } = useMqtt(brokerUrl);

  // Refresh "X ago" timestamps every 30s
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  // Log activity events when plant state changes
  const prevRef = {
    pumpRunning: undefined,
    soilDry: undefined,
    tankEmpty: undefined,
  };
  useEffect(() => {
    // We use a ref to compare previous vs current; this runs on every plantState change
  }, []);

  // Track state transitions for the activity feed
  const [prevState, setPrevState] = useState(null);
  useEffect(() => {
    if (!lastUpdate) return;
    const addActivity = (type, message, detail = "") => {
      setActivities((prev) => [
        {
          id: Date.now() + Math.random(),
          type,
          message,
          detail,
          time: new Date(),
        },
        ...prev.slice(0, 19),
      ]);
    };

    if (prevState === null) {
      setPrevState(plantState);
      return;
    }

    if (plantState.pumpRunning && !prevState.pumpRunning)
      addActivity("pump_on", "Pump turned on", "Watering started");
    if (!plantState.pumpRunning && prevState.pumpRunning)
      addActivity("pump_off", "Pump turned off", "Watering cycle complete");
    if (plantState.soilDry && !prevState.soilDry)
      addActivity(
        "moisture_low",
        `Soil moisture low (${plantState.soilMoisturePercent}%)`,
        "Threshold crossed",
      );
    if (!plantState.soilDry && prevState.soilDry)
      addActivity(
        "moisture_ok",
        `Soil moisture recovered (${plantState.soilMoisturePercent}%)`,
        "Above threshold",
      );
    if (plantState.tankEmpty && !prevState.tankEmpty)
      addActivity("tank_low", "Water tank empty", "Refill needed");

    setPrevState(plantState);
  }, [plantState, lastUpdate]);

  function handleWaterNow() {
    publish("plant/command", { action: "water_now" });
    setActivities((prev) => [
      {
        id: Date.now(),
        type: "manual",
        message: "Manual water command sent",
        detail: "Via dashboard",
        time: new Date(),
      },
      ...prev.slice(0, 19),
    ]);
  }

  function handleSaveBroker(url) {
    localStorage.setItem("mqttBroker", url);
    setBrokerUrl(url);
  }

  return (
    <div className="min-h-screen bg-[#f9faf6] text-[#1a1c1a] font-['Inter',sans-serif]">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 py-5 bg-[#f9faf6]/80 backdrop-blur-md border-b border-[#e2e3df]">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#1a4331] text-3xl">
            potted_plant
          </span>
          <h1 className="text-[20px] font-semibold leading-7 text-[#002d1c]">
            Automatic Plant Waterer
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#f3f4f0] rounded-full">
            <span
              className={`w-2 h-2 rounded-full ${connected ? "bg-[#4de082] status-glow" : "bg-[#ba1a1a]"}`}
            ></span>
            <span className="text-[12px] font-semibold tracking-widest text-[#1a1c1a]">
              {connected ? "Online" : "Offline"}
            </span>
          </div>
          <span className="text-[14px] text-[#505f76] hidden sm:inline">
            {lastUpdate
              ? `Last update: ${formatLastUpdate(lastUpdate)}`
              : "Waiting for data…"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="text-[#505f76] hover:bg-[#eeeeeb] p-2 rounded-full transition-colors active:scale-95"
              aria-label="Refresh"
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="text-[#505f76] hover:bg-[#eeeeeb] p-2 rounded-full transition-colors active:scale-95"
              aria-label="Settings"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="pt-32 px-10 pb-16 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-[32px] font-semibold leading-10 tracking-tight text-[#002d1c]">
              System Overview
            </h2>
            <p className="text-[16px] text-[#505f76] mt-1">
              Real-time vitals for your plant.
            </p>
          </div>
          <div className="hidden lg:block w-32 h-1 bg-gradient-to-r from-[#c0edd3] to-transparent rounded-full" />
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <SoilMoistureCard
            soilMoisturePercent={plantState.soilMoisturePercent}
            soilDry={plantState.soilDry}
          />
          <WaterTankCard
            tankPercentage={plantState.tankPercentage}
            tankEmpty={plantState.tankEmpty}
          />
          <PumpCard
            pumpRunning={plantState.pumpRunning}
            onWaterNow={handleWaterNow}
          />
          <ModeCard
            isAutomatic={isAutomatic}
            onToggle={() => {
              const next = !isAutomatic;
              setIsAutomatic(next);
              publish("plant/command", {
                action: "set_mode",
                mode: next ? "automatic" : "manual",
              });
            }}
          />
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Activity feed */}
          <div className="lg:col-span-2 glass-card rounded-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[20px] font-semibold leading-7 text-[#002d1c]">
                Recent Activity
              </h3>
              <button
                onClick={() => setActivities([])}
                className="text-[12px] font-semibold tracking-widest text-[#505f76] hover:underline"
              >
                Clear
              </button>
            </div>
            <ActivityFeed activities={activities} />
          </div>

          {/* Sensor detail panel */}
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
                  {plantState.soilMoistureRaw}
                </span>
              </div>

              <div className="w-full h-px bg-[#c1c8c2]" />

              {/* Water distance */}
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold tracking-widest text-[#505f76] uppercase">
                  Water Distance
                </span>
                <span className="text-[36px] font-bold leading-[44px] tracking-tight text-[#002d1c]">
                  {plantState.waterDistance.toFixed(1)}
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
                {!plantState.soilDry && !plantState.tankEmpty ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4de082]" />
                    <span className="text-[14px] text-[#1bbf65] font-semibold">
                      All systems normal
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {plantState.soilDry && (
                      <div className="flex items-center gap-2 bg-[#ffdad6] rounded-lg px-3 py-2">
                        <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
                          warning
                        </span>
                        <span className="text-[13px] font-semibold text-[#93000a]">
                          Soil is dry
                        </span>
                      </div>
                    )}
                    {plantState.tankEmpty && (
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
        </div>
      </main>

      {showSettings && (
        <SettingsModal
          brokerUrl={brokerUrl}
          onSave={handleSaveBroker}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
