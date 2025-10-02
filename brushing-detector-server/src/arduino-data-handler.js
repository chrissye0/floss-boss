
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

//can do detection without the straws on it (would that work)
//LEDs are not bright enough for testing (phone is better)(what to do for prototype)
//go over UI changes for brush detection and how to add animations (still a bit weird
//like it does true false really quick and does not remain true for brushing (based on brushing motion))(canvas or webGL)
//is this enough for prototype (having he whole thing with points and timer too)
//same conditionals just add animations based on which tooth is detected****

const gameState = require('./game-state');

let lastSensorValues = [];
let activeToothIndex = null;

// Thresholds
// Light over sensor = active
const SENSOR_THRESHOLD = 0.1;  
// Small change = brushing
const MOTION_THRESHOLD = 0.01; 

let lastLogTime = 0;
const LOG_INTERVAL = 500;
let lastTimeBrushingDetectd = 0;

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

    //console.log(delta)
    // Detect brushing on that tooth
    if (current > SENSOR_THRESHOLD && delta > MOTION_THRESHOLD) {
      brushingDetected = true;
      // save the time with performance.now() to lastTimeBrushingDetected
      lastTimeBrushingDetectd = performance.now()
      console.log(brushingDetected)
    }
    //console.log((performance.now() - lastTimeBrushingDetectd))
    if ((performance.now() - lastTimeBrushingDetectd) > 250) {
      // set brushing detected to false
      brushingDetected = false;

      //console.log(brushingDetected)

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
      //console.log(`🦷 Tooth ${activeToothIndex} is active`);
    } else {
      //console.log("🦷 No tooth currently active");
    }
    //console.log(`🪥 Brushing: ${brushingDetected}`);
    lastLogTime = currentTime;
  }
};

module.exports = handleData;


