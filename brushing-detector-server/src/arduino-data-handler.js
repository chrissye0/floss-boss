

const gameState = require('./game-state');

let lastSensorValues = [];
let activeToothIndex = null;

// Thresholds
// Light over sensor = active
const SENSOR_THRESHOLDS = [0.94, 0.09, 0.09, 0.07, 0.07, 0.07];
// Small change = brushing
const MOTION_THRESHOLD = 0.0001;
let detectedTooth = null;
let brushingDetected = false;

let lastLogTime = 0;
const LOG_INTERVAL = 50;
let lastTimeBrushingDetectd = 0;
let timeLastSensorReading = 0;
let sensorDeltaReadings = [[], [], [], [], [], [], [], [], [], [], []];
let sensorDeltaReadingsIndex = 0;
let numReadingsToKeep = 5;


const handleData = (data) => {
  detectedTooth = null;
  let frameTime = performance.now() - timeLastSensorReading;
  //how much time ha spassed since last sensor reading
  timeLastSensorReading = performance.now();
  // Parse incoming sensor values
  const sensorValues = data.trim().split(",").map(Number);

  for (let i = 0; i < sensorValues.length; i++) {
    const current = sensorValues[i];

    console.log('current', current);

    // Detect the first active tooth
    if (current > SENSOR_THRESHOLDS[i]) {
      console.log('Active tooth', i);
      detectedTooth = i;

      break;
    }
  }

  // Update game state
  // POSSIBLE ISSUE - only sending the last property? send as object instead?
  activeToothIndex = detectedTooth;
  gameState.activeToothIndex = activeToothIndex;
  gameState.isBrushing = activeToothIndex !== null;
  gameState.sensorValues = sensorValues;

  // Throttled logging
  const currentTime = Date.now();
  if (currentTime - lastLogTime >= LOG_INTERVAL) {
    lastLogTime = currentTime;
  }

  // Save values for next frame
  lastSensorValues = sensorValues.slice();
};

module.exports = handleData;


