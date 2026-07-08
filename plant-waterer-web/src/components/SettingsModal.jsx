import { useState } from 'react';

export default function SettingsModal({ brokerUrl, onSave, onClose }) {
  const [url, setUrl] = useState(brokerUrl);

  function handleSubmit(e) {
    e.preventDefault();
    onSave(url.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="glass-card rounded-xl p-8 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-semibold leading-7 text-[#002d1c]">Settings</h2>
          <button
            onClick={onClose}
            className="text-[#505f76] hover:bg-[#eeeeeb] p-1.5 rounded-full transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold tracking-widest text-[#505f76] uppercase">
              MQTT Broker URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ws://192.168.1.x:9001"
              className="border border-[#c1c8c2] rounded-lg px-3 py-2.5 text-[14px] text-[#1a1c1a] bg-white focus:outline-none focus:border-[#3e6752] transition-colors"
              spellCheck={false}
            />
            <p className="text-[12px] text-[#717973]">
              WebSocket endpoint of your MQTT broker (e.g. <code>ws://192.168.1.100:9001</code>).
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#c1c8c2] text-[14px] font-semibold text-[#505f76] hover:bg-[#f3f4f0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#002d1c] text-white text-[14px] font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
