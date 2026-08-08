#ifndef CONFIG_H
#define CONFIG_H

// =====================
// HC-SR04 Ultrasonic Sensor
// =====================
const int WATER_SENSOR_TRIG = 18;
const int WATER_SENSOR_ECHO = 19;

// =====================
// Status LEDs
// =====================
const int GREEN_LED = 2;  // Everything OK
const int YELLOW_LED = 4; // Attention Needed
const int RED_LED = 16;   // Error / Cannot Water
const int BLUE_LED = 17;  // Pump Active

// =====================
// Relay Module
// =====================
const int RELAY_PIN = 23;

// =====================
// Soil Moisture Sensor
// =====================
const int SOIL_SENSOR_PIN = 34; // ADC input only

// =====================
// Water Tank
// =====================
const float WATER_CONTAINER_HEIGHT = 12.0f; // cm

#endif