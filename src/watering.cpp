#include "watering.h"
#include "config.h"
#include "state.h"
#include "communication/mqtt.h"

constexpr unsigned long WATERING_DURATION = 10UL * 1000UL; // 10 seconds
static unsigned long wateringStartTime = 0;

void changePumpState(bool condition) {
  if (condition) {
    digitalWrite(RELAY_PIN, HIGH);
  } else {
    digitalWrite(RELAY_PIN, LOW);
  }
}

void updateWatering()
{
    if (!state.pumpRunning)
        return;

    if (millis() - wateringStartTime >= WATERING_DURATION)
    {
        stopWatering();
    }
}

void startWatering()
{
    if (state.pumpRunning)
        return;     // Already watering

    Serial.println("Starting watering");

    state.pumpRunning = true;
    wateringStartTime = millis();

    changePumpState(true);
}

void stopWatering()
{
    Serial.println("Stopping watering");

    state.pumpRunning = false;

    changePumpState(false);

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

