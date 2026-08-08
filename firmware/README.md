# Automatic Plant Waterer — Firmware

ESP32-based firmware for an automatic plant watering system. Monitors soil moisture and water tank level, controls a pump relay, displays status on an LCD, and communicates over MQTT via Wi-Fi.

## Features

- **Soil moisture monitoring** — reads an analog capacitive sensor and maps raw ADC values to a percentage
- **Water tank level monitoring** — measures distance with an HC-SR04 ultrasonic sensor to estimate tank fill percentage
- **Automatic watering** — activates the pump when soil is dry, stops when wet or tank is empty
- **Daily watering limit** — configurable max waterings per 24 h window to prevent over-watering
- **LCD status display** — shows live sensor readings and system state on a 16×2 I2C LCD
- **Status LEDs** — green (OK), yellow (attention), red (error/cannot water), blue (pump active)
- **MQTT integration** — publishes state and config; accepts remote commands and configuration updates
- **Wokwi simulation support** — `wokwi.toml` and `diagram.json` included for in-browser testing

## Hardware

| Component                        | Pin(s)               |
| -------------------------------- | -------------------- |
| HC-SR04 Ultrasonic (water level) | TRIG → 18, ECHO → 19 |
| Capacitive soil moisture sensor  | ADC → 34             |
| Relay module (pump)              | 23                   |
| I2C LCD 16×2                     | SDA → 21, SCL → 22   |
| Green LED                        | 2                    |
| Yellow LED                       | 4                    |
| Red LED                          | 16                   |
| Blue LED                         | 17                   |

## Software Architecture

```
src/
├── main.cpp              # Setup and main loop
├── scheduler.cpp/.h      # Non-blocking task scheduler
├── communication/
│   ├── mqtt.cpp/.h       # Wi-Fi + MQTT connection, pub/sub logic
├── config/
│   └── config.h          # Pin definitions and hardware constants
├── devices/
│   ├── display.cpp/.h    # LCD rendering
│   ├── sensors.cpp/.h    # Soil and tank sensor reads
│   └── watering.cpp/.h   # Pump control logic
└── models/
    ├── plantConfig.cpp/.h  # Runtime configuration (thresholds, intervals)
    └── plantState.cpp/.h   # Runtime sensor state
```

## MQTT Topics

| Topic            | Direction           | Payload                                         |
| ---------------- | ------------------- | ----------------------------------------------- |
| `plant/state`    | Publish             | JSON with soil moisture, tank level, pump state |
| `plant/config`   | Publish / Subscribe | JSON with plant configuration fields            |
| `plant/command`  | Subscribe           | Plain string command (`pump:on`, `pump:off`)    |
| `plant/response` | Publish             | JSON with command result and optional reason    |

### Example `plant/state` payload

```json
{
  "soilMoistureRaw": 2400,
  "soilMoisturePercent": 45,
  "soilDry": false,
  "tankEmpty": false,
  "pumpRunning": false,
  "waterDistance": 4.2,
  "tankPercentage": 65.0
}
```

### Example `plant/config` payload

```json
{
  "id": "outdoor",
  "name": "Outdoor Plant",
  "dryThreshold": 3200,
  "wetThreshold": 1150,
  "wateringDuration": 4000,
  "publishInterval": 30000
}
```

## Getting Started

### Prerequisites

- [PlatformIO](https://platformio.org/) (CLI or VS Code extension)
- ESP32 DOIT DevKit v1

### Build & Flash

```bash
# Build
pio run

# Upload to connected ESP32
pio run --target upload

# Monitor serial output
pio device monitor
```

### Configuration

Before building, update the credentials in `src/communication/mqtt.cpp`:

```cpp
const char *WIFI_SSID     = "your-ssid";
const char *WIFI_PASSWORD = "your-password";

const char *MQTT_HOST     = "your-broker.hivemq.cloud";
const char *MQTT_USERNAME = "your-username";
const char *MQTT_PASSWORD = "your-password";
```

Plant behaviour defaults (thresholds, watering duration, publish interval) are defined in `src/models/plantConfig.h` and can also be updated at runtime via the `plant/config` MQTT topic.

### Simulation (Wokwi)

Open the workspace in VS Code with the [Wokwi for VS Code](https://marketplace.visualstudio.com/items?itemName=wokwi.wokwi-vscode) extension, then press **F1 → Wokwi: Start Simulator**. The `wokwi.toml` points to the PlatformIO build output automatically.

## Dependencies

| Library                           | Purpose            |
| --------------------------------- | ------------------ |
| `marcoschwartz/LiquidCrystal_I2C` | I2C LCD driver     |
| `knolleary/PubSubClient`          | MQTT client        |
| `bblanchon/ArduinoJson`           | JSON serialization |
