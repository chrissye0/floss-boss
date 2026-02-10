//libraries
#include <Arduino.h>
#include <CapacitiveSensor.h>

//ports to be read
//CapacitiveSensor capSensor = CapacitiveSensor(yellow,green);
CapacitiveSensor capSensor = CapacitiveSensor(3,2);
CapacitiveSensor capSensor2 = CapacitiveSensor(5,4);
CapacitiveSensor capSensor3 = CapacitiveSensor(7,6);
CapacitiveSensor capSensor4 = CapacitiveSensor(9,8);
CapacitiveSensor capSensor5 = CapacitiveSensor(11,10);

void setup() {
  Serial.begin(9600);
}

void loop() {
  //variables to read sensors
  long sensorValue = capSensor.capacitiveSensor(100);
  long sensorValue2 = capSensor2.capacitiveSensor(100);
  long sensorValue3 = capSensor3.capacitiveSensor(100);
  long sensorValue4 = capSensor4.capacitiveSensor(100);
  long sensorValue5 = capSensor5.capacitiveSensor(100);

  //debugging
  Serial.println(sensorValue);
  Serial.println(sensorValue2);
  Serial.println(sensorValue3);
  Serial.println(sensorValue4);
  Serial.println(sensorValue5);
 
  delay(100); 
}
