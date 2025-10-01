
// const gameState = require('./game-state')

// let lastData;

// const handleData = (data) => {

//   // figure delta for everything comparing data[i] to lastData[i]
//   lastData = data;

//   //Print the current value
//   for (let i = 0; i < data.length; i++) {
//     console.log("Sensor ");
//     console.log(i);
//     console.log(": ");
//     console.log(data[i]);
//   }

//   // Brushing motion detection
//   for(let i = 0; i < data.length; i++) {

//     if (delta > 15 && (currentTime - lastTime > 50)) {
//       console.log("Brushing motion detected! TOOTH ");
//       console.log(i + 1);
//       lastTime = currentTime;
//     }

//   }

//   if (data === 'Brushing motion detected!') {
//     console.log('⚡️ ALERT: Brushing motion detected!')
//     gameState.isBrushing = true
//   }

//   else {
//     gameState.isBrushing = false
//   }

// }

// module.exports = handleData;

// const gameState = require('./game-state');

// let lastData = [];
// let lastTime = Date.now();

// const MAX_DELTA = 30; 
// function clamp(value, min, max) {
//   return Math.max(min, Math.min(value, max));
// }

// const handleData = (data) => {
//   const currentTime = Date.now();
//   const normalizedValues = [];
//   let brushingDetected = false;

//   console.log("Sensor Values:");

//   for (let i = 0; i < data.length; i++) {
//     const currentValue = data[i];
//     //Handle first run
//     const previousValue = lastData[i] ?? currentValue; 
//     const delta = Math.abs(currentValue - previousValue);

//     const normalized = clamp(delta / MAX_DELTA, 0, 1);
//     normalizedValues.push(normalized);

//     console.log(`Sensor ${i}: Raw=${currentValue}, Δ=${delta}, Normalized=${normalized.toFixed(2)}`);

//     if (delta > 15 && (currentTime - lastTime > 50)) {
//       console.log(`Brushing motion detected! TOOTH ${i}`);
//       brushingDetected = true;
//       lastTime = currentTime;
//     }
//   }

//   if (brushingDetected) {
//     console.log('⚡️ ALERT: Brushing motion detected!');
//     gameState.isBrushing = true;
//   } else {
//     gameState.isBrushing = false;
//   }

//   lastData = data.slice(); // Save a copy of current data
//   return normalizedValues; // Use array wherever needed
// };

// module.exports = handleData;

const gameState = require('./game-state');

let lastData = [];
let lastTime = Date.now();

// Track how long each tooth (sensor) has been active
let toothTimers = [];

// Track which tooth is currently locked in as being brushed
let activeToothIndex = null;

// Prevent multiple teeth from being selected at the same time
let cooldownActive = false;

// Constants
const MAX_DELTA = 30;                  // Used for normalization
const DELTA_THRESHOLD = 15;           // Minimum change to consider activity
const TOOTH_LOCK_THRESHOLD_MS = 500;  // Time a sensor must be active to lock in
const NUM_TEETH = 2;                  // Number of sensors (photoresistors)

// Initialize timers for each tooth
for (let i = 0; i < NUM_TEETH; i++) {
  toothTimers[i] = 0;
}

// Function to clamp a value between a minimum and maximum
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// Main function to handle sensor data
const handleData = (data) => {
  const currentTime = Date.now();
  const timeDelta = currentTime - lastTime; // Time passed since last reading
  lastTime = currentTime;

  const normalizedValues = [];
  let brushingDetected = false;

  console.log("Sensor Values:");

  for (let i = 0; i < data.length; i++) {
    const currentValue = data[i];
    const previousValue = lastData[i] ?? currentValue; // Fallback for first run
    const delta = Math.abs(currentValue - previousValue);

    // Normalize delta to a 0–1 range
    const normalized = clamp(delta / MAX_DELTA, 0, 1);
    normalizedValues.push(normalized);

    // Print debug info
    console.log(`Sensor ${i}: Raw=${currentValue}, Δ=${delta}, Normalized=${normalized.toFixed(2)}`);

    // If this sensor is active (delta high), increase its timer
    if (delta > DELTA_THRESHOLD) {
      toothTimers[i] += timeDelta;
    } else {
      // Reset timer if not active
      toothTimers[i] = 0;
    }
  }

  // Try to lock in a tooth that has been active long enough
  let lockedTooth = null;

  for (let i = 0; i < toothTimers.length; i++) {
    if (toothTimers[i] >= TOOTH_LOCK_THRESHOLD_MS) {
      lockedTooth = i;
      break;
    }
  }

  // If a tooth qualifies and we're not in cooldown, lock it in
  if (!cooldownActive && lockedTooth !== null) {
    activeToothIndex = lockedTooth;
    cooldownActive = true;
    brushingDetected = true;

    console.log(`LOCKED ON: TOOTH ${activeToothIndex}`);
    console.log('⚡️ ALERT: Brushing motion detected!');

    //Reset all timers to avoid overlaps
    for (let i = 0; i < toothTimers.length; i++) {
      toothTimers[i] = 0;
    }

    // Start cooldown to prevent switching too quickly
    setTimeout(() => {
      cooldownActive = false;
      activeToothIndex = null;
      console.log("Tooth lock reset");
    }, 1000); // Lock lasts for 1 second
  }

  // Update global game state
  gameState.isBrushing = brushingDetected;

  // Save current data for next comparison
  lastData = data.slice();

  // Return useful info 
  return {
    normalizedValues,    // Array of floats between 0–1
    activeToothIndex,    // Index of currently locked tooth, or null
    isBrushing: gameState.isBrushing
  };
};

module.exports = handleData;
