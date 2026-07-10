function formatLastUpdate(date) {
  if (!date) return "No data yet";
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin !== 1 ? "s" : ""} ago`;
  return date.toLocaleTimeString();
}

function StatusRow({ label, statusText, ok }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[14px] text-[#414944]">{label}</span>
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${ok ? "bg-[#4de082]" : "bg-[#ba1a1a]"}`}
        />
        <span
          className={`text-[13px] font-semibold ${ok ? "text-[#1bbf65]" : "text-[#ba1a1a]"}`}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
}

export default function DeviceStatus({ connected, lastUpdate }) {
  return (
    <div className="glass-card rounded-xl p-8 bg-gradient-to-br from-white to-[#f3f4f0]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[20px] font-semibold leading-7 text-[#002d1c]">
          Device Status
        </h3>
        <span className="material-symbols-outlined text-[#85b098] bg-[#c0edd3]/30 p-2 rounded-lg text-[24px]">
          developer_board
        </span>
      </div>

      <div className="divide-y divide-[#e2e3df]">
        <StatusRow
          label="WiFi"
          statusText={connected ? "Connected" : "Disconnected"}
          ok={connected}
        />
        <StatusRow
          label="MQTT"
          statusText={connected ? "Connected" : "Disconnected"}
          ok={connected}
        />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl bg-[#f3f4f0] px-5 py-4">
        <span className="text-[13px] text-[#505f76]">Last Update</span>
        <span className="text-[13px] font-semibold text-[#1a1c1a]">
          {formatLastUpdate(lastUpdate)}
        </span>
      </div>
    </div>
  );
}
