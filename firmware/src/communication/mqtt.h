#pragma once

#include <Arduino.h>
#include "models/plantState.h"
#include "models/plantConfig.h"

void setupMQTT();
void mqttLoop();

bool isMQTTConnected();

void mqttCallback(char *topic, uint8_t *payload, unsigned int length);

void processCommand(const String &command);
void processConfig(const String &message);

void publishState(const PlantState &state);
void publishConfig(const PlantConfig &config);
void publishResponse(
    const String &command,
    bool success,
    const String &reason = "");