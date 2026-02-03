

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


const handleData = (data, source = 'arduino1') => {
  detectedTooth = null;
  let frameTime = performance.now() - timeLastSensorReading;
  timeLastSensorReading = performance.now();

  console.log(`\n[INCOMING] Device: ${source}, Raw data: "${data}"`);

  // Try to parse as numbers (comma-separated)
  let sensorValues = data.trim().split(',').map(Number);

  // Check for NaN (Arduino2 might send "Flossing")
  if (sensorValues.some(isNaN)) {
    console.log(`[PARSE WARNING] ${source} data not numeric, skipping parse.`);
    sensorValues = [];
  } else {
    console.log(`[PARSED] ${source} sensorValues:`, sensorValues);
  }

  // Detect first active tooth
  if (sensorValues.length > 0) {
    for (let i = 0; i < sensorValues.length; i++) {
      if (sensorValues[i] > SENSOR_THRESHOLDS[i]) {
        detectedTooth = i;
        console.log(`[DETECTED] ${source} active tooth index:`, detectedTooth);
        break;
      }
    }
  } else if (data.trim().toLowerCase() === 'flossing') {
    // Special case for Arduino2
    detectedTooth = 0; // or your mapping logic for first tooth
    console.log(`[DETECTED] ${source} says Flossing`);
  } else {
    detectedTooth = -1;
  }

  // Update gameState
  if (!gameState.devices) gameState.devices = {};

  gameState.devices[source] = {
    activeToothIndex: detectedTooth,
    isBrushing: source === 'arduino1' ? detectedTooth !== null : false,
    isFlossing: source === 'arduino2' ? detectedTooth !== null : false,
    sensorValues,
    raw: data,
  };

  console.log('[GAMESTATE UPDATE]', gameState.devices[source]);

  lastSensorValues = sensorValues.slice();
};

module.exports = handleData;


