#include "mqtt.h"

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

WiFiClientSecure wifiClient;
PubSubClient mqtt(wifiClient); // No template arguments, just pass wifiClient

const char* WIFI_SSID = "...";
const char* WIFI_PASSWORD = "...";

const char* MQTT_HOST = "...";
const int MQTT_PORT = 8883;

const char* MQTT_USERNAME = "...";
const char* MQTT_PASSWORD = "...";

void connectWiFi()
{
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    Serial.print("Connecting to WiFi");

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println();
    Serial.println("WiFi Connected");
}

void connectMQTT()
{
    wifiClient.setInsecure();   // For now. Later we'll use HiveMQ's certificate.

    mqtt.setServer(MQTT_HOST, MQTT_PORT);

    while (!mqtt.connected())
    {
        Serial.print("Connecting to MQTT...");

        if (mqtt.connect("PlantWaterer", MQTT_USERNAME, MQTT_PASSWORD))
        {
            Serial.println("Connected!");

            mqtt.subscribe("plant/config");
            mqtt.subscribe("plant/command");
        }
        else
        {
            Serial.print("Failed. rc=");
            Serial.println(mqtt.state());

            delay(2000);
        }
    }
}

void setupMQTT()
{
    connectWiFi();

    connectMQTT();

    mqtt.subscribe("plant/config");

    mqtt.subscribe("plant/command");
}

void mqttLoop()
{
    if (!mqtt.connected())
    {
        connectMQTT();
    }

    mqtt.loop();
}

void publishState(const PlantState& state)
{
    if (!mqtt.connected())
        return;

    StaticJsonDocument<256> doc;

    doc["soilMoisture"] = state.soilMoisture;
    doc["soilDry"] = state.soilDry;
    doc["tankEmpty"] = state.tankEmpty;
    doc["pumpRunning"] = state.pumpRunning;
    doc["tankPercentage"] = state.tankPercentage;

    String payload;
    serializeJson(doc, payload);

    mqtt.publish("plant/state", payload.c_str());
}

bool isMQTTConnected()
{
    return mqtt.connected();
}