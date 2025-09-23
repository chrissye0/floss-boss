// #include <Arduino.h>
// #include <IRremote.h>

// const int pin = 12;


// void setup() {
//   Serial.begin(9600);
//   IrReceiver.begin(pin, ENABLE_LED_FEEDBACK);
// }

// void loop() {
//   if (IrReceiver.decode()) {
//       Serial.println("detected!");
//       Serial.println(IrReceiver.decodedIRData.decodedRawData, HEX); // Print "old" raw data
//       IrReceiver.printIRResultShort(&Serial); // Print complete received data in one line
//       IrReceiver.resume(); // Enable receiving of the next value
//   }
// }

#include <Arduino.h>

const int sensorPin = 2;
int lastState = LOW;
unsigned long lastChange = 0;
int test = 0;

void setup() {
  Serial.begin(9600);
  pinMode(sensorPin, INPUT);
}

void loop() {
  int currentState = digitalRead(sensorPin);

  // detect change in sensor state
  if (currentState != lastState) {
    lastChange = millis();
    Serial.println("Movement detected!");
    // to show difference in printed messages
    test++;
    Serial.println(test);
  }
  lastState = currentState;
  delay(20);
}
