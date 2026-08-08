#include "devices/watering.h"
#include "config/config.h"
#include "models/plantState.h"
#include "models/plantConfig.h"
#include "communication/mqtt.h"
#include "scheduler.h"

static unsigned long wateringStartTime = 0;
static unsigned long wateringWindowStart = 0; // start of the current 24 h window

void changePumpState(bool condition)
{
  if (condition)
  {
    digitalWrite(RELAY_PIN, HIGH);
  }
  else
  {
    digitalWrite(RELAY_PIN, LOW);
  }
}

void updateWatering()
{
  if (!state.pumpRunning)
    return;

  if (millis() - wateringStartTime >= config.wateringDuration)
  {

    Serial.println("Watering duration reached, stopping watering");
    stopWatering();
  }
}

void startWatering()
{
  Serial.println("Attempting to start watering");
  if (state.pumpRunning)
    return; // Already watering

  if (state.wateringLocked)
  {
    Serial.println("Watering is locked, cannot start watering");
    return; // Watering is locked
  }

  unsigned long now = millis();

  // Initialize window on first call
  if (wateringWindowStart == 0)
    wateringWindowStart = now;

  // Reset counter every 24 hours
  if (now - wateringWindowStart >= 86400000UL)
  {
    wateringWindowStart = now;
    state.wateringCount = 0;
    state.wateringLocked = false;
  }

  // Flood safeguard: block if daily limit reached
  if (state.wateringCount >= (uint8_t)config.maxWateringsPerDay)
  {
    if (!state.wateringLocked)
    {
      state.wateringLocked = true;
      Serial.println("Watering safeguard: daily limit reached, blocking pump");
      publishState(state);
    }
    return;
  }

  Serial.println("Starting watering");

  state.pumpRunning = true;
  state.wateringCount++;
  wateringStartTime = now;

  changePumpState(true);
}

void stopWatering()
{
  Serial.println("Stopping watering, publishing state");

  state.pumpRunning = false;

  changePumpState(false);

  scheduleDelayedMonitoring(10000); // Read sensors in 10 s

  publishState(state);
}