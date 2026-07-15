import { useState, useEffect, useRef, useCallback } from "react";
import mqtt from "mqtt";

const DEFAULT_BROKER =
  "wss://cea62e455cca42e98b0ad9bd6d02ea70.s1.eu.hivemq.cloud:8884/mqtt";
const MQTT_USERNAME = "plantwaterer";
const MQTT_PASSWORD = "SuperSecretPassword123";

const PLANT_STATE_TOPIC = "plant/state";
const PLANT_CONFIG_TOPIC = "plant/config";
const RESPONSE_TOPIC = "plant/response";

const DEFAULT_STATE = {
  soilDry: false,
  tankEmpty: false,
  pumpRunning: false,
  soilMoistureRaw: 0,
  soilMoisturePercent: 0,
  waterDistance: 0,
  tankPercentage: 0,
};

export function useMqtt(
  brokerUrl = DEFAULT_BROKER,
  selectedConfig,
  setSelectedConfig,
) {
  const [plantState, setPlantState] = useState(DEFAULT_STATE);
  const [brokerConnected, setBrokerConnected] = useState(false);
  const [deviceOnline, setDeviceOnline] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);
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
      client.subscribe(PLANT_CONFIG_TOPIC, { qos: 0 });
      client.subscribe(RESPONSE_TOPIC, { qos: 0 });
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
          console.log("Setting deviceOnline to true");
        } catch (error) {
          console.log("Error parsing plant state:", error);
        }
      } else if (topic === PLANT_CONFIG_TOPIC) {
        console.log("Received plant config:", payload);
        try {
          const parsed = JSON.parse(payload);
          console.log("Received plant config parsed:", parsed);
          setSelectedConfig(parsed);
          //setLastUpdate(new Date());
          //setDeviceOnline(true);
        } catch (error) {
          console.log("Error parsing plant config:", error);
          // malformed message — ignore
        }
      } else if (topic === RESPONSE_TOPIC) {
        setLastResponse({ payload: message.toString(), timestamp: new Date() });
      }
    });

    return () => {
      client.end(true);
    };
  }, [brokerUrl]);

  const publish = useCallback((topic, payload) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish(
        topic,
        typeof payload === "string" ? payload : JSON.stringify(payload),
      );
    }
  }, []);

  return {
    plantState,
    brokerConnected,
    deviceOnline,
    lastUpdate,
    lastResponse,
    publish,
  };
}
