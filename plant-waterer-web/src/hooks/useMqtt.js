import { useState, useEffect, useRef, useCallback } from "react";
import mqtt from "mqtt";

const DEFAULT_BROKER =
  "wss://cea62e455cca42e98b0ad9bd6d02ea70.s1.eu.hivemq.cloud:8884/mqtt";
const MQTT_USERNAME = "plantwaterer";
const MQTT_PASSWORD = "SuperSecretPassword123";
const PLANT_STATE_TOPIC = "plant/state";

const DEFAULT_STATE = {
  soilDry: false,
  tankEmpty: false,
  pumpRunning: false,
  soilMoistureRaw: 0,
  soilMoisturePercent: 0,
  waterDistance: 0,
  tankPercentage: 0,
};

export function useMqtt(brokerUrl = DEFAULT_BROKER) {
  const [plantState, setPlantState] = useState(DEFAULT_STATE);
  const [brokerConnected, setBrokerConnected] = useState(false);
  const [deviceOnline, setDeviceOnline] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    const client = mqtt.connect(brokerUrl, {
      reconnectPeriod: 3000,
      connectTimeout: 5000,
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
    });

    clientRef.current = client;

    client.on("connect", () => {
      setBrokerConnected(true);
      client.subscribe(PLANT_STATE_TOPIC, { qos: 0 });
      // Subscribe to LWT status topic (retained — broker delivers last known state immediately)
    });

    client.on("disconnect", () => {
      setBrokerConnected(false);
      setDeviceOnline(false);
    });
    client.on("offline", () => {
      setBrokerConnected(false);
      setDeviceOnline(false);
    });
    client.on("error", () => {
      setBrokerConnected(false);
      setDeviceOnline(false);
    });

    client.on("message", (topic, message) => {
      const payload = message.toString();
      console.log("Received message:", topic, payload);

      if (topic === PLANT_STATE_TOPIC) {
        try {
          console.log("deviceOnline:", deviceOnline);

          const parsed = JSON.parse(payload);
          console.log("Received plant state:", parsed);
          setPlantState((prev) => ({ ...prev, ...parsed }));
          setLastUpdate(new Date());
          setDeviceOnline(true);
        } catch {
          console.log("Goes here");
          // malformed message — ignore
        }
      }
    });

    return () => {
      client.end(true);
    };
  }, [brokerUrl]);

  const publish = useCallback((topic, payload) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish(topic, JSON.stringify(payload));
    }
  }, []);

  console.log("deviceOnline", deviceOnline);
  console.log("plantState", plantState);
  return { plantState, brokerConnected, deviceOnline, lastUpdate, publish };
}
