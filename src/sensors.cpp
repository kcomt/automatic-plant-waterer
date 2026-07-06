#include "sensors.h"
#include "config.h"
#include "state.h"
#include <Arduino.h>

#include <stdint.h> // or #include <cstdint>

float measureWaterDistance()
{
  digitalWrite(WATER_SENSOR_TRIG, LOW);
  delayMicroseconds(2);

  digitalWrite(WATER_SENSOR_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(WATER_SENSOR_TRIG, LOW);

  long duration = pulseIn(WATER_SENSOR_ECHO, HIGH, 30000);

  if (duration == 0)
  {
    Serial.println("Sensor timeout");
    return WATER_CONTAINER_HEIGHT;
  }

  float distance = duration * 0.034 / 2; // In cm
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" in Cm");
  return distance;
}

void updateSensorReadings()
{
  // Update soil moisture
  int moisture = analogRead(SOIL_SENSOR_PIN);

  state.soilMoistureRaw = moisture;
  state.soilMoisturePercent = map(
      moisture,
      config.dryThreshold, // 1000 -> 0%
      config.wetThreshold, // 1200 -> 100%
      0,
      100);

  state.soilMoisturePercent = constrain(
      state.soilMoisturePercent,
      0,
      100);

  Serial.print("Soil moisture raw: ");
  Serial.println(state.soilMoistureRaw);
  Serial.print("Soil moisture percent: ");
  Serial.println(state.soilMoisturePercent);

  if (!state.soilDry && moisture <= 1000)
  {
    state.soilDry = true;
  }
  if (state.soilDry && moisture >= 1200)
  {
    state.soilDry = false;
  }

  // Update water distance
  state.waterDistance = measureWaterDistance();

  // Update tank empty status
  if (state.waterDistance > 15)
  {
    state.tankEmpty = true;
  }
  else
  {
    state.tankEmpty = false;
  }
}