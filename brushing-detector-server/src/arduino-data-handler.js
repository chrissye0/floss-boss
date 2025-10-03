
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


const gameState = require('./game-state');

let lastSensorValues = [];
let activeToothIndex = null;

// Thresholds
// Light over sensor = active
const SENSOR_THRESHOLD = 0.1;  
// Small change = brushing
const MOTION_THRESHOLD = 0.0007; 
let detectedTooth = null;
let brushingDetected = false;

let lastLogTime = 0;
const LOG_INTERVAL = 500;
let lastTimeBrushingDetectd = 0;
let timeLastSensorReading = 0;
let sensorDeltaReadings = [];
let sensorDeltaReadingsIndex = 0;
let numReadingsToKeep = 5;

const getAverageReading = () => {
  //get average reading values based on array length 
  let sum = 0;
  for(let i = 0; i < sensorDeltaReadings.length; i++){
    sum = sum + sensorDeltaReadings[i];
  }
  return sum / sensorDeltaReadings.length;
}

const handleData = (data) => {
  let frameTime = performance.now() - timeLastSensorReading;
  //how much time ha spassed since last sensor reading
  timeLastSensorReading = performance.now();
  // Parse incoming sensor values
  const sensorValues = data.trim().split(",").map(Number);

  //print it out with the brighter LEDs and tune them (with an arduino box)
  // console.log(sensorValues)

  for (let i = 0; i < sensorValues.length; i++) {
    const current = sensorValues[i];
    const previous = lastSensorValues[i] ?? current;
    const delta = Math.abs(current - previous) / frameTime;
    sensorDeltaReadings[sensorDeltaReadingsIndex] = delta;
    //makes sure the array only has the last 5 delta values
    sensorDeltaReadingsIndex = (sensorDeltaReadingsIndex + 1) % numReadingsToKeep; 
    //console.log(delta)
    let averageDelta = getAverageReading();

    //console.log(averageDelta);

    // Detect the first active tooth
    if (current > SENSOR_THRESHOLD && detectedTooth === null) {
      detectedTooth = i;
    }

    //console.log(delta)
    // Detect brushing on that tooth
    if (current > SENSOR_THRESHOLD && averageDelta > MOTION_THRESHOLD) {
      brushingDetected = true;
      // save the time with performance.now() to lastTimeBrushingDetected
      lastTimeBrushingDetectd = performance.now()
      console.log(brushingDetected)
    }
    //console.log((performance.now() - lastTimeBrushingDetectd))
    if ((performance.now() - lastTimeBrushingDetectd) > 250) {
      // set brushing detected to false
      brushingDetected = false;
      detectedTooth = null;

      console.log(brushingDetected)

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


