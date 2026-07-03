#include "display.h"
#include "config.h"
#include "state.h"
#include <Arduino.h>

static String topMessage = "";
static String botMessage = "";
LiquidCrystal_I2C lcd(0x27, 16, 2);

void updateLEDs() {
  digitalWrite(YELLOW_LED, state.soilDry);
  digitalWrite(RED_LED, state.tankEmpty);
  digitalWrite(BLUE_LED, state.pumpRunning);

  bool healthy = !state.soilDry && !state.tankEmpty && !state.pumpRunning;
  digitalWrite(GREEN_LED, healthy);
}

void updateDisplay() {
  String newTopMessage;
  String newBotMessage;

  if (state.soilDry) {
    newTopMessage = "Soil Dry";
  } else {
    newTopMessage = "Soil Ok";
  }

  if (state.pumpRunning) {
    newBotMessage = "Watering";
  } else {
    float waterLevelPercentage = (((WATER_CONTAINER_HEIGHT - state.waterDistance) / WATER_CONTAINER_HEIGHT) * 100);
    waterLevelPercentage = constrain(waterLevelPercentage, 0, 100);
    newBotMessage = "Tank: " + String((int)waterLevelPercentage) + "%";
  }

  if (topMessage != newTopMessage || botMessage != newBotMessage) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(newTopMessage);
    lcd.setCursor(0, 1);
    lcd.print(newBotMessage);

    topMessage = newTopMessage;
    botMessage = newBotMessage;
  }
}