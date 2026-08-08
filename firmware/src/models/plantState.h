#pragma once

#include <stdint.h> // or #include <cstdint>

struct PlantState
{
    bool soilDry = false;
    bool tankEmpty = false;
    bool pumpRunning = false;
    bool wateringLocked = false; // true when daily watering limit is reached

    int soilMoistureRaw = 0;
    uint8_t soilMoisturePercent = 0;

    float waterDistance = 0;
    float tankPercentage = 0;

    uint8_t wateringCount = 0; // waterings in the current 24 h window
};

extern PlantState state;