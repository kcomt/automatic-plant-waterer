#include "watering.h"
#include "config.h"
#include "state.h"
#include <Arduino.h>

void changePumpState(bool condition) {
  if (condition) {
    digitalWrite(RELAY_PIN, HIGH);
  } else {
    digitalWrite(RELAY_PIN, LOW);
  }
}

void updateWatering() {
  if (state.soilDry && !state.tankEmpty) {
    Serial.println("Soil Dry and tank not empty");
    state.pumpRunning = true;
    changePumpState(true);
  } else {
    state.pumpRunning = false;
    changePumpState(false);
  }
}