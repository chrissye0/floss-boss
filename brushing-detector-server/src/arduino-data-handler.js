const gameState = require("./game-state");

let lastSensorValues = [];
let lastBrushSensorValues = [];
let lastFlossSensorValues = [];

let activeToothIndex = null;

// Thresholds
// Light over sensor = active
//go a bit higher for high thresholds (should be higher than a reading so we do not
//trip it with noise)
//and for low thresholds enough when we take away the light
//for high we can do 0.9 and for low we can do 0.6 for example to account for noise for light even though
//the low is 0.4 and the high is 0.9 something
//look for the point of where we are at ambient light for the low threshold
//put at 0 if not testing that tooth for low and for high put 0.99 if not testing for the specific tooth
const HIGH_SENSOR_THRESHOLDS = [0.7, 0.9, 0.9, 0.9, 0.9, 0.9];
const LOW_SENSOR_THRESHOLDS = [0.4, 0.5, 0.5, 0.5, 0.5, 0.5];
// Small change = brushing
const MOTION_THRESHOLD = 0.0001;
let detectedTooth = null;
let brushingDetected = false;
let toothDetected = 0;
//FLOSSING THRESHOLDS - NEME
// const FLOSS_THRESHOLDS = [
//   10000, // sensor 0
//   600, // sensor 1
//   700, // sensor 2
//   6000, // sensor 3 PLS FIX HIM
//   11000, // sensor 4
//   12000, // sensor 5
// ];
//FLOSSING - NEME
// Dynamic floss tracking
let flossBaselines = [0, 0, 0, 0, 0, 0];
let flossInitialized = false;
const FLOSS_PERCENT_THRESHOLD = 0.30; // 30% spike
const FLOSS_MIN_SPIKE = 300;          // min. spike required
const FLOSS_FRAMES_REQUIRED = 3;      // must be active for time to trigger
let flossFrameCounters = [0, 0, 0, 0, 0, 0];

let lastLogTime = 0;
const LOG_INTERVAL = 50;
let lastTimeBrushingDetectd = 0;
let timeLastSensorReading = 0;
let sensorDeltaReadings = [[], [], [], [], [], [], [], [], [], [], []];
let sensorDeltaReadingsIndex = 0;
let numReadingsToKeep = 5;

const handleData = (data, source) => {
  console.log("SOURCE:", source, "RAW:", data);
  //detectedTooth = null;
  let frameTime = performance.now() - timeLastSensorReading;
  //how much time ha spassed since last sensor reading
  timeLastSensorReading = performance.now();
  // Parse incoming sensor values
  const sensorValues = data.trim().split(",").map(Number);

  if (source === "arduino1") {
    for (let i = 0; i < sensorValues.length; i++) {
      const current = sensorValues[i];

      // console.log('current', current);

      // Detect the first active tooth
      if (current > HIGH_SENSOR_THRESHOLDS[i]) {
        // console.log("Active tooth", i);
        //if we do not have a tooth currently and the current tooth is not a detected tooth then
        //leave the loop
        if (detectedTooth !== null && i !== detectedTooth) {
          break;
        }
        detectedTooth = i;
        toothDetected = performance.now();


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
      lastBrushSensorValues = sensorValues.slice();
      activeToothIndex = detectedTooth;
      gameState.activeToothIndex = activeToothIndex;
      gameState.isBrushing = activeToothIndex !== null;
      gameState.brushSensorValues = sensorValues;
    }
  }

  // Update game state
  // activeToothIndex = detectedTooth;
  // gameState.activeToothIndex = activeToothIndex;
  // gameState.isBrushing = activeToothIndex !== null;
  // gameState.sensorValues = sensorValues;

  // FLOSSING
  if (source === 'arduino2') {
  let flossIndex = null;
  let maxSpike = 0;

  //baseline setting
  if (!flossInitialized) {
    flossBaselines = sensorValues.slice();
    flossInitialized = true;
  }

  for (let i = 0; i < sensorValues.length; i++) {
    const current = sensorValues[i];
    //reading jump
    const baseline = flossBaselines[i];
    const spike = current - baseline;

    //calculating necessary trigger value
    const percentThreshold = baseline * FLOSS_PERCENT_THRESHOLD;
    const passesThreshold =
      spike > percentThreshold && spike > FLOSS_MIN_SPIKE;

    if (passesThreshold) { //keeps game from freaking out at noise
      flossFrameCounters[i]++;
    } else {
      flossFrameCounters[i] = 0;

      //only update baselines when NOT spiking
      flossBaselines[i] =
        flossBaselines[i] * 0.995 +
        current * 0.005;
    }

    //only get the strongest
    if (
      flossFrameCounters[i] >= FLOSS_FRAMES_REQUIRED &&
      spike > maxSpike
    ) {
      maxSpike = spike;
      flossIndex = i;
    }
  }

  gameState.flossing = {
    flossToothIndex: flossIndex,
    isFlossing: flossIndex !== null,
    sensorValues: sensorValues,
  };

  console.log('[FLOSS STABLE]', flossIndex);
  console.log( maxSpike / flossBaselines[flossIndex]);
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