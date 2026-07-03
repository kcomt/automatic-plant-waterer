#include "sensors.h"
#include "config.h"
#include "state.h"
#include <Arduino.h>

float measureWaterDistance() {
  digitalWrite(WATER_SENSOR_TRIG, LOW);
  delayMicroseconds(2);

  digitalWrite(WATER_SENSOR_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(WATER_SENSOR_TRIG, LOW);

  long duration = pulseIn(WATER_SENSOR_ECHO, HIGH, 30000);

  if (duration == 0) {
    Serial.println("Sensor timeout");
    return WATER_CONTAINER_HEIGHT;
  }

  float distance = duration * 0.034 / 2; // In cm
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" in Cm");
  return distance;
}

void updateSensorReadings() {
  // Update soil moisture
  int moisture = analogRead(SOIL_SENSOR_PIN);
  
  if (!state.soilDry && moisture <= 1000) {
    state.soilDry = true;
  }
  if (state.soilDry && moisture >= 1200) {
    state.soilDry = false;
  }
  
  // Update water distance
  state.waterDistance = measureWaterDistance();
  
  // Update tank empty status
  if (state.waterDistance > 15) {
    state.tankEmpty = true;
  } else {
    state.tankEmpty = false;
  }
}