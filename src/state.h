#pragma once

struct PlantState
{
    bool soilDry = false;
    bool tankEmpty = false;
    bool pumpRunning = false;

    int soilMoisture = 0;

    float waterDistance = 0;
    float tankPercentage = 0;
};

struct PlantConfig
{
    int dryThreshold = 1000;
    int wetThreshold = 1200;

    float emptyDistance = 15.0f;

    bool automaticMode = true;

    int wateringDuration = 5000;
};

extern PlantState state;
extern PlantConfig config;