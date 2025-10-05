#include <Arduino.h>

const int NUM_SENSORS = 2; // Change this if we need to add more sensors
const int sensorPins[NUM_SENSORS] = {A0, A1}; // Add more based on teeth number 

int lastValues[NUM_SENSORS];
unsigned long lastTime = 0;

void setup() {

  Serial.begin(9600);

  // Initialize all sensor values
  for (int i = 0; i < NUM_SENSORS; i++) {
    lastValues[i] = analogRead(sensorPins[i]);
  }
}

void loop() {
  unsigned long currentTime = millis();

  for (int i = 0; i < NUM_SENSORS; i++) {
    int sensorValue = analogRead(sensorPins[i]);

    float normalizedSensorValue = sensorValue/1024.0;

    Serial.print(normalizedSensorValue);

    if(i < NUM_SENSORS - 1) {
      Serial.print(",");
    }

  }

  Serial.println();

  delay(10);

}