//libraries
#include <Arduino.h>
#include <CapacitiveSensor.h>

//ports to be read
//CapacitiveSensor capSensor = CapacitiveSensor(yellow,green);
CapacitiveSensor capSensor = CapacitiveSensor(3,2);
//CapacitiveSensor capSensor2 = CapacitiveSensor(5,4);

//wires on the floor of con might affect sensitivity!!

void setup() {
  Serial.begin(9600);
}

void loop() {
  //variables to read sensors
  long sensorValue = capSensor.capacitiveSensor(100);
  //long sensorValue2 = capSensor2.capacitiveSensor(30);

  //debugging
  Serial.println(sensorValue);
   //Serial.println(sensorValue2);
 
  delay(100); 
}
