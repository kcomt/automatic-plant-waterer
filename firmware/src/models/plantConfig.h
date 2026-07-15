#pragma once

#include <stdint.h> // or #include <cstdint>
#include <Arduino.h>

struct PlantConfig
{
    // Identification
    String id = "outdoor";
    String name = "Outdoor Plant";

    // Soil moisture thresholds
    int dryThreshold = 1000;
    int wetThreshold = 1200;

    // Watering
    int wateringDuration = 8000; // ms

    // Monitoring
    int publishInterval = 30000; // 30 seconds
};
extern PlantConfig config;