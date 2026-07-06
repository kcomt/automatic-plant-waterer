#include "scheduler.h"

#include "sensors.h"
#include "watering.h"
#include "display.h"
#include "communication/mqtt.h"
#include "state.h"

//const unsigned long MONITOR_INTERVAL = 60UL * 60UL * 1000UL; // 60 minutes
const unsigned long MONITOR_INTERVAL = 5UL  * 1000UL; // 30 seconds

static unsigned long lastMonitor = 0;

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

void schedulerRun()
{
    //tiny state machine to control watering
    updateWatering();
    // Read sensors periodically
    if (millis() - lastMonitor >= MONITOR_INTERVAL)
    {
        Serial.println("Serial looping monitoring interval");
        updateSensorReadings();
        applyState();
        publishState(state);

        lastMonitor = millis();
    }
}
