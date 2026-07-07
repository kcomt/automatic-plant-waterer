#pragma once

void schedulerInit();

void applyState();

void scheduleDelayedMonitoring(unsigned long delayMs);

void performMonitoring();

void schedulerRun();
