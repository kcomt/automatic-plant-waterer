import { useState, useEffect } from "react";
import { useMqtt } from "./hooks/useMqtt";
import SettingsModal from "./components/SettingsModal";
import PlantHealth from "./components/PlantHealth";
import DeviceStatus from "./components/DeviceStatus";
import SkeletonCard from "./components/cards/SkeletonCard";
import SoilMoistureCard from "./components/cards/SoilMoistureCard";
import WaterTankCard from "./components/cards/WaterTankCard";
import PumpCard from "./components/cards/PumpCard";
import ModeCard from "./components/cards/ModeCard";
import "./App.css";

const DEFAULT_BROKER =
  "wss://cea62e455cca42e98b0ad9bd6d02ea70.s1.eu.hivemq.cloud:8884/mqtt";

function formatLastUpdate(date) {
  if (!date) return "No data yet";
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin !== 1 ? "s" : ""} ago`;
  return date.toLocaleTimeString();
}

export default function App() {
  const [brokerUrl, setBrokerUrl] = useState(() => {
    return localStorage.getItem("mqttBroker") || DEFAULT_BROKER;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState({});
  const [loadingWatering, setLoadingWatering] = useState(false);

  const {
    plantState,
    brokerConnected,
    deviceOnline,
    lastUpdate,
    lastResponse,
    publish,
  } = useMqtt(brokerUrl, selectedConfig, setSelectedConfig);

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (lastResponse) {
      setLoadingWatering(false);
      plantState.pumpRunning = true;
    }
  }, [lastResponse]);

  function handleWaterNow() {
    publish("plant/command", "pump:on");
    console.log("Loading watering set to true");
    setLoadingWatering(true);
  }

  function handleSaveBroker(url) {
    localStorage.setItem("mqttBroker", url);
    setBrokerUrl(url);
  }

  useEffect(() => {
    console.log("Selected config changed:", selectedConfig);
  }, [selectedConfig]);

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
              className={`w-2 h-2 rounded-full ${brokerConnected ? "bg-[#4de082] status-glow" : "bg-[#ba1a1a]"}`}
            ></span>
            <span className="text-[12px] font-semibold tracking-widest text-[#1a1c1a]">
              {brokerConnected ? "Online" : "Offline"}
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
          {deviceOnline ? (
            <SoilMoistureCard
              soilMoistureRaw={plantState.soilMoistureRaw}
              soilMoisturePercent={plantState.soilMoisturePercent}
            />
          ) : (
            <SkeletonCard title="Soil Moisture" icon="humidity_low" />
          )}
          {deviceOnline ? (
            <WaterTankCard
              waterDistance={plantState.waterDistance}
              tankPercentage={plantState.tankPercentage}
              tankEmpty={plantState.tankEmpty}
              tankHeight={selectedConfig.tankHeight}
            />
          ) : (
            <SkeletonCard title="Water Tank" icon="water_drop" />
          )}
          {deviceOnline ? (
            <PumpCard
              pumpRunning={plantState.pumpRunning}
              onWaterNow={handleWaterNow}
              loadingWatering={loadingWatering}
            />
          ) : (
            <SkeletonCard title="Pump Status" icon="mode_fan" />
          )}
          {deviceOnline ? (
            <ModeCard
              selectedConfig={selectedConfig}
              onConfigChange={(cfg) => {
                setSelectedConfig(cfg);
                publish("plant/config", cfg);
              }}
            />
          ) : (
            <SkeletonCard title="Operating Mode" icon="settings" />
          )}
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Plant Health */}
          <PlantHealth
            loading={!deviceOnline}
            tankEmpty={plantState.tankEmpty}
            tankPercentage={plantState.tankPercentage}
            soilDry={plantState.soilDry}
            soilMoisturePercent={plantState.soilMoisturePercent}
            pumpRunning={plantState.pumpRunning}
          />

          {/* Device status panel */}
          <DeviceStatus
            brokerConnected={brokerConnected}
            deviceOnline={deviceOnline}
            lastUpdate={lastUpdate}
          />
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
