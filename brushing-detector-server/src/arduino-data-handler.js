
const gameState = require('./game-state');

let activeToothIndex = null;

// Threshold value to consider a sensor "active"
// Adjust based on your sensor readings
const SENSOR_THRESHOLD = 0.1; // Example: value below this means "over tooth"

const handleData = (data) => {

 
  let sensorValues = data.trim().split(",").map(Number)

  console.log(sensorValues);

  let detectedTooth = null;

  for (let i = 0; i < sensorValues.length; i++) {
    const sensorValue = sensorValues[i];

    // Simple detection: if sensor value drops below threshold, we're over the tooth
    if (sensorValue > SENSOR_THRESHOLD) {
      detectedTooth = i;
      break; // Only detect the first active tooth
    }
  }

  activeToothIndex = detectedTooth;

  // Update game state
  gameState.activeToothIndex = activeToothIndex;

  // return {
  //   activeToothIndex, // e.g., 0 or 1, or null if not over any tooth
  // };
};

module.exports = handleData;

