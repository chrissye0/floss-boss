const gameState = require("./game-state");

let lastSensorValues = [];
let activeToothIndex = null;

// Thresholds
// Light over sensor = active
//go a bit higher for high thresholds (should be higher than a reading so we do not
//trip it with noise)
//and for low thresholds enough when we take away the light
//for high we can do 0.9 and for low we can do 0.6 for example to account for noise for light even though
//the low is 0.4 and the high is 0.9 something
//look for the point of where we are at ambient light for the low threshold
const HIGH_SENSOR_THRESHOLDS = [0.9, 0.9, 0.99, 0.99, 0.99, 0.99];
const LOW_SENSOR_THRESHOLDS = [0.3, 0.3, 0, 0, 0, 0];
// Small change = brushing
const MOTION_THRESHOLD = 0.0001;
let detectedTooth = null;
let brushingDetected = false;
let toothDetected = 0;

let lastLogTime = 0;
const LOG_INTERVAL = 50;
let lastTimeBrushingDetectd = 0;
let timeLastSensorReading = 0;
let sensorDeltaReadings = [[], [], [], [], [], [], [], [], [], [], []];
let sensorDeltaReadingsIndex = 0;
let numReadingsToKeep = 5;

const handleData = (data, source) => {
  //detectedTooth = null;
  let frameTime = performance.now() - timeLastSensorReading;
  //how much time ha spassed since last sensor reading
  timeLastSensorReading = performance.now();
  // Parse incoming sensor values
  const sensorValues = data.trim().split(",").map(Number);


  if (source === "arduino1") {
    for (let i = 0; i < sensorValues.length; i++) {
      const current = sensorValues[i];

      //console.log('current', current);

      // Detect the first active tooth
      if (current > HIGH_SENSOR_THRESHOLDS[i]) {
        console.log("Active tooth", i);
        //if we do not have a tooth currently and the current tooth is not a detected tooth then
        //leave the loop
        if (detectedTooth !== null && i !== detectedTooth) {
          break;
        }
        detectedTooth = i;
        toothDetected = performance.now();

        break;
      }

      console.log(performance.now() - toothDetected);
      //only allowed to turn it off if we are on a tooth and below the threshold for quarter a second
      if (
        detectedTooth === i &&
        current < LOW_SENSOR_THRESHOLDS[i] &&
        performance.now() - toothDetected > 250
      ) {
        detectedTooth = null;
      }
    }
  }

  // Update game state
  activeToothIndex = detectedTooth;
  gameState.activeToothIndex = activeToothIndex;
  gameState.isBrushing = activeToothIndex !== null;
  gameState.sensorValues = sensorValues;

  // FLOSSING
  if (source === 'arduino2') {
    let flossIndex = null;
    let maxValue = null;

    // Find strongest active floss sensor
    for (let i = 0; i < sensorValues.length; i++) {
      if (sensorValues[i] > 2000 && sensorValues[i] > maxValue) { //thresholds here - NEME
        maxValue = sensorValues[i];
        flossIndex = i;
      }
    }

    gameState.flossing = {
      flossToothIndex: flossIndex,
      isFlossing: flossIndex !== null,
      sensorValues: sensorValues,
    };

    console.log('[FLOSS]', gameState.flossing);
  }


  // Throttled logging
  const currentTime = Date.now();
  if (currentTime - lastLogTime >= LOG_INTERVAL) {
    lastLogTime = currentTime;
  }

  // Save values for next frame
  lastSensorValues = sensorValues.slice();
};

module.exports = handleData;
