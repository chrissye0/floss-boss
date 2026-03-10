// libraries
#include <Arduino.h>
#include <CapacitiveSensor.h>

// ports to be read
// CapacitiveSensor capSensor = CapacitiveSensor(yellow,green);
CapacitiveSensor capSensor = CapacitiveSensor(3, 2);
CapacitiveSensor capSensor2 = CapacitiveSensor(5, 4);
CapacitiveSensor capSensor3 = CapacitiveSensor(7, 6);
CapacitiveSensor capSensor4 = CapacitiveSensor(9, 8);
CapacitiveSensor capSensor5 = CapacitiveSensor(11, 10);
CapacitiveSensor capSensor6 = CapacitiveSensor(13, 12);

const int NUM_SENSORS = 6;

CapacitiveSensor* sensors[NUM_SENSORS] = {
  &capSensor,
  &capSensor2,
  &capSensor3,
  &capSensor4,
  &capSensor5,
  &capSensor6
};

void setup()
{
  Serial.begin(115200);

  capSensor.set_CS_AutocaL_Millis(0xFFFFFFFF);
  capSensor2.set_CS_AutocaL_Millis(0xFFFFFFFF);
  capSensor3.set_CS_AutocaL_Millis(0xFFFFFFFF);
  capSensor4.set_CS_AutocaL_Millis(0xFFFFFFFF);
  capSensor5.set_CS_AutocaL_Millis(0xFFFFFFFF);
  capSensor6.set_CS_AutocaL_Millis(0xFFFFFFFF);
}

void loop() {

  for (int i = 0; i < NUM_SENSORS; i++) {
    long sensorValue = sensors[i]->capacitiveSensor(150);
    Serial.print(sensorValue);

    if (i < NUM_SENSORS - 1) {
      Serial.print(",");
    }
  }

  Serial.println();

  delay(20);
}