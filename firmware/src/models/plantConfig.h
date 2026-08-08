#pragma once

#include <stdint.h> // or #include <cstdint>
#include <Arduino.h>

struct PlantConfig
{
    // Identification
    String id = "outdoor";
    String name = "Outdoor Plant";

    // Soil moisture thresholds (high reading = dry, low reading = wet)
    int dryThreshold = 3200;
    int wetThreshold = 1150;

    // Watering
    int wateringDuration = 4000; // ms
    int maxWateringsPerDay = 3;  // flood safeguard

    // Monitoring
    int publishInterval = 30000; // 30 seconds

    float tankHeight = 12; // cm
};
extern PlantConfig config;