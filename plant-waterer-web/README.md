# Automatic Plant Waterer

An IoT-based automated plant watering system. An ESP32 monitors soil moisture and water tank level, automatically waters plants when needed, and publishes real-time data over MQTT. This web dashboard provides live monitoring and remote control.

## Features

- **Real-time monitoring** — soil moisture, water tank level, and pump status
- **Auto-watering** — firmware triggers the pump when soil is too dry (configurable thresholds)
- **Manual control** — "Water Now" button sends a command to the device via MQTT
- **Plant presets** — Living Room, Outdoor, Succulent/Cactus, and test configurations
- **Device status** — shows broker connection and device online/offline state
- **Safety limits** — maximum waterings per day and tank-empty protection

## Tech Stack

- **React 19** + **Vite**
- **TailwindCSS 4**
- **mqtt.js 5** (WebSocket connection to HiveMQ Cloud over TLS)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To build for production:

```bash
npm run build
```

## MQTT Topics

| Topic            | Direction    | Description                               |
| ---------------- | ------------ | ----------------------------------------- |
| `plant/state`    | Device → Web | JSON with moisture %, tank %, pump status |
| `plant/config`   | Device ↔ Web | Plant configuration settings              |
| `plant/command`  | Web → Device | Commands: `pump:on`, `pump:off`           |
| `plant/response` | Device → Web | Command acknowledgments                   |

The broker URL can be changed in the Settings modal (saved to `localStorage`).

## Firmware

See the `firmware/` directory for the ESP32 PlatformIO project. Hardware used:

- **ESP32** (esp32doit-devkit-v1)
- **HC-SR04** ultrasonic sensor — water tank level
- **Analog soil moisture sensor**
- **16×2 I2C LCD** display
- **Relay** module for pump control
- **4 status LEDs** (green, yellow, red, blue)
