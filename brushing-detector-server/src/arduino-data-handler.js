

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
  const clean = data.trim();
  console.log(`\n[INCOMING] ${source}: "${clean}"`);

  //BRUSHING
  if (source === 'arduino1') {
    const values = clean.split(',').map(Number);

    if (values.some(isNaN)) {
      console.log('[BRUSH] Invalid data, ignoring');
      return;
    }

    let detected = null;
    for (let i = 0; i < values.length; i++) {
      if (values[i] > 0.1) {
        detected = i;
        break;
      }
    }

    gameState.activeToothIndex = detected;
    gameState.isBrushing = detected !== null;
    gameState.sensorValues = values;

    gameState.devices.arduino1 = {
      activeToothIndex: detected,
      isBrushing: detected !== null,
      sensorValues: values
    };

    console.log('[BRUSH STATE]', gameState.devices.arduino1);
  }

  //FLOSSING
  if (source === 'arduino2') {
    const values = clean.split(',').map(Number);

    if (values.some(isNaN)) {
      console.log('[FLOSS] Non-numeric data ignored');
      return;
    }

    const flossIndex = values.findIndex(v => v === 1);

    gameState.devices.arduino2 = {
      flossToothIndex: flossIndex >= 0 ? flossIndex : null,
      isFlossing: flossIndex >= 0,
      sensorValues: values
    };

    console.log('[FLOSS STATE]', gameState.devices.arduino2);
  }
};

module.exports = handleData;



