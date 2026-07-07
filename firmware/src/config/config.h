#ifndef CONFIG_H
#define CONFIG_H

// Pins
const int WATER_SENSOR_TRIG = 5;
const int WATER_SENSOR_ECHO = 18;

const int GREEN_LED = 25;    // Everything OK
const int YELLOW_LED = 26;   // Attention Needed
const int RED_LED = 27;      // Error / Cannot Water
const int BLUE_LED = 14;     // Status pump active

const int RELAY_PIN = 23;    // For Pump
const int SOIL_SENSOR_PIN = 34;

const float WATER_CONTAINER_HEIGHT = 20.0; // in cm

#endif