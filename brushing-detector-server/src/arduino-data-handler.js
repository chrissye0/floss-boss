const gameState = require("./game-state");

let lastSensorValues = [];
let lastBrushSensorValues = [];
let lastFlossSensorValues = [];

let activeToothIndex = null;

//BRUSHING THRESHOLDS
//Light over sensor = active
//go a bit higher for high thresholds (should be higher than a reading so we do not
//trip it with noise)
//and for low thresholds make it enough when we take away the light
//for high we can do 0.9 and for low we can do 0.6 for example to account for noise for light even though
//the the real low is 0.4 and the real high is 0.8 something in the console
//look for the point of where we are at ambient light for the low threshold
//put at 0 if not testing that tooth for low and for high put 0.99 if not testing for the specific tooth
//so if we do not want to include that tooth in testing put these values ^

//BASICALLY JUST CHANGE LOW AND HIGH THREHOLDS BASED ON DATA PLOTTER
//HIGH = BRUSHING ON A TOOTH
//LOW = NOT BRUSHING ON A TOOTH
//ALSO MAKE THE VALUES ACCOUNT FOR NOISE SO FOR HIGH IF IT SAYS 0.7 ON THE PLOTTER
//PUT 0.9 AND IF IT SAYS 0.3 FOR LOW PUT 0.4 OR 0.5 (NEVER PUT THE REAL VALUE ALWAYS GO
//A BIT HIGHER)
//ONLY CHANGE HIGH_SENSOR_THRESHOLDS AND LOW_SENSOR_THRESHOLDS FOR DEBUGGING
//NOTHING ELSE NEEDS TO CHANGE FOR BRUSHING
const HIGH_SENSOR_THRESHOLDS = [0.9, 0.9, 0.9, 0.9, 0.9, 0.9];
const LOW_SENSOR_THRESHOLDS = [0.3, 0.3, 0.3, 0.3, 0.3, 0.3];
// Small change = brushing
const MOTION_THRESHOLD = 0.0001;
let detectedTooth = null;
let brushingDetected = false;
let toothDetected = 0;

//FLOSSING - NEME
// Dynamic floss tracking
// ONLY THINGS THAT SHOULD CHANGE FOR DEBUGGING IS THE FLOSS_PERCENT_THRESHOLD
// AND FLOSS_MIN_SPIKE
let flossBaselines = [0, 0, 0, 0, 0, 0]; //default resting to 0
let flossInitialized = false;
/**
 * DYNAMIC THRESHOLD
 * Changes how extreme the difference must be between resting and contact
 * Adjust if one is always registering true
 * Generally leave in the 20-30% range
 */
const FLOSS_PERCENT_THRESHOLD = 0.20; // spike as percent
/**
 * Controls the minimum the spike must be to trigger
 * Reduces noise
 * Adjust if you're getting 'null'  despite making contact
 * Was mostly seeing 200-400 range
 */
const FLOSS_MIN_SPIKE = 650; // min. spike required
/**
 * Needs to register for a moment to truly trigger in the game
 * Also helps reduce noise
 * Shouldn't need to touch unless the calibration is still taking too long
 */
const FLOSS_FRAMES_REQUIRED = 2; // must be active for time to trigger
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
  // console.log("baselines", flossBaselines);
  //detectedTooth = null;
  let frameTime = performance.now() - timeLastSensorReading;
  //how much time ha spassed since last sensor reading
  timeLastSensorReading = performance.now();
  // Parse incoming sensor values
  let sensorValues = data.trim().split(",").map(Number);

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

      // console.log(performance.now() - toothDetected);
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

  // FLOSSING - NEME
  if (source === "arduino2") {
    let flossIndex = null;
    let maxSpike = 0;
    console.log("baselines", flossBaselines);
    //baseline setting
    if (!flossInitialized) {
      // flossBaselines = sensorValues.slice();
      flossInitialized = true;
    }
    console.log("sensor length", sensorValues.length)
    console.log("floss length", flossBaselines.length)

    for (let i = 0; i < flossBaselines.length; i++) {
      const baseline = flossBaselines[i];
      const current = sensorValues[i] || baseline;
      //reading jump
      const spike = current - baseline;
      //calculating necessary trigger value
      const percentThreshold = baseline * FLOSS_PERCENT_THRESHOLD;
      const passesThreshold =
            spike > percentThreshold && spike > FLOSS_MIN_SPIKE;

      if (passesThreshold) {
        //keeps game from freaking out with noise
        flossFrameCounters[i]++;
      } else {
        flossFrameCounters[i] = 0;

        //only update baselines when NOT spiking
      }

      flossBaselines[i] = flossBaselines[i] * 0.95 + current * 0.05;
      flossBaselines[i] = Math.min(current, flossBaselines[i]);

      //only get the strongest
      if (flossFrameCounters[i] >= FLOSS_FRAMES_REQUIRED && spike > maxSpike) {
        maxSpike = spike;
        flossIndex = i;
      }
    }

    gameState.flossing = {
      flossToothIndex: flossIndex,
      isFlossing: flossIndex !== null,
      sensorValues: sensorValues,
      baselines: flossBaselines,
    };

    //READ THESE IF THINGS ARE BEING SILLY IN THE TERMINAL - NEME
    console.log("[FLOSS STABLE]", flossIndex);
    // console.log(maxSpike / flossBaselines[flossIndex]);
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
