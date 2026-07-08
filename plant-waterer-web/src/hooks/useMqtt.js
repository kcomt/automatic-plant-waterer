import { useState, useEffect, useRef, useCallback } from 'react';
import mqtt from 'mqtt';

const DEFAULT_BROKER = 'ws://localhost:9001';
const PLANT_STATE_TOPIC = 'plant/state';

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
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    const client = mqtt.connect(brokerUrl, {
      reconnectPeriod: 3000,
      connectTimeout: 5000,
    });

    clientRef.current = client;

    client.on('connect', () => {
      setConnected(true);
      client.subscribe(PLANT_STATE_TOPIC, { qos: 0 });
    });

    client.on('disconnect', () => setConnected(false));
    client.on('offline', () => setConnected(false));
    client.on('error', () => setConnected(false));

    client.on('message', (topic, message) => {
      if (topic === PLANT_STATE_TOPIC) {
        try {
          const parsed = JSON.parse(message.toString());
          setPlantState((prev) => ({ ...prev, ...parsed }));
          setLastUpdate(new Date());
        } catch {
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

  return { plantState, connected, lastUpdate, publish };
}
