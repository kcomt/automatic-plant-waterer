#pragma once

#include "state.h"

void setupMQTT();
void mqttLoop();

void publishState(const PlantState& state);

bool isMQTTConnected();