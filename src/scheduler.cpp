#include "scheduler.h"

#include "sensors.h"
#include "watering.h"
#include "display.h"
#include "communication/mqtt.h"
#include "state.h"

// const unsigned long MONITOR_INTERVAL = 60UL * 60UL * 1000UL; // 60 minutes
const unsigned long MONITOR_INTERVAL = 5UL * 1000UL; // 30 seconds

static unsigned long lastMonitor = 0;
static unsigned long delayedMonitorAt = 0;

void schedulerInit()
{
    Serial.println("Scheduler initialized");
    lastMonitor = millis();
}

void applyState()
{
    updateLEDs();
    updateDisplay();
}

void evaluateWatering()
{
    if (state.soilDry && !state.tankEmpty)
    {
        Serial.println("Soil is dry and tank is not empty, starting watering");
        startWatering();
    }
    else if (state.soilDry && state.tankEmpty)
    {
        Serial.println("Soil is dry but tank is empty, stopping watering");
        // Send notification
    }
}

void scheduleDelayedMonitoring(unsigned long delayMs)
{
    delayedMonitorAt = millis() + delayMs;
}

void performMonitoring()
{
    updateSensorReadings();
    evaluateWatering();
    applyState();
    publishState(state);
}

void schedulerRun()
{
    updateWatering();

    unsigned long now = millis();

    if (now - lastMonitor >= MONITOR_INTERVAL)
    {
        Serial.println("Performing scheduled monitoring");
        performMonitoring();
        lastMonitor = now;
    }

    if (delayedMonitorAt != 0 && now >= delayedMonitorAt)
    {
        Serial.println("Performing delayed monitoring");
        performMonitoring();
        delayedMonitorAt = 0;
    }
}
