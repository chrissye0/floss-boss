

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

const handleData = (data, source) => {
  console.log(data)
  const values = data.trim().split(',').map(Number);

  console.log(`[INCOMING] ${source}:`, values);

  // ---------- BRUSHING ----------
  if (source === 'arduino1') {
    let detectedTooth = null;

    for (let i = 0; i < values.length; i++) {
      if (values[i] > 0.1) { // your light threshold logic
        detectedTooth = i;
        break;
      }
    }

    gameState.activeToothIndex = detectedTooth;
    gameState.isBrushing = detectedTooth !== null;
    gameState.sensorValues = values;

    // keep legacy fields in sync
    gameState.activeToothIndex = detectedTooth;
    gameState.isBrushing = detectedTooth !== null;
    gameState.sensorValues = values;
  }

  // ---------- FLOSSING ----------
  if (source === 'arduino2') {
    let flossIndex = null;

    for (let i = 0; i < values.length; i++) {
      if (values[i] > 1200) {   // capacitive sensors already thresholded
        flossIndex = i;
        break;
      }
    }

    gameState.flossing.flossToothIndex = flossIndex;
    gameState.flossing.isFlossing = flossIndex !== null;
    gameState.flossing.sensorValues = values;

    console.log('[FLOSS]', {
      flossIndex,
      isFlossing: flossIndex !== null
    });
  }
};

module.exports = handleData;



