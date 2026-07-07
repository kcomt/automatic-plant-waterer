#include "devices/watering.h"
#include "config/config.h"
#include "models/state.h"
#include "communication/mqtt.h"
#include "scheduler.h"

constexpr unsigned long WATERING_DURATION = 3UL * 1000UL; // 10 seconds
static unsigned long wateringStartTime = 0;

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

  Serial.print("Watering for: ");
  Serial.println(millis() - wateringStartTime);
  Serial.print("Needed: ");
  Serial.println(WATERING_DURATION);
  Serial.print("Watering started at: ");
  Serial.println(wateringStartTime);
  Serial.print("Current time: ");
  Serial.println(millis());

  if (millis() - wateringStartTime >= WATERING_DURATION)
  {
    stopWatering();
  }
}

void startWatering()
{
  if (state.pumpRunning)
    return; // Already watering

  Serial.println("Starting watering");

  state.pumpRunning = true;
  wateringStartTime = millis();

  changePumpState(true);
}

void stopWatering()
{
  Serial.println("Stopping watering, publishing state");

  state.pumpRunning = false;

  changePumpState(false);

  scheduleDelayedMonitoring(2000); // Read sensors in 2 s

  publishState(state);
}

/*
void updateWatering() {
  if ((state.soilDry || state.manualWatering) && !state.tankEmpty) {
    Serial.println("Soil Dry and tank not empty");
    state.pumpRunning = true;
    changePumpState(true);

    if(state.manualWatering){
      //do some logic
      state.manualWatering = false;
    }
  } else {
    state.pumpRunning = false;
    changePumpState(false);
  }
}*/
