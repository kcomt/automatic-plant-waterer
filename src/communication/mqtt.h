#pragma once

#include <Arduino.h>
#include "state.h"

void setupMQTT();
void mqttLoop();

void publishState(const PlantState& state);

bool isMQTTConnected();

void mqttCallback(char* topic, uint8_t* payload, unsigned int length);