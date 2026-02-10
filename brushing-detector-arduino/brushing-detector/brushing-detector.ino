const int NUM_SENSORS = 6; // Change this if we need to add more sensors 
const int sensorPins[NUM_SENSORS] = {A0, A1, A2, A3, A4, A5}; // Add more based on teeth number 
//light sensors use 220 ohm resistors

int lastValues[NUM_SENSORS];
unsigned long lastTime = 0;

void setup() {

  Serial.begin(9600);

  analogReadResolution(10);

  // Initialize all sensor values
  for (int i = 0; i < NUM_SENSORS; i++) {
    pinMode(sensorPins[i], INPUT);
    digitalWrite(sensorPins[i], LOW);
    delayMicroseconds(50);

    lastValues[i] = analogRead(sensorPins[i]);
    delayMicroseconds(100);
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

    delayMicroseconds(50);
  }

  Serial.println();

  delay(50);

}



