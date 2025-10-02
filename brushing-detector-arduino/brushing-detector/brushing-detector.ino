const int NUM_SENSORS = 2; // Change this if we need to add more sensors
const int sensorPins[NUM_SENSORS] = {A0, A1}; // Add more based on teeth number 

int lastValues[NUM_SENSORS];
unsigned long lastTime = 0;

const int LED1 = A2;
const int LED2 = A3;
const int LED3 = A4;
const int LED4 = A5;
const int LED5 = 5;
const int LED6 = 6;

void setup() {
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(LED4, OUTPUT);
  pinMode(LED5, OUTPUT);
  pinMode(LED6, OUTPUT);

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

  digitalWrite(LED1, HIGH);
  digitalWrite(LED2, HIGH);
  digitalWrite(LED3, HIGH);
  digitalWrite(LED4, HIGH);
  digitalWrite(LED5, HIGH);
  digitalWrite(LED6, HIGH);

}



