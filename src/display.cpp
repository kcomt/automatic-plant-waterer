#include "display.h"
#include "config.h"
#include "state.h"
#include <Arduino.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void updateLEDs() {
  digitalWrite(YELLOW_LED, soilDry);
  digitalWrite(RED_LED, tankEmpty);
  digitalWrite(BLUE_LED, pumpRunning);

  bool healthy = !soilDry && !tankEmpty && !pumpRunning;
  digitalWrite(GREEN_LED, healthy);
}

void updateDisplay() {
  String newTopMessage;
  String newBotMessage;

  if (soilDry) {
    newTopMessage = "Soil Dry";
  } else {
    newTopMessage = "Soil Ok";
  }

  if (pumpRunning) {
    newBotMessage = "Watering";
  } else {
    float waterLevelPercentage = (((WATER_CONTAINER_HEIGHT - waterDistance) / WATER_CONTAINER_HEIGHT) * 100);
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