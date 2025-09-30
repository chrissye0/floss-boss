
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

const gameState = require('./game-state');

let lastData = [];
let lastTime = Date.now();

const MAX_DELTA = 30; 
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

const handleData = (data) => {
  const currentTime = Date.now();
  const normalizedValues = [];
  let brushingDetected = false;

  console.log("Sensor Values:");

  for (let i = 0; i < data.length; i++) {
    const currentValue = data[i];
    //Handle first run
    const previousValue = lastData[i] ?? currentValue; 
    const delta = Math.abs(currentValue - previousValue);

    const normalized = clamp(delta / MAX_DELTA, 0, 1);
    normalizedValues.push(normalized);

    console.log(`Sensor ${i}: Raw=${currentValue}, Δ=${delta}, Normalized=${normalized.toFixed(2)}`);

    if (delta > 15 && (currentTime - lastTime > 50)) {
      console.log(`Brushing motion detected! TOOTH ${i}`);
      brushingDetected = true;
      lastTime = currentTime;
    }
  }

  if (brushingDetected) {
    console.log('⚡️ ALERT: Brushing motion detected!');
    gameState.isBrushing = true;
  } else {
    gameState.isBrushing = false;
  }

  lastData = data.slice(); // Save a copy of current data
  return normalizedValues; // Use array wherever needed
};

module.exports = handleData;
