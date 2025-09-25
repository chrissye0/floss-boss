#include <Arduino.h>


// // Arduino analog pin connected between LDR and 10k resistor
// int ldrPin = A0;

// void setup() {
//   Serial.begin(9600);
// }

// void loop() {
//   int lightVal = analogRead(ldrPin);
//   Serial.println(lightVal);
//   if (lightVal > 40) {  // adjust based on testing
//     Serial.println("Brush detected!");
//   }

//   delay(50);
// }

const int ldrPin = A0;
int lastValue = 0;
unsigned long lastTime = 0;

void setup() {
  Serial.begin(9600);
  lastValue = analogRead(ldrPin);
}

void loop() {
  int currentValue = analogRead(ldrPin);
  Serial.println(currentValue);

  int delta = abs(currentValue - lastValue);

  unsigned long currentTime = millis();

  if (delta > 15 && (currentTime - lastTime > 50)) {
    Serial.println("Brushing motion detected!");
    lastTime = currentTime;
  }

  lastValue = currentValue;
  delay(10); // Tune this as needed
}


// const int irPin = 2;

// void setup() {
//   pinMode(irPin, INPUT);
//   Serial.begin(9600);
// }

// void loop() {
//   int signal = digitalRead(irPin);
//   Serial.println(signal);
//   if (signal == HIGH) {
//     Serial.println("IR signal detected (brush is here!)");
//   } else {
//     Serial.println("No IR signal");
//   }

//   delay(100);
// }


