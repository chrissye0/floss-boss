
// const gameState = require('./game-state');

// let activeToothIndex = null;

// //have the solution if we are over a tooth
// //now have to determine if we are brushing a tooth (brushing motion detected
// //timer not needed)(using true or false values like before)

// // Threshold value to consider a sensor "active"
// // Adjust based on your sensor readings
// const SENSOR_THRESHOLD = 0.1; // Example: value below this means "over tooth"

// const handleData = (data) => {

 
//   let sensorValues = data.trim().split(",").map(Number)

//   console.log(sensorValues);

//   let detectedTooth = null;

//   for (let i = 0; i < sensorValues.length; i++) {
//     const sensorValue = sensorValues[i];

//     // Simple detection: if sensor value drops below threshold, we're over the tooth
//     if (sensorValue > SENSOR_THRESHOLD) {
//       detectedTooth = i;
//       break; // Only detect the first active tooth
//     }
//   }

//   activeToothIndex = detectedTooth;

//   // Update game state
//   gameState.activeToothIndex = activeToothIndex;

//   // return {
//   //   activeToothIndex, // e.g., 0 or 1, or null if not over any tooth
//   // };
// };

// module.exports = handleData;

//works if the light is close range not for farther range brushing**
//when we first put the brush over it renders it as true so what
//if we are just moving the brush and it accidently goes over a tooth that
//we did not mean to go on then it would be true**
//sometimes true and sometimes false while brushng (more true when
//we do not have the cover and less strong with cover on photoresistor)**
//have to make straw wider otherwise it does not detect the light or brushing
//motion is that ok**

const gameState = require('./game-state');

let lastSensorValues = [];
let activeToothIndex = null;

// Thresholds
const SENSOR_THRESHOLD = 0.1;  // Light over sensor = active
const MOTION_THRESHOLD = 0.005; // Small change = brushing

let lastLogTime = 0;
const LOG_INTERVAL = 500; // ms

const handleData = (data) => {
  // Parse incoming sensor values
  const sensorValues = data.trim().split(",").map(Number);

  let detectedTooth = null;
  let brushingDetected = false;

  for (let i = 0; i < sensorValues.length; i++) {
    const current = sensorValues[i];
    const previous = lastSensorValues[i] ?? current;
    const delta = Math.abs(current - previous);

    // Detect the first active tooth
    if (current > SENSOR_THRESHOLD && detectedTooth === null) {
      detectedTooth = i;
    }

    // Detect brushing on that tooth
    if (current > SENSOR_THRESHOLD && delta > MOTION_THRESHOLD) {
      brushingDetected = true;
    }
  }

  // Save values for next frame
  lastSensorValues = sensorValues.slice();

  // Update game state
  activeToothIndex = detectedTooth;
  gameState.activeToothIndex = activeToothIndex;
  gameState.isBrushing = brushingDetected;

  // Throttled logging
  const currentTime = Date.now();
  if (currentTime - lastLogTime >= LOG_INTERVAL) {
    if (activeToothIndex !== null) {
      console.log(`🦷 Tooth ${activeToothIndex} is active`);
    } else {
      console.log("🦷 No tooth currently active");
    }
    console.log(`🪥 Brushing: ${brushingDetected}`);
    lastLogTime = currentTime;
  }
};

module.exports = handleData;


