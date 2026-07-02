#include <Arduino.h>
#include <Wire.h>
#include <WiFiClientSecure.h>

#include "config.h"
#include "state.h"
#include "sensors.h"
#include "watering.h"
#include "display.h"

WiFiClientSecure espClient;

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
}

void loop() {
  // Update sensor readings
  updateSensorReadings();
  
  // Log sensor states
  Serial.print("soildry: ");
  Serial.println(soilDry);
  Serial.print("tankEmpty: ");
  Serial.println(tankEmpty);
  
  // Update watering based on sensor states
  updateWatering();
  
  // Update LEDs and display
  updateLEDs();
  updateDisplay();
  
  delay(1000);
}