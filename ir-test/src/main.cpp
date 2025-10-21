// #include <Arduino.h>

// const int sensorPin = 2;
// int lastState = LOW;
// unsigned long lastChange = 0;
// int test = 0;

// void setup() {
//   Serial.begin(9600);
//   pinMode(sensorPin, INPUT);
// }

// void loop() {
//   int currentState = digitalRead(sensorPin);
//   Serial.println(currentState);
//   // detect change in sensor state
//   if (currentState != lastState) {
//     lastChange = millis();
//     Serial.println("Movement detected!");
//     // to show difference in printed messages
//     test++;
//     // Serial.println(test);
//   }
//   lastState = currentState;
//   delay(20);
// }

#include <Arduino.h>

const int sensorPin = 2;
int lastState = LOW;
unsigned long lastChangeTime = 0;
unsigned long windowStart = 0;
int changeCount = 0;
bool moving = false;

const unsigned long windowDuration = 1000;  // 1 second window
const int movementThreshold = 5;            // Require at least 5 flips/sec to count as movement
const unsigned long idleTimeout = 1200;     // Time with no flips = movement stopped

void setup() {
  Serial.begin(9600);
  pinMode(sensorPin, INPUT);
}

void loop() {
  int currentState = digitalRead(sensorPin);
  // Serial.println("yippee");
  // Detect state change
  if (currentState != lastState) {
    lastChangeTime = millis();
    changeCount++;
  }

  // Every second, evaluate the number of flips
  if (millis() - windowStart >= windowDuration) {
    if (!moving && changeCount >= movementThreshold) {
      Serial.println("Movement detected!");
      moving = true; // Mark movement burst as started
    }
    // Reset for next time window
    changeCount = 0;
    windowStart = millis();
  }

  // If no flips for a while, end movement burst
  if (moving && millis() - lastChangeTime > idleTimeout) {
    moving = false;
  }

  lastState = currentState;
  delay(20);
}