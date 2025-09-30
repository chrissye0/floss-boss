#include <Arduino.h>

//fix error in console (type error)
//get detection working for both teeth on the screen (with the isBrushing boolean and numbers array and sending
//it to the webpage)
//have a timer for how long the detection is true/false for to detect
//brushing on a certain tooth (then do animations based on the tooth)(and maybe the numbers too
//with a timer)
//fix problems with processor and building****

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
    int delta = abs(sensorValue - lastValues[i]);

    // Print the current value
    // Serial.print("Sensor ");
    // Serial.print(i + 1);
    // Serial.print(": ");
    // Serial.println(sensorValue);

    // Brushing motion detection
    // if (delta > 15 && (currentTime - lastTime > 50)) {
    //   Serial.print("Brushing motion detected! TOOTH ");
    //   Serial.println(i + 1);
    //   lastTime = currentTime;
    // }

    // Update last value
    lastValues[i] = sensorValue;
  }

  delay(10);
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


