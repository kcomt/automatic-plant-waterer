#pragma once

#include <Arduino.h>
#include "state.h"

void setupMQTT();
void mqttLoop();

bool isMQTTConnected();

void mqttCallback(char *topic, uint8_t *payload, unsigned int length);

void publishState(const PlantState &state);
void publishResponse(
    const String &command,
    bool success,
    const String &reason = "");