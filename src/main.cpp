#include <Arduino.h>
#include <Wire.h>
#include <WiFiClientSecure.h>

#include "config.h"
#include "state.h"
#include "sensors.h"
#include "watering.h"
#include "display.h"
#include "mqtt.h"      // <-- Add this

void setup() {
  Serial.begin(115200);
  Serial.println("Hello, ESP32!");

  // Initialize I2C and LCD
  Wire.begin(21, 22);
  lcd.init();
  lcd.backlight();

  // Initialize pins
  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);
  
  pinMode(WATER_SENSOR_TRIG, OUTPUT);
  pinMode(WATER_SENSOR_ECHO, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(SOIL_SENSOR_PIN, INPUT);

  setupMQTT();   // <-- Connect WiFi + HiveMQ
}

void loop()
{
    updateSensorReadings();

    updateWatering();

    updateLEDs();

    updateDisplay();

    mqttLoop();

    static unsigned long lastPublish = 0;

    if (millis() - lastPublish >= 5000)
    {
        publishState(state);
        lastPublish = millis();
    }
}