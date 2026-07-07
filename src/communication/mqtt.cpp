#include "communication/mqtt.h"

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#include "../scheduler.h"
#include "../devices/watering.h"

void processCommand(const String &command);

WiFiClientSecure wifiClient;
PubSubClient mqtt(wifiClient); // No template arguments, just pass wifiClient

// const char* WIFI_SSID = "CGA2121_kt9DAHP";
// const char* WIFI_PASSWORD = "cg7MpJHy2j25Mj9FfZ";

const char *WIFI_SSID = "Wokwi-GUEST";
const char *WIFI_PASSWORD = "";

const char *MQTT_HOST = "cea62e455cca42e98b0ad9bd6d02ea70.s1.eu.hivemq.cloud";
const int MQTT_PORT = 8883;

const char *MQTT_USERNAME = "plantwaterer";
const char *MQTT_PASSWORD = "SuperSecretPassword123";

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
    wifiClient.setInsecure(); // For now. Later we'll use HiveMQ's certificate.

    mqtt.setServer(MQTT_HOST, MQTT_PORT);
    mqtt.setCallback(mqttCallback);

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

bool isMQTTConnected()
{
    return mqtt.connected();
}

void mqttCallback(char *topic, uint8_t *payload, unsigned int length)
{
    String message;

    for (unsigned int i = 0; i < length; i++)
    {
        message += (char)payload[i];
    }

    if (strcmp(topic, "plant/command") == 0)
    {
        processCommand(message);
    }
}

void processCommand(const String &command)
{
    Serial.print("Received command: ");
    if (command == "pump:on")
    {
        Serial.println("Pump ON command received.");
        if (!state.tankEmpty)
        {
            startWatering();
            publishResponse("pump:on", true);
        }
        else
        {
            Serial.println("Cannot water: tank is empty.");
            state.tankEmpty = true;

            publishState(state);
            publishResponse("pump:on", false, "TANK_EMPTY");
        }
    }
    else if (command == "pump:off")
    {
        stopWatering();
        publishState(state);
    }
}

void publishState(const PlantState &state)
{
    if (!mqtt.connected())
        return;

    JsonDocument doc;

    doc["soilMoistureRaw"] = state.soilMoistureRaw;
    doc["soilMoisturePercent"] = state.soilMoisturePercent;
    doc["soilDry"] = state.soilDry;
    doc["tankEmpty"] = state.tankEmpty;
    doc["pumpRunning"] = state.pumpRunning;
    doc["tankPercentage"] = state.tankPercentage;

    String payload;
    serializeJson(doc, payload);

    Serial.println("Publishing state: " + payload);
    mqtt.publish("plant/state", payload.c_str());
}

void publishResponse(
    const String &command,
    bool success,
    const String &reason)
{
    if (!mqtt.connected())
        return;

    StaticJsonDocument<256> doc;

    doc["command"] = command;
    doc["success"] = success;

    if (!reason.isEmpty())
    {
        doc["reason"] = reason;
    }

    String payload;
    serializeJson(doc, payload);

    Serial.print("Publishing response: ");
    Serial.println(payload);

    mqtt.publish("plant/response", payload.c_str());
}