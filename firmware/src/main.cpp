#include <Arduino.h>
#include <Wire.h>
#include <WiFiClientSecure.h>

#include "config/config.h"
#include "models/plantState.h"
#include "devices/display.h"
#include "communication/mqtt.h" // <-- Add this
#include "scheduler.h"
#include "devices/sensors.h"

void setup()
{
    Serial.begin(115200);
    Serial.println("Hello, ESP32!");

    // Initialize I2C
    Wire.begin(21, 22);

    // LCD
    lcd.init();
    lcd.backlight();

    // LEDs
    pinMode(GREEN_LED, OUTPUT);
    pinMode(YELLOW_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);
    pinMode(BLUE_LED, OUTPUT);

    // Sensors
    pinMode(WATER_SENSOR_TRIG, OUTPUT);
    pinMode(WATER_SENSOR_ECHO, INPUT);
    pinMode(SOIL_SENSOR_PIN, INPUT);

    // Relay
    pinMode(RELAY_PIN, OUTPUT);

    setupMQTT();

    schedulerInit();

    // Should read sensors and update display at startup
    publishConfig(config);
    performMonitoring();

    // PRINT CONFIG
    Serial.println("=== Plant Config ===");
    Serial.print("Name: ");
    Serial.println(config.name);

    Serial.print("Dry Threshold: ");
    Serial.println(config.dryThreshold);

    Serial.print("Wet Threshold: ");
    Serial.println(config.wetThreshold);

    Serial.print("Watering Duration: ");
    Serial.println(config.wateringDuration);

    Serial.print("Publish Interval: ");
    Serial.println(config.publishInterval);

    Serial.println("====================");
}

void loop()
{
    mqttLoop();     // Handle incoming MQTT messages
    schedulerRun(); // Handle scheduled tasks
}