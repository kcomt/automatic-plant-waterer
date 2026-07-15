#pragma once

#include <stdint.h> // or #include <cstdint>

struct PlantState
{
    bool soilDry = false;
    bool tankEmpty = false;
    bool pumpRunning = false;

    int soilMoistureRaw = 0;
    uint8_t soilMoisturePercent = 0;

    float waterDistance = 0;
    float tankPercentage = 0;
};

extern PlantState state;