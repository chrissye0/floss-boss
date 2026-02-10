//Arduino code for brush motion

const gameState = {
  activeToothIndex: null,
  isBrushing: false,
  sensorValues: [],
  flossing: {
    flossToothIndex: null,
    isFlossing: false,
    sensorValues: [],
  }
  //have an array of teeth (array of booleans to see which tooth is being brushed)
  //change later 
}

module.exports = gameState;