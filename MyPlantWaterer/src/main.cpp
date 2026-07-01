#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>


LiquidCrystal_I2C lcd(0x27, 16, 2);

//Pins
const int WATER_SENSOR_TRIG = 5;
const int WATER_SENSOR_ECHO = 18;

const int GREEN_LED = 25; //Everything OK
const int YELLOW_LED = 26; //Attention Needed
const int RED_LED = 27; //Error / Cannot Water
const int BLUE_LED = 14; //Status pump active

const int RELAY_PIN = 23; //For Pump

const int SOIL_SENSOR_PIN = 34;

bool soilDry = false;
bool tankEmpty = false;
bool pumpRunning = false;

float waterDistance = 0;
const float waterContainerHeight = 20; // in cm

String topMessage = "";
String botMessage = "";

void updateLEDs(){
  digitalWrite(YELLOW_LED, soilDry);
  digitalWrite(RED_LED, tankEmpty);
  digitalWrite(BLUE_LED, pumpRunning);

  bool healthy =
    !soilDry &&
    !tankEmpty &&
    !pumpRunning;

  digitalWrite(GREEN_LED, healthy);
}

void updateDisplay() {
  String newTopMessage;
  String newBotMessage;

  if (soilDry) {
    newTopMessage = "Soil Dry";
  }
  else {
    newTopMessage = "Soil Ok";
  }

  if (pumpRunning) {
    newBotMessage = "Watering";
  } else {
    float waterLevelPercentage = (((waterContainerHeight - waterDistance)/waterContainerHeight) * 100);
    waterLevelPercentage = constrain(waterLevelPercentage, 0, 100);
    newBotMessage = "Tank: " + String((int)waterLevelPercentage) + "%";
  }

  if (topMessage != newTopMessage || botMessage != newBotMessage) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(newTopMessage);
    lcd.setCursor(0, 1);
    lcd.print(newBotMessage);

    topMessage = newTopMessage;
    botMessage = newBotMessage;
  }
}

float measureWaterDistance(){
  digitalWrite(WATER_SENSOR_TRIG, LOW);
  delayMicroseconds(2);

  digitalWrite(WATER_SENSOR_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(WATER_SENSOR_TRIG, LOW);

  long duration = pulseIn(WATER_SENSOR_ECHO, HIGH, 30000);

  if (duration == 0) {
    Serial.println("Sensor timeout");
    return waterContainerHeight;
 }

  float distance = duration * 0.034 / 2; //In cm
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" in Cm");
  return distance;
}

void changePumpState(bool condition){
  if(condition){
    digitalWrite(RELAY_PIN, HIGH);
  } else {
    digitalWrite(RELAY_PIN, LOW);
  }
}

void setup() {
  // put your setup code here, to run once:

  Serial.begin(115200);
  Serial.println("Hello, ESP32!");

  Wire.begin(21, 22);
  lcd.init();
  lcd.backlight();

  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);
  
  pinMode(WATER_SENSOR_TRIG, OUTPUT);
  pinMode(WATER_SENSOR_ECHO, INPUT);

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(SOIL_SENSOR_PIN, INPUT);  // FIXED: Changed from OUTPUT to INPUT
}

void loop() {
  // put your main code here, to run repeatedly:

  // 1. Check if soil dry, and if water
  int moisture = analogRead(SOIL_SENSOR_PIN);

  if (!soilDry && moisture <= 1000) {
      soilDry = true;
  }
  if (soilDry && moisture >= 1200) {
      soilDry = false;
  }

  waterDistance = measureWaterDistance();
  if(waterDistance > 15){  
    // There's water in the tank, start watering
    tankEmpty = true;
  } else {
    // No water in tank
    tankEmpty = false;
  }

  Serial.print("soildry: ");
  Serial.println(soilDry);

  Serial.print("tankEmpty: ");
  Serial.println(tankEmpty);

  if(soilDry && !tankEmpty){
    Serial.println("Soil Dry and tank not empty");
    pumpRunning = true;
    changePumpState(true);
  } else {
    pumpRunning = false;
    changePumpState(false);
  }

  updateLEDs();
  updateDisplay();
  
  delay(1000); // Add a small delay to prevent overwhelming the loop
}